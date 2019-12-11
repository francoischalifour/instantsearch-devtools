import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import instantsearch from 'instantsearch.js';
import {
  searchBox,
  refinementList,
  configure,
  hits,
  pagination,
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
  Heading,
} from '@chakra-ui/core';

import { DevTools } from '../.';

const search = instantsearch({
  searchClient: algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  indexName: 'instant_search',
  initialUiState: {
    instant_search: {
      query: 'Apple',
    },
  },
});

const mediaIndex = index({ indexName: 'instant_search_media' });

search.addWidgets([
  configure({
    attributesToSnippet: ['description'],
    hitsPerPage: 8,
  }),
  mediaIndex.addWidgets([
    configure({
      hitsPerPage: 4,
    }),
  ]),
]);

search.start();

function App() {
  const searchBoxRef = React.useRef(null);
  const refinementListRef = React.useRef(null);
  const productsHitsRef = React.useRef(null);
  const mediaHitsRef = React.useRef(null);
  const paginationRef = React.useRef(null);

  React.useEffect(() => {
    search.addWidgets([
      searchBox({
        container: searchBoxRef.current!,
      }),
      hits({
        container: productsHitsRef.current!,
        templates: {
          item: '{{name}}',
        },
      }),
      refinementList({
        container: refinementListRef.current!,
        attribute: 'brand',
      }),
      pagination({
        container: paginationRef.current!,
      }),
    ]);

    mediaIndex.addWidgets([
      hits({
        container: mediaHitsRef.current!,
        templates: {
          item: '{{title}}',
        },
      }),
    ]);
  }, []);

  return (
    <ThemeProvider>
      <Tabs>
        <TabList
          background="#282c34"
          color="#afb3b9"
          borderWidth="1px"
          borderColor="#3d424a"
        >
          <Tab _selected={{ color: '#fff' }}>DevTools</Tab>
          <Tab _selected={{ color: '#fff' }}>App</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DevTools />
          </TabPanel>

          <TabPanel padding="1rem">
            <Box marginBottom="1rem" ref={searchBoxRef} />

            <Grid templateColumns="20% 80%">
              <Box ref={refinementListRef} />

              <div>
                <Heading>Products</Heading>
                <Box ref={productsHitsRef} />
                <Heading>Articles</Heading>
                <Box ref={mediaHitsRef} />
                <Box ref={paginationRef} />
              </div>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
