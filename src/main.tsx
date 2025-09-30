import * as React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { App } from "./App.tsx";
import { ThemeProvider } from "./features/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter basename="/multiple-timer">
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
