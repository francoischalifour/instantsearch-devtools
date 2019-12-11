import { Node } from './Tree';

export function logWidgetToConsole(widget: Node): void {
  const supportsGroup = typeof console.groupCollapsed === 'function';

  if (supportsGroup) {
    console.groupCollapsed(
      `[Click to expand] %c${widget.name}`,
      // --dom-tag-name-color is the CSS variable Chrome styles HTML elements with in the console.
      'color: var(--dom-tag-name-color); font-weight: normal;'
    );
  }

  if (Object.keys(widget.state).length > 0) {
    console.log('State:', widget.state);
  }

  if (widget.searchParameters) {
    console.log('Search parameters:', widget.searchParameters);
  }

  if (widget.children.length > 0) {
    console.log('Children', widget.children);
  }

  console.log('Node', widget.node);

  if ((window as any).chrome || /firefox/i.test(navigator.userAgent)) {
    console.log(
      'Right-click any value to save it as a global variable for further inspection.'
    );
  }

  if (supportsGroup) {
    console.groupEnd();
  }
}
