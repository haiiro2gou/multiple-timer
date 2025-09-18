export interface AlarmSchedule {
    type: "alarm";
    id: string;
    name: string;
    enabled: boolean;
    time: string; // HH:MM format
    days: boolean[]; // Array of 7 booleans representing days of the week (Sunday to Saturday)
}

export interface TimerSchedule {
    type: "timer";
    id: string;
    name: string;
    status: "running" | "paused" | "finished";
    duration: number;
    targetTime: number;
    remainingOnPause: number | null;
    repeat: boolean;
}

export type Schedule = AlarmSchedule | TimerSchedule;
