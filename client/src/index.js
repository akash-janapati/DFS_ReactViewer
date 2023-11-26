import React from 'react';
import { createRoot } from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'
import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename='/hv'>
      {/* Rendering the app component, go to ./App.js for more */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)