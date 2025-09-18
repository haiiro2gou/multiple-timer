import * as React from "react";

import { CacheProvider } from "./features/cache-provider.tsx";
import { ModalProvider, useModal } from "./features/modal";
import {
    ScheduleList,
    useCurrentTime,
    useSchedules,
    initializeTimerCache,
} from "./features/schedule";
import { AddScheduleForm } from "./features/schedule/components/add-form.tsx";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContent = () => {
    const { schedules, updateSchedule } = useSchedules();
    const currentTime = useCurrentTime();
    const { showModal, hideModal } = useModal();

    React.useEffect(() => {
        schedules.forEach(elem => {
            if (
                elem.type === "timer" &&
                elem.status === "running" &&
                elem.targetTime <= currentTime
            )
                updateSchedule({ ...elem, status: "finished" });
        });
    }, [currentTime, schedules, updateSchedule]);

    const handleAddSchedule = React.useCallback(() => {
        showModal(<AddScheduleForm onClose={hideModal} />);
    }, [hideModal, showModal]);

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-10 w-fll bg-slate-100/95 backdrop-blue-sm shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-4xl font-bold text-start text-slate-900">
                        Timers / Alarms
                    </h1>
                </div>
            </header>

            {/* Main content */}
            <main className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-28">
                <ScheduleList schedules={schedules} currentTime={currentTime} />
            </main>

            {/* Floating Add Button */}
            <div className="fixed bottom-8 right-8 z-10">
                <button
                    onClick={handleAddSchedule}
                    aria-label="Add Schedule"
                    className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl shadow-lg transition-transform hover:scale-110"
                >
                    +
                </button>
            </div>
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = () => (
    <CacheProvider initializer={initializeTimerCache}>
        <ModalProvider>
            <div className="min-h-screen bg-slate-50">
                <AppContent />
            </div>
        </ModalProvider>
    </CacheProvider>
);
