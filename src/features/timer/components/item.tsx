import * as React from "react";

import { type TimerData } from "../types.ts";

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
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface TimerItemProps {
    timer: TimerData;
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TimerItem = ({ timer, currentTime }: TimerItemProps) => {
    const remainingTime = calculateRemainingTime(timer, currentTime);
    const isFinished = timer.status === "finished";

    const getDisplayTime = () => {
        if (timer.status === "finished") return "Finished!";
        return formatTime(remainingTime);
    };

    return (
        <li
            className={`
                flex items-center justify-between p-4 bg-white rounded-lg shadow-md
                transition-colors duration-300
                ${isFinished ? "bg-green-50" : "bg-white"}
            `}
        >
            <span
                className={`text-lg font-medium
                    ${isFinished ? "text-green-800" : "text-slate-700"}
                `}
            >
                {timer.name}
            </span>
            <strong
                className={`
                    font-mono text-3xl font-bold tracking-wider
                    ${isFinished ? "text-green-600" : "text-slate-900"}
                `}
            >
                {getDisplayTime()}
            </strong>
        </li>
    );
};
