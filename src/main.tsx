import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyles";
import App from "./App";
import PaperFormatterLanding from "./pages/Landingpage";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyle />
    <Router>
      <Routes>
        <Route path="/" element={<PaperFormatterLanding />}>
          <Route path="/" index element={<PaperFormatterLanding />} />
        </Route>
        <Route path="formatter" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
