import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { type TimerData } from "../../types/timer.ts";
import { loadTimerDatasFromStorage } from "./storage.ts";
import { cacheKeys } from "./query-key.ts";

const initializeQueryClient = (): QueryClient => {
    const queryClient = new QueryClient();
    const loadedTimerDatas = loadTimerDatasFromStorage();
    const now = Date.now();

    const restoredTimerDatas = loadedTimerDatas.map(elem => {
        if (elem.status === "running" && now >= elem.targetTime)
            return { ...elem, status: "finished" as TimerData["status"] };
        return elem;
    });

    queryClient.setQueryData<TimerData[]>(cacheKeys.timers, restoredTimerDatas);
    return queryClient;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CacheProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = React.useState(() => initializeQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
