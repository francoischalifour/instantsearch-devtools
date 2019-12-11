import React from 'react';
import JSONTree from 'react-json-tree';
import { AccordionIcon, AccordionPanel, Box } from '@chakra-ui/core';

import { Node } from './types';
import { isIndexWidget } from './isIndexWidget';
import { jsonTheme } from './theme';
import { getJsonItemString } from './getJsonItemString';
import { PanelHeader } from './PanelHeader';

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

      <AccordionPanel className="code">
        <JSONTree
          data={{
            indexName: widget.node.getIndexName(),
            indexId: widget.node.getIndexId(),
          }}
          hideRoot
          invertTheme={false}
          theme={jsonTheme}
          getItemString={getJsonItemString}
        />
      </AccordionPanel>
    </>
  );
}
