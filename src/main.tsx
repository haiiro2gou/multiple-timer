import * as React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";
import { AppQueryProvider } from "./components/cache/query-provider.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <AppQueryProvider>
                <App />
            </AppQueryProvider>
        </ThemeProvider>
    </React.StrictMode>
);
