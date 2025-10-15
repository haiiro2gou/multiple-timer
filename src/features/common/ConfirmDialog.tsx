import * as React from "react";

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ConfirmDialog = ({
    title,
    message,
    confirmText = "OK",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => (
    <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">{title}</h2>
        <p className="text-slate-600">{message}</p>
        <div className="mt-8 flex justify-end space-x-3">
            <button
                type="button"
                onClick={onCancel}
                className="button button-secondary"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onConfirm}
                className="button button-danger"
            >
                {confirmText}
            </button>
        </div>
    </div>
);
