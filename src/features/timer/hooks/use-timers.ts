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
        queryFn: loadTimerDatasFromStorage,
        staleTime: Infinity,
    });

    const updateTimerMutaiton = useMutation({
        mutationFn: async (updatedTimers: TimerData[]) => {
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

    const addTimer = (data: {
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
        updateTimerMutaiton.mutate(updatedTimers);
    };

    const updateTimer = (updatedTimer: TimerData) => {
        const updatedTimers = timers.map(elem =>
            elem.id === updatedTimer.id ? updatedTimer : elem
        );
        updateTimerMutaiton.mutate(updatedTimers);
    };

    const deleteTimer = (id: string) => {
        const updatedTimers = timers.filter(elem => elem.id !== id);
        updateTimerMutaiton.mutate(updatedTimers);
    };

    const pauseTimer = (id: string) => {
        const timerToPause = timers.find(elem => elem.id === id);
        if (timerToPause === undefined || timerToPause.status !== "running")
            return;

        const remainingTime = timerToPause.targetTime - Date.now();
        const updatedTimer: TimerData = {
            ...timerToPause,
            status: "paused",
            remainingOnPause: Math.max(remainingTime, 0),
        };
        updateTimer(updatedTimer);
    };

    const resumeTimer = (id: string) => {
        const timerToResume = timers.find(elem => elem.id === id);
        if (
            timerToResume === undefined ||
            timerToResume.status !== "paused" ||
            timerToResume.remainingOnPause === null
        )
            return;

        const newTargetTime = Date.now() + timerToResume.remainingOnPause;
        const updatedTimer: TimerData = {
            ...timerToResume,
            status: "running",
            targetTime: newTargetTime,
            remainingOnPause: null,
        };
        updateTimer(updatedTimer);
    };

    return {
        timers,
        addTimer,
        updateTimer,
        deleteTimer,
        pauseTimer,
        resumeTimer,
    };
};
