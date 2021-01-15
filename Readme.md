## Project Documentation

#### Ember: Chrome Extension

### Structure

The project uses TypeScript and React, and is built with Webpack.

It was worked on with Visual Studio Code, which has a built-in Chrome debugger that allows for pausing on breakpoints through the IDE and hotkey based running/re-running.

The project is split into the following components.

* __Embedded__ This code runs within the target website's context. It has access to all its variables and runs as if it was code loaded by the website itself.
* __Background__ This is the `background.html` code that runs as part of the extension's context.
* __Popup__ This is the code that runs in the toolbar popup when the extension icon is clicked.
* __Inject__ This code runs within the extension's private context, but has access to the target page's DOM, which it uses to inject the `Embedded` code.

## Progress

#### Startup
The extension currently injects the embedded code. It does two things once injected, it starts observing the DOM, and it hooks XHR requests so it can intercept the dynamically loaded JSON data.

* __DOM Observing__ Anytime the DOM mutates, we check to see if the size selection has changed, and if the title of the currently displayed item has changed. If either has changed we update the DOM with our interface.
* __XHR Hooks__ XHR requests are hooked because that's how Everlane loads all the data for garments, including sizing data. The data is ingested in order to implement our recommendation algorithm and interface.

#### Firebase

Firebase integration is at an early stage. We have basic authentication support and requesting measurements from the backend.

#### Popup

This is the part that has bottlenecked progress in the other areas. While I'm familiar with some single page React, architecting an entire application with many different pages of logic requires a deeper understanding of React than I currently have. Looking into routing has made me realize that there are many layers and facets of React that I do not currently grasp.
