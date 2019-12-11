import React from 'react';
import Tooltip from '@reach/tooltip';
import { Box, Icon, Link } from '@chakra-ui/core';

import { Node } from './Tree';
import { WidgetName } from './WidgetName';
import { logWidgetToConsole } from './logWidgetToConsole';

interface WidgetNamePanelProps {
  widget: Node;
}

export function WidgetNamePanel({ widget }: WidgetNamePanelProps) {
  return (
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
          onClick={(event: React.MouseEvent) => {
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
  );
}
