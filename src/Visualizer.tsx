import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import { Tree, Node } from './Tree';
import { Sidebar } from './Sidebar';
import { getWidgetTreeFromRoot } from './getWidgetTreeFromRoot';
import { UiState, InstantSearch } from './types';

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

interface VisualizerProps {
  instantSearchInstance: InstantSearch;
  uiState: UiState;
}

export function Visualizer({
  instantSearchInstance,
  uiState,
}: VisualizerProps) {
  const rootNode = getWidgetTreeFromRoot(
    instantSearchInstance.mainIndex,
    uiState
  );

  const [selectedNode, setSelectedNode] = React.useState<Node>(rootNode);

  return (
    <ThemeProvider>
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
          <Sidebar
            selectedNode={selectedNode}
            searchResults={instantSearchInstance.helper.lastResults}
          />
        </SidebarWrapper>
      </Container>
    </ThemeProvider>
  );
}
