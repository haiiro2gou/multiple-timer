import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
        },
    },
});

const localStoragePersister = createAsyncStoragePersister({
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    storage: window.localStorage,
});

interface QueryProviderProps {
    children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [isPersistReady, setIsPersistReady] = React.useState(false);

    React.useEffect(() => {
        const restoreCache = () => {
            void persistQueryClient({
                queryClient,
                persister: localStoragePersister,
            });
            setIsPersistReady(true);
        };

        restoreCache();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {isPersistReady ? children : <div>Loading...</div>}
        </QueryClientProvider>
    );
};
