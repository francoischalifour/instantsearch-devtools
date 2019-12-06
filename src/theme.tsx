import React from 'react';
import { theme } from '@chakra-ui/core';

export const chakraTheme = {
  ...theme,
  icons: {
    ...theme.icons,
    debug: {
      path: (
        <path
          fill="currentColor"
          d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41
      3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04
      1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6
      8h-4v-2h4v2zm0-4h-4v-2h4v2z"
        />
      ),
    },
  },
};

/**
 * @see https://github.com/reduxjs/redux-devtools/tree/master/packages/react-json-tree
 * @see https://github.com/chriskempson/base16/blob/aec7624897b45ae6c3fb8922fdd6a4549d65f0bd/styling.md
 */
export const jsonTheme = {
  base00: 'transparent',
  base01: '#343d46',
  base02: '#4f5b66',
  base03: '#65737e',
  base04: '#a7adba',
  base05: '#c0c5ce',
  base06: '#dfe1e8',
  base07: '#eff1f5',
  base08: '#bf616a',
  base09: '#d08770',
  base0A: '#ebcb8b',
  base0B: '#cedae0',
  base0C: '#96b5b4',
  base0D: '#9d87d2',
  base0E: '#b48ead',
  base0F: '#ab7967',
};