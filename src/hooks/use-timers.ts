import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { type TimerData } from "../types/timer.ts";
import {
    loadTimerDatasFromStorage,
    saveTimerDatasToStorage,
} from "../components/timer/storage.ts";
import { timerQueryKeys } from "../components/timer/query-key.ts";

export const useTimers = () => {
    const queryClient = useQueryClient();
    const { data: timers = [] } = useQuery<TimerData[]>({
        queryKey: timerQueryKeys.all,
        queryFn: () => loadTimerDatasFromStorage(),
    });

    /*
    const saveAllTimersMutation = useMutation({
        mutationFn: async (updatedTimers: TimerData[]) => {
            saveTimerDatasToStorage(updatedTimers);
            return Promise.resolve();
        },
        onSuccess: (_, updatedTimers) => {
            queryClient.setQueryData<TimerData[]>(timerQueryKeys.all, updatedTimers);
        },
    });
    */

    const addTimerMutation = useMutation({
        mutationFn: async (data: {
            name: string;
            duration: number;
            repeat?: boolean;
        }) => {
            const repeat = data.repeat ?? false;
            const newTimer: TimerData = {
                id: uuidv4(),
                name: data.name,
                targetTime: Date.now() + data.duration,
                status: "running",
                remainingOnPause: null,
                repeat: repeat,
            };

            const updatedTimers = [...timers, newTimer];
            saveTimerDatasToStorage(updatedTimers);
            return Promise.resolve(updatedTimers);
        },
        onSuccess: updatedTimers => {
            queryClient.setQueryData<TimerData[]>(
                timerQueryKeys.all,
                updatedTimers
            );
        },
    });

    const updateTimerMutation = useMutation({
        mutationFn: async (updatedTimer: TimerData) => {
            const updatedTimers = timers.map(elem =>
                elem.id === updatedTimer.id ? updatedTimer : elem
            );
            saveTimerDatasToStorage(updatedTimers);
            return Promise.resolve(updatedTimers);
        },
        onSuccess: updatedTimers => {
            queryClient.setQueryData<TimerData[]>(
                timerQueryKeys.all,
                updatedTimers
            );
        },
    });

    return {
        timers,
        addTimer: addTimerMutation.mutate,
        updateTimer: updateTimerMutation.mutate,
    };
};
