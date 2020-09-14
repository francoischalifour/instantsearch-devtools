# InstantSearch Devtools

> 🚧 This project is an experimentation and works with a [patched version of InstantSearch.js](https://github.com/algolia/instantsearch.js/tree/400a0948d734e9bcb6e29dff5115989a59c845c1).

Tools for visualizing the InstantSearch state on any production app.

![Screenshot](https://user-images.githubusercontent.com/6137112/93093630-32c28d80-f6a1-11ea-9f5d-cbee2165fbf0.png)

## Features

- See widgets' tree
- Log widget to the console
- Show widget state (+ copy to clipboard)
- Show widget search parameters (+ copy to clipboard)
- Show search results (+ copy to clipboard)

## Preview

![Preview](https://user-images.githubusercontent.com/6137112/93094496-46222880-f6a2-11ea-93fd-3577ec5c03af.gif)

## How it works

This works by injecting a middleware to InstantSearch.js to plug the `window.__INSTANTSEARCH_DEVTOOLS_GLOBAL_MIDDLEWARE__` middleware if present. This middleware is part of the visualizer tool that will be exposed as a browser extension in the future.

Once this patched InstantSearch detects that this middleware is available, it hooks it into its lifecycle and notifies it of every change.

## License

[MIT](LICENSE)
