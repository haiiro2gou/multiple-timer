import * as React from "react";

import { useModal } from "../../modal";
import { type Schedule, ScheduleForm, ScheduleList } from "../../schedule";
import { type Category } from "../types";

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

    const handleAddSchedule = React.useCallback(() => {
        showModal(
            <ScheduleForm onClose={hideModal} categoryId={category.id} />
        );
    }, [category.id, hideModal, showModal]);

    return (
        <section className="bg-white/80 backdrop-blue-sm rounded-xl shadow-lg p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    {category.name}
                </h2>
                <button
                    onClick={handleAddSchedule}
                    className="px-3 py-1.5 text-sm bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                >
                    + Add Schedule
                </button>
            </div>

            {/* Schedule List */}
            <div className="flex-grow overflow-y-auto">
                <ScheduleList
                    schedules={schedules}
                    currentTime={currentTime}
                    flashingId={flashingId}
                />
            </div>
        </section>
    );
};
