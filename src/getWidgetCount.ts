import { Node } from './types';

export function getWidgetCount(root: Node): number {
  return (
    1 +
    root.children.reduce((acc, current) => {
      return acc + getWidgetCount(current);
    }, 0)
  );
}
