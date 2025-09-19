import * as React from "react";

import { type Schedule } from "../types.ts";
import { useSchedules } from "../hooks/use-schedules.ts";

interface EditScheduleFormProps {
    schedule: Schedule;
    onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EditScheduleForm = ({
    schedule,
    onClose,
}: EditScheduleFormProps) => {
    const { updateSchedule } = useSchedules();

    // Common states
    const [name, setName] = React.useState(schedule.name);
    // Alarm-specific states
    const [time, setTime] = React.useState(
        schedule.type === "alarm" ? schedule.time : "00:00"
    );
    // Timer-specific states
    const [minutes, setMinutes] = React.useState(
        schedule.type === "timer"
            ? Math.floor(schedule.duration / 60000).toString()
            : "0"
    );
    const [seconds, setSeconds] = React.useState(
        schedule.type === "timer"
            ? ((schedule.duration % 60000) / 1000).toString()
            : "0"
    );

    // Handlers
    const handleSubmit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (name.trim() === "") return;

            if (schedule.type === "alarm") {
                const match = /^\d{2}:\d{2}$/.exec(time);
                if (match === null) return;

                const updatedAlarm: Schedule = {
                    ...schedule,
                    name,
                    time,
                };
                updateSchedule(updatedAlarm);
            } else {
                const mins = parseInt(minutes, 10);
                const secs = parseInt(seconds, 10);

                const updatedTimer: Schedule = {
                    ...schedule,
                    name,
                    duration: mins * 60000 + secs * 1000,
                    targetTime: Date.now() + mins * 60000 + secs * 1000,
                };
                updateSchedule(updatedTimer);
            }

            onClose();
        },
        [name, schedule, onClose, time, updateSchedule, minutes, seconds]
    );
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

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Edit {schedule.type === "alarm" ? "Alarm" : "Timer"}
            </h2>
            <div className="space-y-4">
                {/* Name inputs */}
                <div>
                    <label htmlFor="schedule-name" className="form-label">
                        Timer Name
                    </label>
                    <input
                        id="schedule-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="form-input"
                    />
                </div>

                {/* Conditional inputs */}
                {schedule.type === "alarm" ? (
                    // Alarm inputs
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
                ) : (
                    // Timer inputs
                    <div>
                        <label htmlFor="timer-minutes" className="form-label">
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
                )}
            </div>
            {/* Close button */}
            <div className="pt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="button button-secondary"
                >
                    Cancel
                </button>
                <button type="submit" className="button button-primary">
                    Save and Restart
                </button>
            </div>
        </form>
    );
};
