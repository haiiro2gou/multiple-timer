import * as React from "react";

import { type AlarmSchedule, type TimerSchedule } from "../types.ts";
import { useSchedules } from "../hooks/use-schedules.ts";

interface AddScheduleFormProps {
    onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AddScheduleForm = ({ onClose }: AddScheduleFormProps) => {
    const { addSchedule } = useSchedules();

    // Common state
    const [type, setType] = React.useState<"timer" | "alarm">("timer");
    const [name, setName] = React.useState("New Schedule");
    // Timer-specific state
    const [minutes, setMinutes] = React.useState("5");
    const [seconds, setSeconds] = React.useState("0");
    // Alarm-specific state
    const [time, setTime] = React.useState("07:00");

    const handleSetAlarmType = React.useCallback(() => {
        setType("alarm");
    }, []);
    const handleSetTimerType = React.useCallback(() => {
        setType("timer");
    }, []);

    const handleNameChange = React.useCallback(() => {
        setName(name);
    }, [name]);
    const handleTimeChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTime(e.target.value);
        },
        []
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

            if (type === "alarm") {
                const match = /^\d{2}:\d{2}$/.exec(time);
                if (match === null) return;

                const newAlarm: Omit<AlarmSchedule, "id"> = {
                    type: "alarm",
                    name,
                    time,
                    enabled: true,
                    days: [false, false, false, false, false, false, false],
                };
                addSchedule(newAlarm);
            } else {
                const min = minutes.trim() === "" ? "0" : minutes;
                const sec = seconds.trim() === "" ? "0" : seconds;
                const duration =
                    (parseInt(min, 10) * 60 + parseInt(sec, 10)) * 1000;
                if (duration <= 0) return;

                const newTimer: Omit<TimerSchedule, "id"> = {
                    type: "timer",
                    name,
                    duration,
                    status: "running",
                    targetTime: Date.now() + duration,
                    remainingOnPause: null,
                    repeat: false,
                };
                addSchedule(newTimer);
            }
        },
        [addSchedule, minutes, name, seconds, time, type]
    );

    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Add New Schedule
            </h2>

            {/* Type Selector */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    type="button"
                    onClick={handleSetAlarmType}
                    className={`px-4 py-2 text-lg font-semibold transition-colors ${type === "alarm" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Alarm
                </button>
                <button
                    type="button"
                    onClick={handleSetTimerType}
                    className={`px-4 py-2 text-lg font-semibold transition-colors ${type === "timer" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                    Timer
                </button>
            </div>

            <div className="space-y-6">
                {/* Name inputs */}
                <div>
                    <label
                        htmlFor="schedule-name"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Name
                    </label>
                    <input
                        id="schedule-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Conditional Inputs */}
            {type === "alarm" ? (
                <div>
                    <label
                        htmlFor="alarm-time"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Time
                    </label>
                    <input
                        id="alarm-time"
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                        required
                    />
                </div>
            ) : (
                <div>
                    <label
                        htmlFor="timer-minutes"
                        className="block text-sm font-medium text-slate-600 mb-1"
                    >
                        Duration
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="timer-minutes"
                            type="number"
                            min="0"
                            value={minutes}
                            onChange={handleMinutesChange}
                            aria-label="Minutes"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                        />
                        <span className="text-slate-500">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={handleSecondsChange}
                            aria-label="Seconds"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
            )}

            {/* Close button */}
            <div className="pt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
};
