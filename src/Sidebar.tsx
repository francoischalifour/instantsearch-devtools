import React from 'react';
import styled from 'styled-components';
import JSONTree from 'react-json-tree';
import ReachTooltip from '@reach/tooltip';
import '@reach/tooltip/styles.css';
import {
  useClipboard,
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Icon,
} from '@chakra-ui/core';

import { Node } from './Tree';
import { jsonTheme } from './theme';
import { logWidgetToConsole } from './logWidgetToConsole';
import { SearchResults, SearchParameters } from './types';

function getSimplifiedSearchParameters(searchParameters: SearchParameters) {
  return Object.keys(searchParameters).reduce((acc, key) => {
    const value = searchParameters[key];

    if (
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'string' && value !== '') ||
      typeof value === 'number' ||
      (typeof value === 'object' && Object.keys(value).length > 0)
    ) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

const Container = styled.div`
  color: #fff;
  background-color: #282c34;
  border-left: 1px solid #3d424a;
  height: 100%;
`;

const Header = styled(AccordionHeader)`
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;

  &:hover {
    background: transparent;
  }
`;

const Tooltip = styled(ReachTooltip)`
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  z-index: 10000002;
`;

interface SidebarProps {
  selectedNode: Node;
  searchResults: SearchResults;
}

export function Sidebar({ selectedNode, searchResults }: SidebarProps) {
  const { onCopy: onCopySearchParameters } = useClipboard(
    selectedNode.searchParameters
  );
  const { onCopy: onCopyUiState } = useClipboard(
    JSON.stringify(selectedNode.state, null, 2)
  );
  const { onCopy: onCopySearchResults } = useClipboard(
    JSON.stringify(searchResults, null, 2)
  );
  const [
    viewExhaustiveSearchParameters,
    setViewExhaustiveSearchParameters,
  ] = React.useState<boolean>(false);

  return (
    <Container>
      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
        <AccordionItem>
          <Header>
            <Box flex="1" textAlign="left">
              Widget
            </Box>
            <Tooltip label="Log this widget to the console">
              <Icon
                aria-label="Log this widget to the console"
                // @ts-ignore debug is a custom icon
                name="debug"
                size="1rem"
                marginRight={2}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  logWidgetToConsole(selectedNode);
                }}
              />
            </Tooltip>
            <AccordionIcon />
          </Header>

          <AccordionPanel>
            {selectedNode.name}{' '}
            {selectedNode.type === 'ais.index' && <Badge>Index</Badge>}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <Header>
            <Box flex="1" textAlign="left">
              State
            </Box>

            <Tooltip
              label="Copy to clipboard"
              aria-label="Copy UI state to clipboard"
            >
              <Icon
                aria-label="Copy to clipboard"
                name="copy"
                marginRight={2}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  onCopyUiState!();
                }}
              />
            </Tooltip>
            <AccordionIcon />
          </Header>

          <AccordionPanel>
            {Object.keys(selectedNode.state).length === 0 ? (
              <span style={{ fontStyle: 'italic' }}>Empty</span>
            ) : (
              <div className="code">
                <JSONTree
                  data={selectedNode.state}
                  hideRoot
                  invertTheme={false}
                  theme={jsonTheme}
                  shouldExpandNode={() => true}
                />
              </div>
            )}
          </AccordionPanel>
        </AccordionItem>

        {selectedNode.searchParameters && (
          <AccordionItem>
            <Header>
              <Box flex="1" textAlign="left">
                Search parameters
              </Box>
              <Tooltip
                label={
                  viewExhaustiveSearchParameters
                    ? 'View simplified'
                    : 'View exhaustive'
                }
                aria-label={
                  viewExhaustiveSearchParameters
                    ? 'View simplified search parameters'
                    : 'View exhaustive search parameters'
                }
              >
                <Icon
                  aria-label={
                    viewExhaustiveSearchParameters
                      ? 'View simplified'
                      : 'View exhaustive'
                  }
                  name={viewExhaustiveSearchParameters ? 'view-off' : 'view'}
                  marginRight={3}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    setViewExhaustiveSearchParameters(prevValue => !prevValue);
                  }}
                />
              </Tooltip>
              <Tooltip
                label="Copy to clipboard"
                aria-label="Copy search parameters to clipboard"
              >
                <Icon
                  aria-label="Copy to clipboard"
                  name="copy"
                  marginRight={2}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    onCopySearchParameters!();
                  }}
                />
              </Tooltip>
              <AccordionIcon />
            </Header>

            <AccordionPanel className="code">
              <JSONTree
                data={
                  viewExhaustiveSearchParameters
                    ? selectedNode.searchParameters
                    : getSimplifiedSearchParameters(
                        selectedNode.searchParameters
                      )
                }
                hideRoot
                invertTheme={false}
                theme={jsonTheme}
              />
            </AccordionPanel>
          </AccordionItem>
        )}

        {searchResults && (
          <AccordionItem>
            <Header>
              <Box flex="1" textAlign="left">
                Search results
              </Box>
              <Tooltip
                label="Copy to clipboard"
                aria-label="Copy search results to clipboard"
              >
                <Icon
                  aria-label="Copy to clipboard"
                  name="copy"
                  marginRight={2}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    onCopySearchResults!();
                  }}
                />
              </Tooltip>
              <AccordionIcon />
            </Header>

            <AccordionPanel className="code">
              <JSONTree
                data={searchResults}
                hideRoot
                invertTheme={false}
                theme={jsonTheme}
              />
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Container>
  );
}
