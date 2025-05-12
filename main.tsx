import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";
import { MirrorWorldProvider } from "./contexts/MirrorWorldContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <MirrorWorldProvider>
      <App />
    </MirrorWorldProvider>
  </QueryClientProvider>
);
