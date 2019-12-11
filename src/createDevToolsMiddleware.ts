import { getWidgetTreeFromRoot } from './getWidgetTreeFromRoot';

export function createDevToolsMiddleware({ setRootNode, setSelectedIndex }) {
  return function devToolsMiddleware({ instantSearchInstance }) {
    return {
      onStateChange({ state }) {
        const newRootNode = getWidgetTreeFromRoot(
          instantSearchInstance.mainIndex,
          state
        );

        setRootNode(newRootNode);
      },

      subscribe() {
        const newRootNode = getWidgetTreeFromRoot(
          instantSearchInstance.mainIndex,
          instantSearchInstance._initialUiState
        );

        setRootNode(newRootNode);
        setSelectedIndex(0);
      },

      unsubscribe() {
        setRootNode(null);
        setSelectedIndex(0);
      },
    };
  };
}
