interface ScheduleBase {
    id: string;
    name: string;
    categoryId: string;
}

export interface AlarmSchedule extends ScheduleBase {
    type: "alarm";
    enabled: boolean;
    time: string; // HH:MM format
    days: boolean[]; // Array of 7 booleans representing days of the week (Sunday to Saturday)
}

export interface TimerSchedule extends ScheduleBase {
    type: "timer";
    status: "running" | "paused" | "finished";
    duration: number;
    targetTime: number;
    remainingOnPause: number | null;
    repeat: boolean;
}

export type Schedule = AlarmSchedule | TimerSchedule;
