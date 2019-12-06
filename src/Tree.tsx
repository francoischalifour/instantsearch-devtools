import React from 'react';
import styled from 'styled-components';

import { UiState, SearchParameters, Widget } from './types';
import { ArrowSvg } from './ArrowSvg';

export interface Node {
  type: string;
  name: string;
  state: UiState;
  searchParameters?: SearchParameters;
  children: Node[];
  instance: Widget;
}

interface TreeProps {
  node: Node;
  onSelect: (node: Node) => void;
  selectedNode: Node;
}

interface TreeNodeProps {
  node: Node;
  onSelect: (node: Node) => void;
  isSelected: boolean;
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

function TreeNode({ node, isSelected, onSelect }: TreeNodeProps) {
  return (
    <NodeItem onClick={() => onSelect(node)} isSelected={isSelected}>
      {node.name}
    </NodeItem>
  );
}

let counterId = 0;

function generatedId() {
  return counterId++;
}

export function Tree({ node, selectedNode, onSelect }: TreeProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(true);

  return (
    <List>
      <ListItem key={`${node.type}:${generatedId()}`}>
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
            onSelect={onSelect}
            isSelected={node === selectedNode}
          />
        </ListItemNode>

        <div hidden={!isExpanded}>
          {node.children.map(child => (
            <Tree
              node={child}
              onSelect={onSelect}
              selectedNode={selectedNode}
              key={`${node.type}-${generatedId()}:widgets`}
            />
          ))}
        </div>
      </ListItem>
    </List>
  );
}
