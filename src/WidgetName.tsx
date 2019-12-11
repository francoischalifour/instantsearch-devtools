import styled from 'styled-components';
import { devToolsTheme } from './theme';

export const WidgetName = styled.span`
  font-family: ${devToolsTheme.fontFamily.monospace};
  font-size: 14px;
  color: ${props => (props.isSelected ? '#fff' : devToolsTheme.colors.primary)};
`;
