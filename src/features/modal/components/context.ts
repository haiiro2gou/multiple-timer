import * as React from "react";

export interface ModalContextType {
    showModal: (content: React.ReactNode) => void;
    hideModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ModalContext = React.createContext<ModalContextType | undefined>(
    undefined
);
