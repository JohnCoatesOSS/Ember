import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import * as styles from './popup.css';
import { Styled } from './components/styled';
import App from "./screens/App"
require("./tailwind.css")
require("./popup.css")


ReactDOM.render(
    <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement,
);