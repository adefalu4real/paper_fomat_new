// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
import App from "./App";
import { GlobalStyle } from "./GlobalStyles";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
  
  </React.StrictMode>
);
