import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import "./styles.css";

const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect) {
  const decoded = decodeURIComponent(redirect);

  window.history.replaceState(
    null,
    "",
    decoded
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);