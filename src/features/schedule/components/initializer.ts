import { type QueryClient } from "@tanstack/react-query";

import { type Schedule } from "../types.ts";
import { loadSchedulesFromStorage } from "./storage.ts";
import { scheduleQueryKeys } from "./query-key.ts";

export const initializeTimerCache = (queryClient: QueryClient) => {
    const loadedSchedules = loadSchedulesFromStorage();
    const now = Date.now();

    const restoredSchedules: Schedule[] = loadedSchedules.map(elem => {
        if (
            elem.type === "timer" &&
            elem.status === "running" &&
            elem.targetTime <= now
        )
            return { ...elem, status: "finished" as const };
        return elem;
    });

    queryClient.setQueryData(scheduleQueryKeys.all, restoredSchedules);
};
