import * as React from "react";
import { Route, Routes } from "react-router-dom";

import { QueryProvider } from "./components/query-provider.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

import Home from "./pages/Home.tsx";
import Timer from "./pages/Timer.tsx";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = () => (
    <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
    >
        <QueryProvider>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/timer/" element={<Timer />} />
                </Routes>
            </div>
        </QueryProvider>
    </ThemeProvider>
);
