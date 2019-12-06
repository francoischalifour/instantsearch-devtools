import { Node } from './Tree';

export function logWidgetToConsole(node: Node): void {
  const supportsGroup = typeof console.groupCollapsed === 'function';

  if (supportsGroup) {
    console.groupCollapsed(
      `[Click to expand] %c${node.name}`,
      // --dom-tag-name-color is the CSS variable Chrome styles HTML elements with in the console.
      'color: var(--dom-tag-name-color); font-weight: normal;'
    );
  }

  if (Object.keys(node.state).length > 0) {
    console.log('State:', node.state);
  }

  if (node.searchParameters) {
    console.log('Search parameters:', node.searchParameters);
  }

  if (node.children.length > 0) {
    console.log('Children', node.children);
  }

  console.log('Instance', node.instance);

  if ((window as any).chrome || /firefox/i.test(navigator.userAgent)) {
    console.log(
      'Right-click any value to save it as a global variable for further inspection.'
    );
  }

  if (supportsGroup) {
    console.groupEnd();
  }
}
