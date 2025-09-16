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

const formatTimer = (ms: number): string => {
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

    const getDisplayTime = () => {
        if (timer.status === "finished") return "Finished!";
        return formatTimer(remainingTime);
    };

    const isFinished = timer.status === "finished";
    const cardClassName = `timer-item ${isFinished ? "finished" : ""}`;

    return (
        <li className={cardClassName}>
            <span className="timer-name">{timer.name}: </span>
            <strong className="timer-name">{getDisplayTime()}</strong>
        </li>
    );
};
