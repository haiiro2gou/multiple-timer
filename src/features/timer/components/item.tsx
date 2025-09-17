import * as React from "react";

import { type TimerData } from "../types.ts";
import { useTimers } from "../hooks/use-timers.ts";
import { useModal } from "../../modal";
import { EditTimerForm } from "./edit-form.tsx";

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
        return formatTime(remainingTime);
    };

    const handleEdit = React.useCallback(() => {
        setIsMenuOpen(false);
        showModal(<EditTimerForm timer={timer} onClose={hideModal} />);
    }, [showModal, hideModal, timer]);

    const handleDelete = React.useCallback(() => {
        deleteTimer(timer.id);
    }, [deleteTimer, timer.id]);

    const handleMenuToggle = React.useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

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

            <div className="relative" ref={menuRef}>
                {/* Menu button */}
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
