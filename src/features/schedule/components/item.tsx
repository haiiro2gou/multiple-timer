import * as React from "react";

import { type Schedule, type TimerSchedule } from "../types.ts";
import { useSchedules } from "../hooks/use-schedules.ts";
import { useModal } from "../../modal";
import { DeleteConfirmation } from "./delete-confirmation.tsx";
import { EditScheduleForm } from "./edit-form.tsx";
import "../style.css";

const calculateRemainingTime = (
    schedule: TimerSchedule,
    currentTime: number
): number => {
    if (schedule.status === "finished") return 0;
    if (schedule.status === "paused") return schedule.remainingOnPause ?? 0;
    const remaining = schedule.targetTime - currentTime;
    return Math.max(0, remaining);
};

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface ScheduleItemProps {
    schedule: Schedule;
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ScheduleItem = ({ schedule, currentTime }: ScheduleItemProps) => {
    const { deleteSchedule, pauseTimer, resumeTimer, toggleAlarm } =
        useSchedules();
    const { showModal, hideModal } = useModal();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current !== null &&
                !menuRef.current.contains(event.target as Node)
            )
                setIsMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleToggleAlarm = React.useCallback(() => {
        if (schedule.type === "alarm") toggleAlarm(schedule.id);
    }, [schedule.id, schedule.type, toggleAlarm]);

    const handlePauseResume = React.useCallback(() => {
        if (schedule.type !== "timer") return;
        if (schedule.status === "running") pauseTimer(schedule.id);
        else if (schedule.status === "paused") resumeTimer(schedule.id);
    }, [schedule, pauseTimer, resumeTimer]);

    const handleMenuToggle = React.useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const handleEdit = React.useCallback(() => {
        setIsMenuOpen(false);
        // Pause timer if running
        if (schedule.type === "timer" && schedule.status === "running")
            pauseTimer(schedule.id);
        // Disable alarm if enabled
        if (schedule.type === "alarm" && schedule.enabled)
            toggleAlarm(schedule.id);

        showModal(<EditScheduleForm schedule={schedule} onClose={hideModal} />);
    }, [hideModal, pauseTimer, schedule, showModal, toggleAlarm]);

    const confirmDelete = React.useCallback(() => {
        deleteSchedule(schedule.id);
        hideModal();
    }, [deleteSchedule, hideModal, schedule.id]);

    const handleDelete = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setIsMenuOpen(false);

            // Delete immediately if Shift key is held
            if (event.shiftKey) {
                deleteSchedule(schedule.id);
                return;
            }
            // Show confirmation modal
            showModal(
                <DeleteConfirmation
                    scheduleName={schedule.name}
                    onConfirm={confirmDelete}
                    onCancel={hideModal}
                />
            );
        },
        [
            deleteSchedule,
            hideModal,
            showModal,
            schedule.id,
            schedule.name,
            confirmDelete,
        ]
    );

    // Determine styles based on schedule state
    const isInactive =
        (schedule.type === "alarm" && !schedule.enabled) ||
        (schedule.type === "timer" && schedule.status === "paused");
    const isFinished =
        schedule.type === "timer" && schedule.status === "finished";

    const displayTime: string = (() => {
        if (schedule.type === "alarm") return schedule.time;
        if (isFinished) return "Finished!";
        return formatTime(calculateRemainingTime(schedule, currentTime));
    })();

    return (
        <li
            className={`schedule-item ${isInactive ? "opacity-60" : ""} ${isFinished ? "bg-green-50" : "bg-white"}`}
        >
            <div className="schedule-content">
                {/* Header: name and type */}
                <div className="schedule-header">
                    <span
                        className={`schedule-name ${isFinished ? "text-green-700" : "text-slate-500"}`}
                    >
                        {schedule.name}
                    </span>
                    <span
                        className={`schedule-badge ${
                            schedule.type === "alarm"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {schedule.type === "alarm" ? "Alarm" : "Timer"}
                    </span>
                </div>

                {/* Remaining time or target time */}
                <strong
                    className={`schedule-time ${isFinished ? "text-green-600" : "text-slate-900"}`}
                >
                    {displayTime}
                </strong>
            </div>

            {/* Menu */}
            <div className="schedule-actions">
                {schedule.type === "alarm" ? (
                    // Toggle button for alarms
                    <button
                        type="button"
                        onClick={handleToggleAlarm}
                        aria-pressed={schedule.enabled}
                        className={`w-14 h-8 items-center rounded-full p-1 duration-300 ease-in-out focus:outline-none ${
                            schedule.enabled ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                            aria-hidden="true"
                            className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                                schedule.enabled ? "translate-x-6" : ""
                            }`}
                        />
                    </button>
                ) : (
                    // Pause / resume button for timers
                    <>
                        <button
                            type="button"
                            onClick={handlePauseResume}
                            className="p-2 text-slate-500 rounded-full hover:bg-slate-200"
                            aria-label={
                                isInactive ? "Resume timer" : "Pause timer"
                            }
                        >
                            {isInactive ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    </>
                )}
                {/* Menu button */}
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={handleMenuToggle}
                        aria-label="Open menu"
                        className="schedule-action-button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v.01M12 12v.01M12 19v.01"
                            />
                        </svg>
                    </button>
                    {isMenuOpen ? (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                            <button
                                onClick={handleEdit}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                            >
                                Delete
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </li>
    );
};
