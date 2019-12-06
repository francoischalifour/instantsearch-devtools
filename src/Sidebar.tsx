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
  Box,
  Icon,
  Link,
  Text,
} from '@chakra-ui/core';

import { Node } from './Tree';
import { WidgetName } from './WidgetName';
import { jsonTheme } from './theme';
import { isIndexWidget } from './isIndexWidget';
import { logWidgetToConsole } from './logWidgetToConsole';
import { SearchParameters } from './types';

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
  root: Node;
  selectedIndex: number;
}

function getWidgetFromId(node: Node, id: number): Node {
  let count = 0;

  function getWidgetFromIdRec(node: Node, id: number): Node {
    if (count === id) {
      return node;
    }

    count++;

    return node.children.find(childNode => getWidgetFromIdRec(childNode, id))!;
  }

  return getWidgetFromIdRec(node, id);
}

export function Sidebar({ root, selectedIndex }: SidebarProps) {
  const widget = getWidgetFromId(root, selectedIndex);
  const { onCopy: onCopySearchParameters } = useClipboard(
    widget.searchParameters
  );
  const { onCopy: onCopyUiState } = useClipboard(
    JSON.stringify(widget.state, null, 2)
  );
  const { onCopy: onCopySearchResults } = useClipboard(
    isIndexWidget(widget)
      ? JSON.stringify(widget.instance.getResults(), null, 2)
      : null
  );
  const [
    viewExhaustiveSearchParameters,
    setViewExhaustiveSearchParameters,
  ] = React.useState<boolean>(false);
  const [isStateExpanded, setIsStateExpanded] = React.useState<boolean>(true);
  const [
    isSearchParametersExpanded,
    setIsSearchParametersExpanded,
  ] = React.useState<boolean>(false);
  const [isSearchResultsExpanded, setIsSearchResultsExpanded] = React.useState<
    boolean
  >(false);

  return (
    <Container>
      <Box
        padding="1rem"
        display="flex"
        alignItems="center"
        marginBottom="0.5rem"
        borderBottom="1px solid #3d424a"
      >
        <Box flex="1" textAlign="left">
          <WidgetName>{widget.name}</WidgetName>
        </Box>

        <Tooltip label="Read this widget documentation">
          <Link
            href={widget.documentationUrl}
            isExternal
            onClick={event => {
              event.stopPropagation();
            }}
            marginRight={2}
          >
            <Icon
              aria-label="Read this widget documentation"
              // @ts-ignore documentation is a custom icon
              name="documentation"
              size="1rem"
            />
          </Link>
        </Tooltip>
        <Tooltip label="Log this widget to the console">
          <Icon
            aria-label="Log this widget to the console"
            // @ts-ignore debug is a custom icon
            name="debug"
            size="1rem"
            paddingTop="1px"
            cursor="pointer"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();

              logWidgetToConsole(widget);
            }}
          />
        </Tooltip>
      </Box>

      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
        {isIndexWidget(widget.instance) && (
          <AccordionItem>
            <Header _hover={{ backgroundColor: 'transparent' }}>
              <Box flex="1" textAlign="left">
                Props
              </Box>
              <AccordionIcon />
            </Header>

            <AccordionPanel className="code">
              <JSONTree
                data={{
                  indexName: widget.instance.getIndexName(),
                  indexId: widget.instance.getIndexId(),
                }}
                hideRoot
                invertTheme={false}
                theme={jsonTheme}
              />
            </AccordionPanel>
          </AccordionItem>
        )}

        <AccordionItem>
          <Header _hover={{ backgroundColor: 'transparent' }}>
            <Box flex="1" textAlign="left">
              State
            </Box>

            <Tooltip
              label="Expand all attributes"
              aria-label="Expand all state attributes"
            >
              <Icon
                name="up-down"
                marginRight={2}
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  setIsStateExpanded(prevValue => !prevValue);
                }}
              />
            </Tooltip>
            <Tooltip
              label="Copy to clipboard"
              aria-label="Copy UI state to clipboard"
            >
              <Icon
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
            {Object.keys(widget.state).length === 0 ? (
              <Text fontStyle="italic">Empty</Text>
            ) : (
              <div className="code">
                <JSONTree
                  data={widget.state}
                  hideRoot
                  invertTheme={false}
                  theme={jsonTheme}
                  shouldExpandNode={() => isStateExpanded}
                />
              </div>
            )}
          </AccordionPanel>
        </AccordionItem>

        {widget.searchParameters && (
          <AccordionItem>
            <Header _hover={{ backgroundColor: 'transparent' }}>
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
                label="Expand all attributes"
                aria-label="Expand all search parameters attributes"
              >
                <Icon
                  name="up-down"
                  marginRight={2}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    setIsSearchParametersExpanded(prevValue => !prevValue);
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
                    ? widget.searchParameters
                    : getSimplifiedSearchParameters(widget.searchParameters)
                }
                hideRoot
                invertTheme={false}
                theme={jsonTheme}
                shouldExpandNode={() => isSearchParametersExpanded}
              />
            </AccordionPanel>
          </AccordionItem>
        )}

        {isIndexWidget(widget.instance) && (
          <AccordionItem>
            <Header _hover={{ backgroundColor: 'transparent' }}>
              <Box flex="1" textAlign="left">
                Search results
              </Box>

              <Tooltip
                label="Expand all attributes"
                aria-label="Expand all search results attributes"
              >
                <Icon
                  name="up-down"
                  marginRight={2}
                  onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    setIsSearchResultsExpanded(prevValue => !prevValue);
                  }}
                />
              </Tooltip>
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

            <AccordionPanel>
              {widget.instance.getResults() === null ? (
                <Text fontStyle="italic">None</Text>
              ) : (
                <div className="code">
                  <JSONTree
                    data={widget.instance.getResults()}
                    hideRoot
                    invertTheme={false}
                    theme={jsonTheme}
                    shouldExpandNode={() => isSearchResultsExpanded}
                  />
                </div>
              )}
            </AccordionPanel>
          </AccordionItem>
        )}
      </Accordion>
    </Container>
  );
}
