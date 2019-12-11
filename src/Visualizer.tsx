import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { chakraTheme } from './theme';

import { Node } from './types';
import { Tree } from './Tree';
import { Sidebar } from './Sidebar';
import { createDevToolsMiddleware } from './createDevToolsMiddleware';

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
    const devToolsMiddleware = createDevToolsMiddleware({
      setRootNode,
      setSelectedIndex,
    });

    (window as any).__INSTANTSEARCH_DEVTOOLS_GLOBAL_MIDDLEWARE__ = devToolsMiddleware;
  }, []);

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
