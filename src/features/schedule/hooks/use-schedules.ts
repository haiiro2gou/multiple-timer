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

    // Common schedule mutation
    const addScheduleMutation = useMutation({
        mutationFn: async (
            data: Omit<AlarmSchedule, "id"> | Omit<TimerSchedule, "id">
        ) => {
            const newSchedule: Schedule = { ...data, id: uuidv4() };
            const currentSchedules =
                queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ??
                [];
            const updatedSchedules = [...currentSchedules, newSchedule];
            saveSchedulesToStorage(updatedSchedules);
            return Promise.resolve(updatedSchedules);
        },
        onSuccess: updatedSchedules => {
            queryClient.setQueryData(scheduleQueryKeys.all, updatedSchedules);
        },
    });

    const updateScheduleMutation = useMutation({
        mutationFn: async (updatedSchedule: Schedule) => {
            const currentSchedules =
                queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ??
                [];
            const updatedSchedules = currentSchedules.map(schedule =>
                schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            );
            saveSchedulesToStorage(updatedSchedules);
            return Promise.resolve(updatedSchedules);
        },
        onSuccess: updatedSchedules => {
            queryClient.setQueryData(scheduleQueryKeys.all, updatedSchedules);
        },
    });

    const deleteScheduleMutation = useMutation({
        mutationFn: async (id: string) => {
            const currentSchedules =
                queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ??
                [];
            const updatedSchedules = currentSchedules.filter(
                schedule => schedule.id !== id
            );
            saveSchedulesToStorage(updatedSchedules);
            return Promise.resolve(updatedSchedules);
        },
        onSuccess: updatedSchedules => {
            queryClient.setQueryData(scheduleQueryKeys.all, updatedSchedules);
        },
    });

    const setSchedulesMutation = useMutation({
        mutationFn: async (schedules: Schedule[]) => {
            saveSchedulesToStorage(schedules);
            return Promise.resolve(schedules);
        },
        onSuccess: updatedSchedules => {
            queryClient.setQueryData(scheduleQueryKeys.all, updatedSchedules);
        },
    });

    // Pause and resume functions for timers
    const pauseTimer = (id: string) => {
        const currentSchedules =
            queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ?? [];
        const timer = currentSchedules.find(elem => elem.id === id);
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
        updateScheduleMutation.mutate(updatedSchedule);
    };

    const resumeTimer = (id: string) => {
        const currentSchedules =
            queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ?? [];
        const timer = currentSchedules.find(elem => elem.id === id);
        if (
            timer === undefined ||
            timer.type !== "timer" ||
            timer.status !== "paused"
        )
            return;

        const newTargetTime = Date.now() + (timer.remainingOnPause ?? 0);
        const updatedSchedule: TimerSchedule = {
            ...timer,
            status: "running",
            targetTime: newTargetTime,
            remainingOnPause: null,
        };
        updateScheduleMutation.mutate(updatedSchedule);
    };

    const restartTimer = (id: string) => {
        const currentSchedules =
            queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ?? [];
        const timer = currentSchedules.find(elem => elem.id === id);
        if (timer === undefined || timer.type !== "timer") return;

        const newTargetTime = Date.now() + timer.duration;
        const updatedSchedule: TimerSchedule = {
            ...timer,
            status: "running",
            targetTime: newTargetTime,
            remainingOnPause: null,
        };
        updateScheduleMutation.mutate(updatedSchedule);
    };

    // Toggle alarm enabled/disabled
    const toggleAlarm = (id: string) => {
        const currentSchedules =
            queryClient.getQueryData<Schedule[]>(scheduleQueryKeys.all) ?? [];
        const alarm = currentSchedules.find(elem => elem.id === id);
        if (alarm === undefined || alarm.type !== "alarm") return;

        const updatedSchedule: AlarmSchedule = {
            ...alarm,
            enabled: !alarm.enabled,
        };
        updateScheduleMutation.mutate(updatedSchedule);
    };

    return {
        schedules,
        addSchedule: addScheduleMutation.mutate,
        updateSchedule: updateScheduleMutation.mutate,
        deleteSchedule: deleteScheduleMutation.mutate,
        setSchedules: setSchedulesMutation.mutate,
        pauseTimer,
        resumeTimer,
        restartTimer,
        toggleAlarm,
    };
};
