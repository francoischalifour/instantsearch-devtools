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
} from 'instantsearch.js/es/widgets';
import algoliasearch from 'algoliasearch';
import {
  ThemeProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Box,
} from '@chakra-ui/core';

import { Visualizer } from '../.';

const search = instantsearch({
  searchClient: algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  indexName: 'instant_search',
  initialUiState: {
    instant_search: {
      query: 'Apple',
    },
  },
});

search.addWidgets([
  configure({
    attributesToSnippet: ['description'],
    hitsPerPage: 8,
  }),
  index({ indexName: 'instant_search_media' }).addWidgets([
    configure({
      hitsPerPage: 20,
    }),
  ]),
]);

search.start();

function App() {
  const searchBoxRef = React.useRef(null);
  const infiniteHitsRef = React.useRef(null);
  const refinementListRef = React.useRef(null);

  React.useEffect(() => {
    search.addWidgets([
      searchBox({
        container: searchBoxRef.current!,
      }),
      infiniteHits({
        container: infiniteHitsRef.current!,
        templates: {
          item: '{{name}}',
        },
      }),
      refinementList({
        container: refinementListRef.current!,
        attribute: 'brand',
      }),
    ]);
  }, []);

  return (
    <ThemeProvider>
      <Tabs>
        <TabList>
          <Tab>Visualizer</Tab>
          <Tab>App</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Visualizer />
          </TabPanel>

          <TabPanel padding="1rem">
            <Box marginBottom="1rem" ref={searchBoxRef} />

            <Grid templateColumns="20% 80%">
              <Box ref={refinementListRef} />
              <Box ref={infiniteHitsRef} />
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
