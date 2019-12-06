import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import instantsearch from 'instantsearch.js';
import {
  searchBox,
  infiniteHits,
  refinementList,
  configure,
  index,
} from 'instantsearch.js/es-old/widgets';
import algoliasearch from 'algoliasearch';
import {
  ThemeProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/core';

import { Visualizer } from '../.';

const search = instantsearch({
  searchClient: algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  indexName: 'instant_search',
});

search.addWidgets([
  configure({
    attributesToSnippet: ['description'],
  }),
  index({ indexName: 'instant_search_media' }).addWidgets([
    configure({
      hitsPerPage: 20,
    }),
  ]),
]);

search.start();

function App() {
  const [uiState, setUiState] = React.useState(null);
  const searchBoxRef = React.useRef<HTMLElement>(null);
  const infiniteHitsRef = React.useRef<HTMLElement>(null);
  const refinementListRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    search.addWidgets([
      searchBox({
        container: searchBoxRef.current!,
      }),
      infiniteHits({
        container: infiniteHitsRef.current!,
      }),
      refinementList({
        container: refinementListRef.current!,
        attribute: 'brand',
      }),
    ]);
  }, []);

  React.useEffect(() => {
    function visualizerMiddleware({ instantSearchInstance }) {
      return {
        onStateChange({ state }) {
          console.log('onStateChange', state);
          setUiState(state);
        },
        subscribe() {
          setUiState(instantSearchInstance._initialUiState);
        },
        unsubscribe() {},
      };
    }

    search.EXPERIMENTAL_use(visualizerMiddleware);
  }, []);

  return (
    <ThemeProvider>
      <Tabs>
        <TabList>
          <Tab>Visualizer</Tab>
          <Tab>InstantSearch</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {uiState && (
              <Visualizer instantSearchInstance={search} uiState={uiState} />
            )}
          </TabPanel>

          <TabPanel>
            <div ref={searchBoxRef} />
            <div ref={refinementListRef} />
            <div ref={infiniteHitsRef} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
