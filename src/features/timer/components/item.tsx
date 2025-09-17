import * as React from "react";

import { type TimerData } from "../types.ts";
import { useTimers } from "../hooks/use-timers.ts";
import { useModal } from "../../modal";
import { EditTimerForm } from "./edit-form.tsx";
import { DeleteConfirmation } from "./delete-confirmation.tsx";

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
    const { deleteTimer, pauseTimer, resumeTimer } = useTimers();
    const { showModal, hideModal } = useModal();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const remainingTime = calculateRemainingTime(timer, currentTime);
    const isFinished = timer.status === "finished";

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

    const getDisplayTime = () => {
        if (timer.status === "finished") return "Finished!";
        if (timer.status === "paused")
            return `Paused: ${formatTime(remainingTime)}`;
        return formatTime(remainingTime);
    };

    const handlePauseResume = React.useCallback(() => {
        if (timer.status === "running") pauseTimer(timer.id);
        else if (timer.status === "paused") resumeTimer(timer.id);
    }, [timer, pauseTimer, resumeTimer]);

    const handleMenuToggle = React.useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const handleEdit = React.useCallback(() => {
        setIsMenuOpen(false);
        // Pause the timer if it's running
        if (timer.status === "running") pauseTimer(timer.id);
        showModal(<EditTimerForm timer={timer} onClose={hideModal} />);
    }, [timer, pauseTimer, showModal, hideModal]);

    const confirmDelete = React.useCallback(() => {
        deleteTimer(timer.id);
        hideModal();
    }, [deleteTimer, hideModal, timer.id]);

    const handleDelete = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setIsMenuOpen(false);

            // Delete immediately if Shift key is held
            if (event.shiftKey) {
                deleteTimer(timer.id);
                return;
            }
            // Show confirmation modal
            showModal(
                <DeleteConfirmation
                    timerName={timer.name}
                    onConfirm={confirmDelete}
                    onCancel={hideModal}
                />
            );
        },
        [deleteTimer, hideModal, showModal, timer.id, timer.name, confirmDelete]
    );

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
                {/* Remaining time */}
                <strong
                    className={`
                        font-mono text-3xl font-bold tracking-wider
                        ${isFinished ? "text-green-600" : "text-slate-900"}
                    `}
                >
                    {getDisplayTime()}
                </strong>
            </div>

            {/* Adjust space*/}
            <div className="flex-grow" />

            {/* Pause / Resume button */}
            <div className="flex items-center space-x-2">
                {timer.status === "running" ? (
                    <button
                        onClick={handlePauseResume}
                        aria-label="Pause timer"
                        className="p-2 text-slate-500 rounded-full transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
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
                    </button>
                ) : null}
                {timer.status === "paused" ? (
                    <button
                        onClick={handlePauseResume}
                        aria-label="Resume timer"
                        className="p-2 text-slate-500 rounded-full transition-colors hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
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
                    </button>
                ) : null}
            </div>

            {/* Menu button */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={handleMenuToggle}
                    aria-label="Open menu"
                    className="p-2 text-slate-500 rounded-full transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
                {/* Menu */}
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
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                ) : null}
            </div>
        </li>
    );
};
