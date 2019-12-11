import React from 'react';
import styled from 'styled-components';
import JSONTreeComponent from 'react-json-tree';

import { devToolsTheme, jsonTheme } from './theme';
import { getJsonItemString } from './getJsonItemString';

const Container = styled.div`
  font-family: ${devToolsTheme.fontFamily.monospace};
  font-size: 14px;
  line-height: 1.6;
`;

interface JsonTreeProps {
  data: object;
  shouldExpandNode?(): boolean;
}

export function JsonTree({ data, shouldExpandNode }: JsonTreeProps) {
  return (
    <Container>
      <JSONTreeComponent
        data={data}
        hideRoot
        invertTheme={false}
        theme={jsonTheme}
        shouldExpandNode={shouldExpandNode}
        getItemString={getJsonItemString}
      />
    </Container>
  );
}
