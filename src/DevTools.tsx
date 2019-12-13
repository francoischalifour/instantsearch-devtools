import * as React from 'react';
import styled from 'styled-components';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

import { version } from '../package.json';
import { Node, DevToolsWindow } from './types';
import { chakraTheme } from './theme';
import { Tree } from './Tree';
import { Sidebar } from './Sidebar';
import { createDevToolsMiddleware } from './createDevToolsMiddleware';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #282c34;
  color: #fff;
`;

const TreeWrapper = styled.main`
  flex: 2;
`;

const SidebarWrapper = styled.aside`
  flex: 1;
`;

export function DevTools() {
  const [rootNode, setRootNode] = React.useState<Node | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  React.useEffect(() => {
    const devToolsMiddleware = createDevToolsMiddleware({
      setRootNode,
      setSelectedIndex,
    });

    (window as DevToolsWindow).__INSTANTSEARCH_DEVTOOLS__ = {
      version,
      getMiddleware: () => devToolsMiddleware,
    };
  }, []);

  return (
    <ThemeProvider theme={chakraTheme}>
      <CSSReset />

      {rootNode === null ? (
        <Idling />
      ) : (
        <App
          rootNode={rootNode}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </ThemeProvider>
  );
}

export interface AppProps {
  rootNode: Node;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedIndex: number;
}

function App({ rootNode, selectedIndex, setSelectedIndex }: AppProps) {
  return (
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
  );
}

const LoadingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const LoadingTitle = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
`;

const LoadingInstruction = styled.p`
  line-height: 1.6;
`;

function Idling() {
  const [title, setTitle] = React.useState<React.ReactNode | null>(null);
  const [isEnabled, setIsEnabled] = React.useState<boolean>(true);

  React.useEffect(() => {
    let timerId;

    timerId = setTimeout(() => {
      setTitle('Waiting for InstantSearch...');

      clearTimeout(timerId);
    }, 500);

    timerId = setTimeout(() => {
      setTitle('InstantSearch was not detected');
      setIsEnabled(false);

      clearTimeout(timerId);
    }, 1500);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <Container>
      <LoadingWrapper>
        {title && <LoadingTitle>{title}</LoadingTitle>}
        {!isEnabled && (
          <div>
            <LoadingInstruction>
              You may need to trigger a change in the InstantSearch UI.
            </LoadingInstruction>

            <LoadingInstruction>
              Make sure that the page is running a compatible version of
              InstantSearch.
            </LoadingInstruction>
          </div>
        )}
      </LoadingWrapper>
    </Container>
  );
}
