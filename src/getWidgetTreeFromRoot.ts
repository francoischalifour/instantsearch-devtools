import { getWidgetDocumentationUrl } from './getWidgetDocumentationUrl';
import { isIndexWidget } from './isIndexWidget';
import { Node } from './Tree';
import { Widget, UiState } from './types';

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
  parentIndex: Widget | null = null,
  baseId = 0
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
      if (isIndexWidget(childWidget)) {
        return 1;
      }

      return -1;
    });

    return {
      id: baseId,
      type: widget.$$type,
      name: 'Index',
      // The Index widget documentation follows another link pattern.
      documentationUrl: getWidgetDocumentationUrl('index-widget'),
      state,
      searchParameters,
      node: widget,
      children: indexWidgets.map((childWidget: Widget) =>
        getWidgetTreeFromRoot(childWidget, uiState, widget, ++baseId)
      ),
    };
  }

  const widgetIdentifier = widget.$$type.split('ais.')[1];

  return {
    id: baseId,
    type: widget.$$type,
    name: widget.$$type ? capitalize(widgetIdentifier) : 'Unknown',
    documentationUrl: getWidgetDocumentationUrl(widget.$$type),
    state: (uiState[parentIndex.getIndexId()] || {})[widgetIdentifier] || {},
    node: widget,
    children: [],
  };
}
