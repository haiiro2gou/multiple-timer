import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import {
    type Schedule,
    type AlarmSchedule,
    type TimerSchedule,
} from "../types.ts";
import {
    loadSchedulesFromStorage,
    saveSchedulesToStorage,
} from "../components/storage.ts";
import { scheduleQueryKeys } from "../components/query-key.ts";

export const useSchedules = () => {
    const queryClient = useQueryClient();
    const { data: schedules = [] } = useQuery<Schedule[]>({
        queryKey: scheduleQueryKeys.all,
        queryFn: loadSchedulesFromStorage,
        staleTime: Infinity,
    });

    // Common mutation for adding, updating, and deleting schedules
    const updateScheduleMutation = useMutation({
        mutationFn: async (updatedSchedules: Schedule[]) => {
            saveSchedulesToStorage(updatedSchedules);
            return Promise.resolve(updatedSchedules);
        },
        onSuccess: updatedSchedules => {
            queryClient.setQueryData<Schedule[]>(
                scheduleQueryKeys.all,
                updatedSchedules
            );
        },
    });

    const addSchedule = (
        data: Omit<AlarmSchedule, "id"> | Omit<TimerSchedule, "id">
    ) => {
        const newSchedule: Schedule = {
            ...data,
            id: uuidv4(),
        };
        const updatedSchedules = [...schedules, newSchedule];
        updateScheduleMutation.mutate(updatedSchedules);
    };

    const updateSchedule = (updatedSchedule: Schedule) => {
        const updatedSchedules = schedules.map(elem =>
            elem.id === updatedSchedule.id ? updatedSchedule : elem
        );
        updateScheduleMutation.mutate(updatedSchedules);
    };

    const deleteSchedule = (id: string) => {
        const updatedSchedules = schedules.filter(elem => elem.id !== id);
        updateScheduleMutation.mutate(updatedSchedules);
    };

    // Pause and resume functions for timers
    const pauseTimer = (id: string) => {
        const timer = schedules.find(elem => elem.id === id);
        if (
            timer === undefined ||
            timer.type !== "timer" ||
            timer.status !== "running"
        )
            return;

        const remaining = timer.targetTime - Date.now();
        const updatedSchedule: TimerSchedule = {
            ...timer,
            status: "paused",
            remainingOnPause: Math.max(remaining, 0),
        };
        updateSchedule(updatedSchedule);
    };

    const resumeTimer = (id: string) => {
        const timer = schedules.find(elem => elem.id === id);
        if (
            timer === undefined ||
            timer.type !== "timer" ||
            timer.status !== "paused" ||
            timer.remainingOnPause === null
        )
            return;

        const newTargetTime = Date.now() + timer.remainingOnPause;
        const updatedSchedule: TimerSchedule = {
            ...timer,
            status: "running",
            targetTime: newTargetTime,
            remainingOnPause: null,
        };
        updateSchedule(updatedSchedule);
    };

    // Toggle alarm enabled/disabled
    const toggleAlarm = (id: string) => {
        const alarm = schedules.find(elem => elem.id === id);
        if (alarm === undefined || alarm.type !== "alarm") return;

        const updatedSchedule: AlarmSchedule = {
            ...alarm,
            enabled: !alarm.enabled,
        };
        updateSchedule(updatedSchedule);
    };

    return {
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        pauseTimer,
        resumeTimer,
        toggleAlarm,
    };
};
