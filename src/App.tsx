import * as React from "react";

import { CacheProvider } from "./features/cache-provider.tsx";
import { ModalProvider } from "./features/modal";
import {
    type Schedule,
    useCurrentTime,
    useSchedules,
    initializeTimerCache,
} from "./features/schedule";
import { CategoryPanel, useCategories } from "./features/category";
import { useSound } from "./features/sound.ts";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContent = () => {
    const { schedules, updateSchedule, restartTimer } = useSchedules();
    const { categories, addCategory } = useCategories();
    const currentTime = useCurrentTime();
    const lastTriggeredTimeRef = React.useRef<string | null>(null);
    const [flashingId, setFlashingId] = React.useState<string | null>(null);
    const flashTimeoutRef = React.useRef<number | null>(null);
    const triggeredIdsRef = React.useRef<Set<string>>(new Set());
    const { initAudio, playAlarmSound } = useSound();

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

    const groupedSchedules = React.useMemo(
        () =>
            categories.map(elem => ({
                category: elem,
                schedules: schedules.filter(
                    elem2 => elem2.categoryId === elem.id
                ),
            })),
        [categories, schedules]
    );

    const handleAddCategory = React.useCallback(() => {
        const name = prompt("Enter new category name:");
        if (name !== null) addCategory({ name });
    }, [addCategory]);

    return (
        <>
            {/* Header */}
            <header className="w-full pt-8 pb-4 px-4 sm:px-6 lg:px-8 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-5xl font-extrabold text-slate-900">
                        Timers / Alarms
                    </h1>
                </div>
            </header>

            {/* Main content */}
            <main className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {groupedSchedules.map(elem => (
                        <CategoryPanel
                            key={elem.category.id}
                            category={elem.category}
                            schedules={elem.schedules}
                            currentTime={currentTime}
                            flashingId={flashingId}
                        />
                    ))}
                    <button
                        onClick={handleAddCategory}
                        className="border-4 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:border-slate-400 transition-colors min-h-[24rem]"
                    >
                        <div className="text-center">
                            <div className="text-4xl">+</div>
                            <div className="mt-2 font-semibold">
                                Add Category
                            </div>
                        </div>
                    </button>
                </div>
            </main>
        </>
    );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = () => (
    <CacheProvider initializer={initializeTimerCache}>
        <ModalProvider>
            <div className="min-h-screen bg-slate-100">
                <AppContent />
            </div>
        </ModalProvider>
    </CacheProvider>
);
