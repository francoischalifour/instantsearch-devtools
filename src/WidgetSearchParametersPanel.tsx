import React from 'react';
import {
  AccordionIcon,
  AccordionPanel,
  Box,
  Icon,
  useClipboard,
} from '@chakra-ui/core';

import { Node } from './types';
import { getObjectWithoutEmptyValues } from './getObjectWithoutEmptyValues';
import { PanelHeader } from './PanelHeader';
import { PanelTooltip } from './PanelTooltip';
import { JsonTree } from './JsonTree';

interface WidgetSearchParametersPanelProps {
  widget: Node;
}

export function WidgetSearchParametersPanel({
  widget,
}: WidgetSearchParametersPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [isExhaustive, setIsExhaustive] = React.useState<boolean>(false);
  const { onCopy } = useClipboard(
    JSON.stringify(widget.searchParameters, null, 2)
  );

  if (!widget.searchParameters) {
    return null;
  }

  return (
    <>
      <PanelHeader _hover={{ backgroundColor: 'transparent' }}>
        <Box flex="1" textAlign="left">
          Search parameters
        </Box>

        <PanelTooltip
          label={isExhaustive ? 'View simplified' : 'View exhaustive'}
          aria-label={
            isExhaustive
              ? 'View simplified search parameters'
              : 'View exhaustive search parameters'
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
          aria-label="Expand all search parameters attributes"
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
          aria-label="Copy search parameters to clipboard"
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
        <JsonTree
          data={
            isExhaustive
              ? widget.searchParameters
              : getObjectWithoutEmptyValues(widget.searchParameters)
          }
          shouldExpandNode={() => isExpanded}
        />
      </AccordionPanel>
    </>
  );
}
