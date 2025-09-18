import * as React from "react";

interface DeleteConfirmationProps {
    scheduleName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DeleteConfirmation = ({
    scheduleName,
    onConfirm,
    onCancel,
}: DeleteConfirmationProps) => (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Delete Timer</h2>
        <p className="text-slate-600">
            Delete the schedule &quot;
            <span className="font-semibold">{scheduleName}</span>&quot; ?
        </p>
        <p className="mt-2 text-sm text-red-600">
            This action cannot be undone.
        </p>
        <p className="mt-4 text-sm text-slate-500">
            Hold <kbd className="kbd kbd-sm">Shift</kbd> and click the delete
            button to delete without confirmation.
        </p>
        <div className="mt-8 flex justify-end space-x-3">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                Delete
            </button>
        </div>
    </div>
);
