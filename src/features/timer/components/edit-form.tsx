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

    const handleSubmit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (name.trim() === "") return;

            const updatedTimer = { ...timer, name };
            updateTimer(updatedTimer);
            onClose();
        },
        [name, timer, updateTimer, onClose]
    );

    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        []
    );

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Edit Timer
            </h2>
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
                    Save
                </button>
            </div>
        </form>
    );
};
