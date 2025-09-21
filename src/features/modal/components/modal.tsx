import * as React from "react";

import "../styles.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleOverlayMouseDown = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
        },
        [onClose]
    );

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onMouseDown={handleOverlayMouseDown}
            role="button"
            tabIndex={0}
        >
            <div className="modal-content" role="dialog" aria-modal="true">
                {children}
            </div>
        </div>
    );
};
