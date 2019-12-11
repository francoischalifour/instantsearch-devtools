import React from 'react';
import styled from 'styled-components';
import { Accordion, AccordionItem } from '@chakra-ui/core';

import { Node } from './types';
import { WidgetNamePanel } from './WidgetNamePanel';
import { WidgetPropsPanel } from './WidgetPropsPanel';
import { WidgetStatePanel } from './WidgetStatePanel';
import { WidgetSearchParametersPanel } from './WidgetSearchParametersPanel';
import { WidgetSearchResultsPanel } from './WidgetSearchResultsPanel';

const Container = styled.div`
  color: #fff;
  background-color: #282c34;
  border-left: 1px solid #3d424a;
  height: 100%;
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

  return (
    <Container>
      <WidgetNamePanel widget={widget} />

      <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
        <AccordionItem>
          <WidgetPropsPanel widget={widget} />
        </AccordionItem>

        <AccordionItem>
          <WidgetStatePanel widget={widget} />
        </AccordionItem>

        <AccordionItem>
          <WidgetSearchParametersPanel widget={widget} />
        </AccordionItem>

        <AccordionItem>
          <WidgetSearchResultsPanel widget={widget} />
        </AccordionItem>
      </Accordion>
    </Container>
  );
}
