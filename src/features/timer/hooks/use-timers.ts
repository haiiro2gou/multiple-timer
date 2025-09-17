import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { type TimerData } from "../types.ts";
import {
    loadTimerDatasFromStorage,
    saveTimerDatasToStorage,
} from "../components/storage.ts";
import { timerQueryKeys } from "../components/query-key.ts";

export const useTimers = () => {
    const queryClient = useQueryClient();
    const { data: timers = [] } = useQuery<TimerData[]>({
        queryKey: timerQueryKeys.all,
        queryFn: () => loadTimerDatasFromStorage(),
    });

    const addTimerMutation = useMutation({
        mutationFn: async (data: {
            name: string;
            duration: number;
            repeat?: boolean;
        }) => {
            const newTimer: TimerData = {
                id: (uuidv4 as () => string)(),
                name: data.name,
                status: "running",
                duration: data.duration,
                targetTime: Date.now() + data.duration,
                remainingOnPause: null,
                repeat: data.repeat ?? false,
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

    const deleteTimerMutation = useMutation({
        mutationFn: async (id: string) => {
            const updatedTimers = timers.filter(elem => elem.id !== id);
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
        deleteTimer: deleteTimerMutation.mutate,
    };
};
