import React from 'react';
import styled from 'styled-components';

import { Node } from './types';
import { getWidgetCount } from './getWidgetCount';
import { devToolsTheme } from './theme';
import { ArrowSvg } from './ArrowSvg';
import { WidgetName } from './WidgetName';

interface TreeProps {
  node: Node;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedIndex: number;
  baseId?: number;
}

interface TreeNodeProps {
  node: Node;
  isSelected: boolean;
  onClick(): void;
}

const List = styled.ul`
  padding-left: 1rem;
  list-style: none;
`;

const ListItem = styled.li``;

const NodeItem = styled.div`
  cursor: default;
  padding: 6px;
  width: 100%;
  ${props =>
    props.isSelected && `background-color: ${devToolsTheme.colors.dark};`}
  ${props =>
    !props.isSelected &&
    `
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const ListItemNode = styled.div`
  display: flex;
  align-items: center;
`;

function TreeNode({ node, isSelected, onClick }: TreeNodeProps) {
  return (
    <NodeItem isSelected={isSelected} onClick={onClick}>
      <WidgetName isSelected={isSelected}>
        {node.name}
        {node.type === 'ais.index' && `<${node.node.getIndexId()}>`}
      </WidgetName>
    </NodeItem>
  );
}

function TreeList({
  node,
  selectedIndex,
  setSelectedIndex,
  baseId = 0,
}: TreeProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  return (
    <List>
      <ListItem key={`${node.type}-${baseId}`}>
        <ListItemNode>
          {node.children.length > 0 && (
            <span
              onClick={() => setIsExpanded(prevValue => !prevValue)}
              style={!isExpanded ? { transform: 'rotate(-90deg)' } : undefined}
            >
              <ArrowSvg />
            </span>
          )}

          <TreeNode
            node={node}
            isSelected={node.id === selectedIndex}
            onClick={() => setSelectedIndex(node.id)}
          />
        </ListItemNode>

        <div hidden={!isExpanded}>
          {node.children.map(child => (
            <TreeList
              node={child}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              key={`${child.type}-${baseId + 1}:widgets`}
              baseId={baseId + 1}
            />
          ))}
        </div>
      </ListItem>
    </List>
  );
}

export function Tree({ node, selectedIndex, setSelectedIndex }: TreeProps) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const element = event.target as HTMLElement;
      const tagName = element.tagName;

      // Do not override behavior if we're editing text.
      if (
        element.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'SELECT' ||
        tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prevValue =>
          Math.min(prevValue + 1, getWidgetCount(node) - 1)
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prevValue => Math.max(0, prevValue - 1));
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [node, setSelectedIndex]);

  return (
    <TreeList
      node={node}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    />
  );
}
