import * as React from "react";

import { type TimerData } from "../types/timer.ts";

const calculateRemainingTime = (
    timer: TimerData,
    currentTime: number
): number => {
    if (timer.status === "finished") return 0;
    if (timer.status === "paused") return timer.remainingOnPause ?? 0;
    const remaining = timer.targetTime - currentTime;
    return Math.max(0, remaining);
};

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

interface TimerItemProps {
    timer: TimerData;
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TimerItem = ({ timer, currentTime }: TimerItemProps) => {
    const remainingTime = calculateRemainingTime(timer, currentTime);

    const getDisplayTime = () => {
        if (timer.status === "finished") return "Finished!";
        return formatTime(remainingTime);
    };

    return (
        <div>
            <span>{timer.name}: </span>
            <strong>{getDisplayTime()}</strong>
        </div>
    );
};
