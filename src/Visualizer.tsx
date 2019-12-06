import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { chakraTheme } from './theme';

import { Tree, Node } from './Tree';
import { Sidebar } from './Sidebar';
import { getWidgetTreeFromRoot } from './getWidgetTreeFromRoot';

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
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  React.useEffect(() => {
    function visualizerMiddleware({ instantSearchInstance }) {
      return {
        onStateChange({ state }) {
          const newRootNode = getWidgetTreeFromRoot(
            instantSearchInstance.mainIndex,
            state
          );
          setRootNode(newRootNode);
        },
        subscribe() {
          const newRootNode = getWidgetTreeFromRoot(
            instantSearchInstance.mainIndex,
            instantSearchInstance._initialUiState
          );
          setRootNode(newRootNode);
          setSelectedIndex(0);
        },
        unsubscribe() {
          setRootNode(null);
          setSelectedIndex(0);
        },
      };
    }

    (window as any).__INSTANTSEARCH_DEVTOOLS_GLOBAL_MIDDLEWARE__ = visualizerMiddleware;
  }, [window]);

  if (!rootNode || selectedIndex === null) {
    return null;
  }

  return (
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />

      <Container>
        <TreeWrapper>
          <Tree
            node={rootNode}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </TreeWrapper>

        <SidebarWrapper>
          <Sidebar root={rootNode} selectedIndex={selectedIndex} />
        </SidebarWrapper>
      </Container>
    </ThemeProvider>
  );
}
