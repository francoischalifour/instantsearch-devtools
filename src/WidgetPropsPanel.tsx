import React from 'react';
import { AccordionIcon, AccordionPanel, Box } from '@chakra-ui/core';

import { Node } from './types';
import { isIndexWidget } from './isIndexWidget';
import { PanelHeader } from './PanelHeader';
import { JsonTree } from './JsonTree';

interface WidgetPropsPanelProps {
  widget: Node;
}

export function WidgetPropsPanel({ widget }: WidgetPropsPanelProps) {
  if (!isIndexWidget(widget.node)) {
    return null;
  }

  return (
    <>
      <PanelHeader _hover={{ backgroundColor: 'transparent' }}>
        <Box flex="1" textAlign="left">
          Props
        </Box>
        <AccordionIcon />
      </PanelHeader>

      <AccordionPanel>
        <JsonTree
          data={{
            indexName: widget.node.getIndexName(),
            indexId: widget.node.getIndexId(),
          }}
        />
      </AccordionPanel>
    </>
  );
}
