import { Widget, UiState } from './types';
import { Node } from './Tree';

function isIndexWidget(widget: any) {
  return widget.$$type === 'ais.index';
}

function capitalize(text: string) {
  return (
    text
      .toString()
      .charAt(0)
      .toUpperCase() + text.toString().slice(1)
  );
}

export function getWidgetTreeFromRoot(
  widget: Widget,
  uiState: UiState,
  parentIndex: Widget | null = null
): Node {
  if (isIndexWidget(widget)) {
    const state = uiState[widget.getIndexId()] || {};
    const searchParameters = widget
      .getWidgets()
      .reduce((parameters: any, widget: any) => {
        if (!widget.getWidgetSearchParameters) {
          return parameters;
        }

        return widget.getWidgetSearchParameters(parameters, {
          uiState: state,
        });
      }, widget.getHelper().state);

    const indexWidgets = widget.getWidgets().sort((childWidget: Widget) => {
      if (childWidget.$$type === 'ais.index') {
        return 1;
      }

      return -1;
    });

    return {
      instance: widget,
      type: widget.$$type,
      name: widget.getIndexId(),
      state,
      searchParameters,
      children: indexWidgets.map((childWidget: Widget) =>
        getWidgetTreeFromRoot(childWidget, uiState, widget)
      ),
    };
  }

  const widgetIdentifier = widget.$$type.split('ais.')[1];

  return {
    instance: widget,
    type: widget.$$type,
    name: widget.$$type ? capitalize(widgetIdentifier) : 'Unknown',
    state: (uiState[parentIndex.getIndexId()] || {})[widgetIdentifier] || {},
    children: [],
  };
}
