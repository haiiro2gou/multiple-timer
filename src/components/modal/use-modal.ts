import * as React from "react";
import { ModalContext, type ModalContextType } from "./context";

export const useModal = (): ModalContextType => {
    const context = React.useContext(ModalContext);
    if (context === undefined)
        throw new Error("useModal must be used within a ModalProvider");
    return context;
};
