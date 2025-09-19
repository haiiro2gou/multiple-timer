import * as React from "react";

import { WEEK_DAYS_SHORT } from "../../../constants";
import { type Schedule } from "../types.ts";
import { useSchedules } from "../hooks/use-schedules.ts";

interface ScheduleFormProps {
    schedule?: Schedule;
    onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ScheduleForm = ({ schedule, onClose }: ScheduleFormProps) => {
    const { addSchedule, updateSchedule } = useSchedules();

    const [type, setType] = React.useState<"alarm" | "timer">(
        schedule?.type ?? "alarm"
    );
    const [name, setName] = React.useState(schedule?.name ?? "New Schedule");

    // Alarm-specific states
    const [time, setTime] = React.useState(
        schedule?.type === "alarm" ? schedule.time : "07:00"
    );
    const [days, setDays] = React.useState(
        schedule?.type === "alarm"
            ? schedule.days
            : [false, false, false, false, false, false, false]
    );

    // Timer-specific states
    const initialDuration =
        schedule?.type === "timer" ? schedule.duration : 5 * 60 * 1000;
    const [minutes, setMinutes] = React.useState(
        Math.floor(initialDuration / 60000).toString()
    );
    const [seconds, setSeconds] = React.useState(
        ((initialDuration % 60000) / 1000).toString()
    );
    const [repeat, setRepeat] = React.useState(
        schedule?.type === "timer" ? schedule.repeat : false
    );

    // Handlers
    const handleAlarmTypeChange = React.useCallback(() => {
        setType("alarm");
    }, []);
    const handleTimerTypeChange = React.useCallback(() => {
        setType("timer");
    }, []);
    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        []
    );
    const handleTimeChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTime(e.target.value);
        },
        []
    );
    const handleDayButtonClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const indexStr = e.currentTarget.dataset.index;
            if (indexStr === undefined) return;
            const index = parseInt(indexStr, 10);
            setDays(currentDays =>
                currentDays.map((selected, i) =>
                    i === index ? !selected : selected
                )
            );
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
    const handleRepeatChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRepeat(e.target.checked);
        },
        []
    );

    // Form submission
    const handleSubmit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (name.trim() === "") return;

            if (type === "alarm") {
                const match = /^\d{2}:\d{2}$/.exec(time);
                if (match === null) return;

                const alarmData = {
                    type: "alarm" as const,
                    name,
                    time,
                    enabled: true,
                    days,
                };
                if (schedule !== undefined && schedule.type === "alarm")
                    updateSchedule({ ...schedule, ...alarmData });
                else addSchedule(alarmData);
            } else {
                const duration =
                    parseInt(minutes, 10) * 60000 +
                    parseInt(seconds, 10) * 1000;
                if (duration <= 0) return;

                const timerData = {
                    type: "timer" as const,
                    name,
                    status: "running" as const,
                    duration,
                    targetTime: Date.now() + duration,
                    remainingOnPause: null,
                    repeat,
                };

                if (schedule !== undefined && schedule.type === "timer")
                    updateSchedule({ ...schedule, ...timerData });
                else addSchedule(timerData);
            }

            onClose();
        },
        [
            addSchedule,
            days,
            minutes,
            name,
            onClose,
            repeat,
            schedule,
            seconds,
            time,
            type,
            updateSchedule,
        ]
    );

    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                {schedule !== undefined ? "Edit Schedule" : "New Schedule"}
            </h2>

            {/* Type Selector */}
            {schedule !== undefined ? (
                <div className="flex border-b border-slate-200 mb-6">
                    <button
                        type="button"
                        onClick={handleAlarmTypeChange}
                        className={`px-4 py-2 text-lg font-semibold transition-colors ${type === "alarm" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Alarm
                    </button>
                    <button
                        type="button"
                        onClick={handleTimerTypeChange}
                        className={`px-4 py-2 text-lg font-semibold transition-colors ${type === "timer" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Timer
                    </button>
                </div>
            ) : null}

            {/* Conditional Inputs */}
            <div className="flex-grow space-y-6">
                <div>
                    <label htmlFor="schedule-name" className="form-label">
                        Name
                    </label>
                    <input
                        id="schedule-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="form-input"
                    />
                </div>
                {type === "alarm" ? (
                    <>
                        <div>
                            <label htmlFor="alarm-time" className="form-label">
                                Time
                            </label>
                            <input
                                id="alarm-time"
                                type="time"
                                value={time}
                                onChange={handleTimeChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="form-label"
                                htmlFor="repeat-group"
                            >
                                Repeat
                            </label>
                            <div
                                id="repeat-group"
                                className="flex justify-between space-x-1"
                                role="group"
                            >
                                {WEEK_DAYS_SHORT.map((day, index) => (
                                    <button
                                        type="button"
                                        onClick={handleDayButtonClick}
                                        key={day}
                                        data-index={index}
                                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${days[index] ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label
                                htmlFor="timer-minutes"
                                className="form-label"
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
                                    className="form-input"
                                    aria-label="Minutes"
                                />
                                <span className="text-slate-500">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={seconds}
                                    onChange={handleSecondsChange}
                                    className="form-input"
                                    aria-label="Seconds"
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="timer-repeat"
                                type="checkbox"
                                checked={repeat}
                                onChange={handleRepeatChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="timer-repeat"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Repeat
                            </label>
                        </div>
                    </>
                )}
            </div>

            <div className="pt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="button button-secondary"
                >
                    Cancel
                </button>
                <button type="submit" className="button button-primary">
                    Save
                </button>
            </div>
        </form>
    );
};
