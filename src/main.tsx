import * as React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";
import { ThemeProvider } from "./features/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
