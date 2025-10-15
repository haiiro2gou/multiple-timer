import * as React from "react";

import { useModal } from "../../modal";
import { type Schedule, ScheduleForm, ScheduleList } from "../../schedule";
import { ConfirmDialog } from "../../common/ConfirmDialog";
import { type Category } from "../types.ts";
import { useCategories } from "../hooks/use-categories.ts";
import { CategoryForm } from "./form.tsx";

interface CategoryPanelProps {
    category: Category;
    schedules: Schedule[];
    currentTime: number;
    flashingId: string | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CategoryPanel = ({
    category,
    schedules,
    currentTime,
    flashingId,
}: CategoryPanelProps) => {
    const { showModal, hideModal } = useModal();
    const { deleteCategory } = useCategories();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
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

    const handleAddSchedule = React.useCallback(() => {
        showModal(
            <ScheduleForm onClose={hideModal} categoryId={category.id} />
        );
    }, [category.id, hideModal, showModal]);

    const handleEditCategory = React.useCallback(() => {
        setIsMenuOpen(false);
        showModal(<CategoryForm category={category} onClose={hideModal} />);
    }, [category, hideModal, showModal]);

    const confirmDelete = React.useCallback(() => {
        deleteCategory(category.id);
        hideModal();
    }, [category.id, deleteCategory, hideModal]);

    const handleDeleteCategory = React.useCallback(() => {
        setIsMenuOpen(false);

        showModal(
            <ConfirmDialog
                title="Delete Category"
                message="Are you sure you want to delete this category?"
                onConfirm={confirmDelete}
                onCancel={hideModal}
            />
        );
    }, [confirmDelete, hideModal, showModal]);

    const handleMenuToggle = React.useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex flex-col h-[32rem]">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">
                    {category.name}
                </h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleAddSchedule}
                        className="px-3 py-1.5 text-xs bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-600"
                    >
                        + Add Schedule
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={handleMenuToggle}
                            className="p-2 text-slate-500 rounded-full hover:bg-slate-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        {isMenuOpen ? (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                <button
                                    onClick={handleEditCategory}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    Edit Category
                                </button>
                                <button
                                    onClick={handleDeleteCategory}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete Category
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Schedule List */}
            <div className="flex-grow overflow-y-auto p-4 min-h-0">
                <ScheduleList
                    schedules={schedules}
                    currentTime={currentTime}
                    flashingId={flashingId}
                />
            </div>
        </section>
    );
};
