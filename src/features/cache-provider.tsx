import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface CacheProviderProps {
    children: React.ReactNode;
    initializer?: (queryClient: QueryClient) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CacheProvider = ({
    children,
    initializer,
}: CacheProviderProps) => {
    const [queryClient] = React.useState(() => {
        const client = new QueryClient();
        if (initializer !== undefined) initializer(client);
        return client;
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
