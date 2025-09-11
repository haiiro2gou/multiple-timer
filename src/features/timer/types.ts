export interface TimerData {
    id: string;
    name: string;
    targetTime: number;
    status: "running" | "paused" | "finished";
    remainingOnPause: number | null;
    repeat: boolean;
}
