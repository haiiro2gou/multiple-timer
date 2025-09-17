export interface TimerData {
    id: string;
    name: string;
    status: "running" | "paused" | "finished";
    duration: number;
    targetTime: number;
    remainingOnPause: number | null;
    repeat: boolean;
}
