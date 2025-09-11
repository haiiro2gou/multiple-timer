import * as React from "react";

interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ThemeProvider = ({ children }: ThemeProviderProps) => (
    <>{children}</>
);
