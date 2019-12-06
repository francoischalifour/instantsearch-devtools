import React from 'react';
import styled from 'styled-components';

import { getWidgetCount } from './getWidgetCount';
import { ArrowSvg } from './ArrowSvg';
import { UiState, SearchParameters, Widget } from './types';

export interface Node {
  type: string;
  name: string;
  state: UiState;
  searchParameters?: SearchParameters;
  documentationUrl: string;
  children: Node[];
  instance: Widget;
}

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
`;

const ListItem = styled.li``;

// --dark-color-background: #282c34;
// --dark-color-background-hover: rgba(255, 255, 255, 0.1);
// --dark-color-background-inactive: #3d424a;
// --dark-color-background-invalid: #5c0000;
// --dark-color-background-selected: #178fb9;

const NodeItem = styled.div`
  cursor: default;
  padding: 6px;
  width: 100%;
  color: ${props => (props.isSelected ? '#fff' : '#61dafb')};
  ${props => props.isSelected && 'background-color: #178fb9;'}
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
    <NodeItem className="code" isSelected={isSelected} onClick={onClick}>
      {node.name}
      {node.type === 'ais.index' && `<${node.instance.getIndexId()}>`}
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
            isSelected={baseId === selectedIndex}
            onClick={() => setSelectedIndex(baseId)}
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
  }, [window]);

  return (
    <TreeList
      node={node}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    />
  );
}
