function getWidgetSlugCase(widgetName: string): string {
  return widgetName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getWidgetDocumentationUrl(widgetType: string): string {
  if (!widgetType) {
    return '';
  }

  const widgetName = widgetType.split('ais.')[1] || widgetType || '';

  return `https://www.algolia.com/doc/api-reference/widgets/${getWidgetSlugCase(
    widgetName
  )}/js`;
}
