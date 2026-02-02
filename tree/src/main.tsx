import "@/app/styles/index.css";
import "@xyflow/react/dist/style.css";

import { ReactFlowProvider } from "@xyflow/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@/app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </BrowserRouter>
  </StrictMode>,
);
