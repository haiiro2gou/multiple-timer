import * as React from "react";

import { type TimerData } from "../types.ts";
import { useTimers } from "../hooks/use-timers.ts";

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
    const { deleteTimer } = useTimers();
    const remainingTime = calculateRemainingTime(timer, currentTime);
    const isFinished = timer.status === "finished";

    const getDisplayTime = () => {
        if (timer.status === "finished") return "Finished!";
        return formatTime(remainingTime);
    };

    const handleDelete = React.useCallback(() => {
        deleteTimer(timer.id);
    }, [deleteTimer, timer.id]);

    return (
        <li
            className={`
                flex items-center justify-between p-4 bg-white rounded-lg shadow-md
                transition-colors duration-300
                ${isFinished ? "bg-green-50" : "bg-white"}
            `}
        >
            <div className="flex flex-col items-start">
                {/* Name of the timer / alarm */}
                <span
                    className={`text-lg font-medium
                        ${isFinished ? "text-green-800" : "text-slate-700"}
                    `}
                >
                    {timer.name}
                </span>
                {/* Remaining Time */}
                <strong
                    className={`
                        font-mono text-3xl font-bold tracking-wider
                        ${isFinished ? "text-green-600" : "text-slate-900"}
                    `}
                >
                    {getDisplayTime()}
                </strong>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleDelete}
                    aria-label="Delete Timer"
                    className="
                        p-2 text-slate-500 rounded-full transition-colors
                        hover:bg-slate-200 hover:text-slate-800
                        focus:outline-none focus:ring-2 focus:ring-slate-400
                    "
                >
                    {/* Trash Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </li>
    );
};
