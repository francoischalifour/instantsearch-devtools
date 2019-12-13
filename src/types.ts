export interface Node {
  id: number;
  type: string;
  name: string;
  state: UiState;
  searchParameters?: SearchParameters;
  documentationUrl: string;
  children: Node[];
  node: Widget;
}

export type InstantSearch = any;

export type SearchParameters = any;

export type UiState = any;

export type Widget = any;

export type DevToolsWindow = Window &
  typeof globalThis & {
    __INSTANTSEARCH_DEVTOOLS__: {
      version: string;
      getMiddleware: () => Function;
    };
  };
