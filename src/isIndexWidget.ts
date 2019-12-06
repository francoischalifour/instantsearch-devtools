import { Widget } from 'types';

export function isIndexWidget(widget: Widget) {
  return widget.$$type === 'ais.index';
}
