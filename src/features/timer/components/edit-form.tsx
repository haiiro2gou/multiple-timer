import * as React from "react";

import { type TimerData } from "../types.ts";
import { useTimers } from "../hooks/use-timers.ts";

interface EditTimerFormProps {
    timer: TimerData;
    onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EditTimerForm = ({ timer, onClose }: EditTimerFormProps) => {
    const { updateTimer } = useTimers();
    const [name, setName] = React.useState(timer.name);

    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        []
    );

    const [minutes, setMinutes] = React.useState(
        Math.floor(timer.duration / 60000).toString()
    );
    const [seconds, setSeconds] = React.useState(
        ((timer.duration % 60000) / 1000).toString()
    );
    const handleMinutesChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setMinutes(e.target.value);
        },
        []
    );
    const handleSecondsChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSeconds(e.target.value);
        },
        []
    );

    const handleSubmit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (name.trim() === "") return;

            const minutesValue = minutes === "" ? 0 : parseInt(minutes, 10);
            const secondsValue = seconds === "" ? 0 : parseInt(seconds, 10);
            const newDuration = (minutesValue * 60 + secondsValue) * 1000;
            if (newDuration <= 0) return;

            const updatedTimer = {
                ...timer,
                name,
                status: "running" as const,
                duration: newDuration,
                targetTime: Date.now() + newDuration,
                remainingOnPause: null,
            };
            updateTimer(updatedTimer);
            onClose();
        },
        [name, minutes, seconds, timer, updateTimer, onClose]
    );

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Edit Timer
            </h2>
            {/* Name inputs */}
            <div>
                <label
                    htmlFor="timer-name"
                    className="block text-sm font-medium text-slate-600 mb-1"
                >
                    Timer Name
                </label>
                <input
                    id="timer-name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></input>
            </div>
            {/* Duration inputs */}
            <div>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min="0"
                        value={minutes}
                        onChange={handleMinutesChange}
                        className="w-full px-3 py-2 border border-slate-400 rounded-md shadow-sm"
                        aria-label="Minutes"
                    />
                    <span className="text-slate-500">:</span>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={handleSecondsChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                        aria-label="Seconds"
                    />
                </div>
            </div>
            {/* Close button */}
            <div className="mt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    Save and Restart
                </button>
            </div>
        </form>
    );
};
