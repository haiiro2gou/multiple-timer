import * as React from "react";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isBottomButtonVisible, setIsBottomButtonVisible] =
        React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const buttonButtonRef = React.useRef<HTMLButtonElement>(null);

    // Make upper button invisible when lower button is visible
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsBottomButtonVisible(entry.isIntersecting);
            },
            { root: null, threshold: 0.5 }
        );

        const currentButton = buttonButtonRef.current;
        if (currentButton !== null) observer.observe(currentButton);

        return () => {
            if (currentButton !== null) observer.unobserve(currentButton);
        };
    }, []);

    // Close menu when clicking outside
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

    const handleCollapseToggle = React.useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const scheduleIds = React.useMemo(
        () => schedules.map(elem => elem.id),
        [schedules]
    );

    return (
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    {/* Drag & drop handle */}
                    <div className="cursor-grab text-slate-400 p-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {category.name}
                    </h2>
                    {/* Collapse button */}
                    <button
                        onClick={handleCollapseToggle}
                        className="p-1 text-slate-400 rounded-full hover:bg-slate-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Add schedule button */}
                    <button
                        onClick={handleAddSchedule}
                        className={`px-3 py-1.5 text-xs bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-600 transition-opacity duration-300 ${
                            isBottomButtonVisible || isCollapsed
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                        }`}
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
            <div
                className={`transition-all duration-300 ease-in-out grid ${isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
            >
                <div className="flex-grow space-y-3 overflow-y-auto p-4 min-h-0">
                    <SortableContext
                        items={scheduleIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <ScheduleList
                            schedules={schedules}
                            currentTime={currentTime}
                            flashingId={flashingId}
                        />
                    </SortableContext>
                    {/* Add schedule button 2 */}
                    <button
                        ref={buttonButtonRef}
                        onClick={handleAddSchedule}
                        className="w-full flex items-center justify-center mt-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add Schedule
                    </button>
                </div>
            </div>
        </section>
    );
};
