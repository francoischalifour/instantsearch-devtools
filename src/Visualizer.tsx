import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { chakraTheme } from './theme';

import { Tree, Node } from './Tree';
import { Sidebar } from './Sidebar';
import { getWidgetTreeFromRoot } from './getWidgetTreeFromRoot';
import { SearchResults } from './types';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;
const TreeWrapper = styled.main`
  flex: 2;
  background-color: #282c34;
  color: #fff;
`;

const SidebarWrapper = styled.aside`
  flex: 1;
`;

export function Visualizer() {
  const [rootNode, setRootNode] = React.useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(rootNode);
  const [
    searchResults,
    setSearchResults,
  ] = React.useState<SearchResults | null>(null);

  React.useEffect(() => {
    function visualizerMiddleware({ instantSearchInstance }) {
      return {
        onStateChange({ state }) {
          const newRootNode = getWidgetTreeFromRoot(
            instantSearchInstance.mainIndex,
            state
          );
          setRootNode(newRootNode);
          setSelectedNode(newRootNode);
          setSearchResults(instantSearchInstance.helper.lastResults);
        },
        subscribe() {
          const newRootNode = getWidgetTreeFromRoot(
            instantSearchInstance.mainIndex,
            instantSearchInstance._initialUiState
          );
          setRootNode(newRootNode);
          setSelectedNode(newRootNode);
          setSearchResults(instantSearchInstance.helper.lastResults);
        },
        unsubscribe() {
          setRootNode(null);
          setSearchResults(null);
        },
      };
    }

    (window as any).__INSTANTSEARCH_DEVTOOLS_GLOBAL_MIDDLEWARE__ = visualizerMiddleware;
  }, [window]);

  if (!rootNode || !selectedNode) {
    return null;
  }

  return (
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />

      <Container>
        <TreeWrapper>
          <Tree
            node={rootNode}
            selectedNode={selectedNode}
            onSelect={setSelectedNode}
          />
        </TreeWrapper>

        <SidebarWrapper>
          <Sidebar selectedNode={selectedNode} searchResults={searchResults} />
        </SidebarWrapper>
      </Container>
    </ThemeProvider>
  );
}
