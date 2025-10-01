import * as React from "react";

import { CacheProvider } from "./features/cache-provider.tsx";
import { ModalProvider, useModal } from "./features/modal";
import {
    type Schedule,
    ScheduleList,
    ScheduleForm,
    useCurrentTime,
    useSchedules,
    initializeTimerCache,
} from "./features/schedule";
import { CategoryTabs } from "./features/category";
import { useSound } from "./features/sound.ts";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContent = () => {
    const { schedules, updateSchedule, restartTimer } = useSchedules();
    const currentTime = useCurrentTime();
    const { showModal, hideModal } = useModal();
    const lastTriggeredTimeRef = React.useRef<string | null>(null);
    const [flashingId, setFlashingId] = React.useState<string | null>(null);
    const flashTimeoutRef = React.useRef<number | null>(null);
    const triggeredIdsRef = React.useRef<Set<string>>(new Set());
    const { initAudio, playAlarmSound } = useSound();
    const [activeCategoryId, setActiveCategoryId] = React.useState("all");

    React.useEffect(() => {
        const initializeAudio = () => {
            initAudio();
            window.removeEventListener("click", initializeAudio);
        };
        window.addEventListener("click", initializeAudio);

        return () => {
            window.removeEventListener("click", initializeAudio);
        };
    }, [initAudio]);

    React.useEffect(() => {
        const now = new Date(currentTime);

        // Function to trigger an event
        const triggerEvent = (schedule: Schedule) => {
            if (triggeredIdsRef.current.has(schedule.id)) return;

            triggeredIdsRef.current.add(schedule.id);

            // Immediate feedback
            playAlarmSound();
            setFlashingId(schedule.id);

            if (schedule.type === "timer" && schedule.repeat)
                restartTimer(schedule.id);

            // Delay to remove the flashing effect
            if (flashTimeoutRef.current !== null)
                clearTimeout(flashTimeoutRef.current);

            flashTimeoutRef.current = window.setTimeout(() => {
                setFlashingId(null);

                if (
                    schedule.type === "alarm" &&
                    !schedule.days.some(elem => elem)
                )
                    updateSchedule({ ...schedule, enabled: false });
                if (schedule.type === "timer" && !schedule.repeat)
                    updateSchedule({ ...schedule, status: "finished" });

                if (
                    (schedule.type === "alarm" &&
                        schedule.days.some(elem => elem)) ||
                    (schedule.type === "timer" && schedule.repeat)
                )
                    triggeredIdsRef.current.delete(schedule.id);
            }, 3000);
        };

        schedules.forEach(elem => {
            if (triggeredIdsRef.current.has(elem.id)) return;

            if (elem.type === "alarm" && elem.enabled) {
                const isRepeating = elem.days.some(elem => elem);
                const [alarmHour, alarmMinute] = elem.time
                    .split(":")
                    .map(Number);

                if (isRepeating) {
                    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
                    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`; // "HH:MM"

                    if (
                        elem.days[dayOfWeek] &&
                        elem.time === currentTimeStr &&
                        lastTriggeredTimeRef.current !== currentTimeStr
                    ) {
                        triggerEvent(elem);
                        lastTriggeredTimeRef.current = currentTimeStr;
                    }
                } else {
                    const prevTime = new Date(currentTime - 50);

                    // Calculate the target time
                    const targetTime = new Date(now);
                    targetTime.setHours(alarmHour, alarmMinute, 0, 0);
                    if (targetTime.getTime() < prevTime.getTime())
                        targetTime.setDate(targetTime.getDate() + 1);

                    if (
                        targetTime.getTime() > prevTime.getTime() &&
                        targetTime.getTime() <= now.getTime()
                    )
                        triggerEvent(elem);
                }
            }
            if (
                elem.type === "timer" &&
                elem.status === "running" &&
                elem.targetTime <= currentTime
            )
                triggerEvent(elem);
        });
    }, [currentTime, playAlarmSound, restartTimer, schedules, updateSchedule]);

    const handleAddSchedule = React.useCallback(() => {
        if (activeCategoryId === "all") {
            alert("Please select a specific category to add a schedule.");
            return;
        }
        showModal(
            <ScheduleForm onClose={hideModal} categoryId={activeCategoryId} />
        );
    }, [activeCategoryId, hideModal, showModal]);

    const filteredSchedules = React.useMemo(() => {
        if (activeCategoryId === "all") return schedules;
        return schedules.filter(s => s.categoryId === activeCategoryId);
    }, [activeCategoryId, schedules]);

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-10 w-fll bg-slate-100/95 backdrop-blue-sm shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-4xl font-bold text-start text-slate-900">
                        Timers / Alarms
                    </h1>
                    <CategoryTabs
                        activeCategoryId={activeCategoryId}
                        onSelectCategory={setActiveCategoryId}
                    />
                </div>
            </header>

            {/* Main content */}
            <main className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-28">
                <ScheduleList
                    schedules={filteredSchedules}
                    currentTime={currentTime}
                    flashingId={flashingId}
                />
            </main>

            {/* Floating Add Button */}
            <div className="fixed bottom-8 right-8 z-10">
                <button
                    onClick={handleAddSchedule}
                    aria-label="Add Schedule"
                    className="w-16 h-16 pb-2.5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl shadow-lg transition-transform hover:scale-110"
                    disabled={activeCategoryId === "all"}
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
