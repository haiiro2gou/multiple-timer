import * as React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";
import { CacheProvider } from "./components/cache-provider.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <CacheProvider>
                <App />
            </CacheProvider>
        </ThemeProvider>
    </React.StrictMode>
);
