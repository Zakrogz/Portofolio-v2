import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { publicUrl } from "./lib/publicUrl.js";

// CSS no tiene acceso a import.meta.env: el ruido de fondo (url() en
// index.css) se resuelve aquí y se expone como variable para que el sitio
// no se rompa cuando se sirve desde una subruta (GitHub Pages).
document.documentElement.style.setProperty(
  "--noise-url",
  `url(${publicUrl("/noise.svg")})`
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
