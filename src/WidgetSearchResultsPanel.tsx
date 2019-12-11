import React from 'react';
import JSONTree from 'react-json-tree';
import {
  AccordionIcon,
  AccordionPanel,
  Box,
  Icon,
  Text,
  useClipboard,
} from '@chakra-ui/core';

import { Node } from './types';
import { jsonTheme } from './theme';
import { getJsonItemString } from './getJsonItemString';
import { isIndexWidget } from './isIndexWidget';
import { getObjectWithoutEmptyValues } from './getObjectWithoutEmptyValues';
import { PanelHeader } from './PanelHeader';
import { PanelTooltip } from './PanelTooltip';

interface WidgetSearchResultsPanelProps {
  widget: Node;
}

export function WidgetSearchResultsPanel({
  widget,
}: WidgetSearchResultsPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [isExhaustive, setIsExhaustive] = React.useState<boolean>(false);
  const { onCopy } = useClipboard(
    JSON.stringify(widget.searchParameters, null, 2)
  );

  if (!isIndexWidget(widget.node)) {
    return null;
  }

  return (
    <>
      <PanelHeader _hover={{ backgroundColor: 'transparent' }}>
        <Box flex="1" textAlign="left">
          Search results
        </Box>

        <PanelTooltip
          label={isExhaustive ? 'View simplified' : 'View exhaustive'}
          aria-label={
            isExhaustive
              ? 'View simplified search results'
              : 'View exhaustive search results'
          }
        >
          <Icon
            aria-label={isExhaustive ? 'View simplified' : 'View exhaustive'}
            name={isExhaustive ? 'view-off' : 'view'}
            marginRight={3}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();

              setIsExhaustive(prevValue => !prevValue);
            }}
          />
        </PanelTooltip>
        <PanelTooltip
          label="Expand all attributes"
          aria-label="Expand all search results attributes"
        >
          <Icon
            name="up-down"
            marginRight={2}
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();

              setIsExpanded(prevValue => !prevValue);
            }}
          />
        </PanelTooltip>
        <PanelTooltip
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

              onCopy!();
            }}
          />
        </PanelTooltip>
        <AccordionIcon />
      </PanelHeader>

      <AccordionPanel>
        {widget.node.getResults() === null ? (
          <Text fontStyle="italic">None</Text>
        ) : (
          <div className="code">
            <JSONTree
              data={
                isExhaustive
                  ? widget.node.getResults()
                  : getObjectWithoutEmptyValues(widget.node.getResults())
              }
              hideRoot
              invertTheme={false}
              theme={jsonTheme}
              shouldExpandNode={() => isExpanded}
              getItemString={getJsonItemString}
            />
          </div>
        )}
      </AccordionPanel>
    </>
  );
}
