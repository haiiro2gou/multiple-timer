import { type QueryClient } from "@tanstack/react-query";

import { type TimerData } from "../../types/timer.ts";
import { loadTimerDatasFromStorage } from "./storage.ts";
import { timerQueryKeys } from "./query-key.ts";

export const initializeTimerCache = (queryClient: QueryClient) => {
    const loadedTimerDatas = loadTimerDatasFromStorage();
    const now = Date.now();

    const restoredTimerDatas: TimerData[] = loadedTimerDatas.map(elem => {
        if (elem.status === "running" && elem.targetTime <= now)
            return { ...elem, status: "finished" as const };
        return elem;
    });

    queryClient.setQueryData(timerQueryKeys.all, restoredTimerDatas);
};
