import styled from 'styled-components';
import Tooltip from '@reach/tooltip';
import '@reach/tooltip/styles.css';

export const PanelTooltip = styled(Tooltip)`
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  z-index: 10000002;
`;
