import * as React from "react";

import { Modal } from "./modal.tsx";
import { ModalContext } from "./context.ts";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [modalContent, setModalContent] =
        React.useState<React.ReactNode | null>(null);

    const showModal = (content: React.ReactNode) => {
        setModalContent(content);
    };
    const hideModal = React.useCallback(() => {
        setModalContent(null);
    }, []);

    const isModalOpen = modalContent !== null;

    return (
        <ModalContext.Provider value={{ showModal, hideModal, isModalOpen }}>
            {children}
            <Modal isOpen={isModalOpen} onClose={hideModal}>
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    );
};
