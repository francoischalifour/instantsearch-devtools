import React from 'react';
import {
  AccordionIcon,
  AccordionPanel,
  Box,
  Icon,
  useClipboard,
} from '@chakra-ui/core';

import { Node } from './types';
import { isIndexWidget } from './isIndexWidget';
import { PanelHeader } from './PanelHeader';
import { JsonTree } from './JsonTree';
import { PanelTooltip } from './PanelTooltip';

interface WidgetPropsPanelProps {
  widget: Node;
}

export function WidgetPropsPanel({ widget }: WidgetPropsPanelProps) {
  const widgetProps = isIndexWidget(widget.node)
    ? {
        indexName: widget.node.getIndexName(),
        indexId: widget.node.getIndexId(),
      }
    : {};
  const { onCopy } = useClipboard(JSON.stringify(widgetProps, null, 2));

  if (!isIndexWidget(widget.node)) {
    return null;
  }

  return (
    <>
      <PanelHeader _hover={{ backgroundColor: 'transparent' }}>
        <Box flex="1" textAlign="left">
          Props
        </Box>

        <PanelTooltip
          label="Copy to clipboard"
          aria-label="Copy UI state to clipboard"
        >
          <Icon
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
        <JsonTree data={widgetProps} />
      </AccordionPanel>
    </>
  );
}
