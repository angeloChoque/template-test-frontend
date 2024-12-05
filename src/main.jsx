import { createRoot } from "react-dom/client";
import "./style.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div>Hello world!</div>
  </StrictMode>
);
