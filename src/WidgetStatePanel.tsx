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

import { jsonTheme } from './theme';
import { getJsonItemString } from './getJsonItemString';
import { Node } from './Tree';
import { PanelHeader } from './PanelHeader';
import { PanelTooltip } from './PanelTooltip';

interface WidgetStatePanelProps {
  widget: Node;
}

export function WidgetStatePanel({ widget }: WidgetStatePanelProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);
  const { onCopy } = useClipboard(JSON.stringify(widget.state, null, 2));

  return (
    <>
      <PanelHeader _hover={{ backgroundColor: 'transparent' }}>
        <Box flex="1" textAlign="left">
          State
        </Box>

        <PanelTooltip
          label="Expand all attributes"
          aria-label="Expand all state attributes"
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
        {Object.keys(widget.state).length === 0 ? (
          <Text fontStyle="italic">Empty</Text>
        ) : (
          <div className="code">
            <JSONTree
              data={widget.state}
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
