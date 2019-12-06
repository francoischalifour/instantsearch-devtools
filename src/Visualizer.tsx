import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { chakraTheme } from './theme';

import { Tree, Node } from './Tree';
import { Sidebar } from './Sidebar';
import { getWidgetTreeFromRoot } from './getWidgetTreeFromRoot';
import { UiState, SearchResults } from './types';

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
  const [uiState, setUiState] = React.useState<UiState>({});
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
          setUiState(state);
          setRootNode(
            getWidgetTreeFromRoot(instantSearchInstance.mainIndex, state)
          );
          setSearchResults(instantSearchInstance.helper.lastResults);
        },
        subscribe() {
          setUiState(instantSearchInstance._initialUiState);
          setRootNode(
            getWidgetTreeFromRoot(
              instantSearchInstance.mainIndex,
              instantSearchInstance._initialUiState
            )
          );
          setSearchResults(instantSearchInstance.helper.lastResults);
        },
        unsubscribe() {
          setUiState({});
          setRootNode(null);
          setSearchResults(null);
        },
      };
    }

    (window as any).__INSTANTSEARCH_DEVTOOLS_GLOBAL_MIDDLEWARE__ = visualizerMiddleware;
  }, [window]);

  React.useEffect(() => {
    setSelectedNode(rootNode);
  }, [uiState]);

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
