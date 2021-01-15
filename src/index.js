import React from "react";
import ReactDOM from "react-dom";
// import {createStore} from "redux";

import App from "./App";

// const store = createStore();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
