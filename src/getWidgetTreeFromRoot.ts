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

export function getWidgetTreeFromRoot(widget: any, uiState: any) {
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

    return {
      type: widget.$$type,
      name: widget.getIndexId(),
      context: {
        state,
        searchParameters,
      },
      children: widget
        .getWidgets()
        .map((widget: any) => getWidgetTreeFromRoot(widget, uiState)),
    };
  }

  return {
    type: widget.$$type,
    name: widget.$$type
      ? capitalize(widget.$$type.split('ais.')[1])
      : 'Unknown',
    context: {},
    children: [],
  };
}
