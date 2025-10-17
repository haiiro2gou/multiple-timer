import * as React from "react";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CacheProvider } from "./features/cache-provider.tsx";
import { ModalProvider, useModal } from "./features/modal";
import {
    type Schedule,
    ScheduleItem,
    useCurrentTime,
    useSchedules,
    initializeTimerCache,
} from "./features/schedule";
import {
    type Category,
    CategoryForm,
    CategoryPanel,
    useCategories,
} from "./features/category";
import { useSound } from "./features/sound.ts";
import { useDndSensors } from "./features/dnd-sensor.ts";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContent = () => {
    const { schedules, updateSchedule, setSchedules, restartTimer } =
        useSchedules();
    const { categories, setCategories } = useCategories();
    const currentTime = useCurrentTime();
    const { showModal, hideModal } = useModal();
    const [activeItem, setActiveItem] = React.useState<Schedule | null>(null);
    const [activeCategory, setActiveCategory] = React.useState<Category | null>(
        null
    );
    const sensors = useDndSensors();
    const [flashingId, setFlashingId] = React.useState<string | null>(null);
    const lastTriggeredTimeRef = React.useRef<string | null>(null);
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

    const handleDragStart = React.useCallback(
        (event: DragStartEvent) => {
            if (event.active.data.current?.type === "category") {
                setActiveCategory(
                    categories.find(c => c.id === event.active.id) ?? null
                );
            } else {
                setActiveItem(
                    schedules.find(s => s.id === event.active.id) ?? null
                );
            }
        },
        [categories, schedules]
    );

    const handleDragEnd = React.useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (over === null || active.id === over.id) {
                setActiveItem(null);
                setActiveCategory(null);
                return;
            }

            if (
                active.data.current?.type === "category" &&
                over.data.current?.type === "category"
            ) {
                const oldIndex = categories.findIndex(
                    elem => elem.id === active.id
                );
                const newIndex = categories.findIndex(
                    elem => elem.id === over.id
                );
                const newCategories = arrayMove(categories, oldIndex, newIndex);
                setCategories(newCategories);
            }
            if (
                active.data.current?.type === "schedule" &&
                over.data.current?.type === "schedule"
            ) {
                const oldIndex = schedules.findIndex(
                    elem => elem.id === active.id
                );
                const newIndex = schedules.findIndex(
                    elem => elem.id === over.id
                );
                const newSchedules = arrayMove(schedules, oldIndex, newIndex);

                const activeItem = schedules[oldIndex];
                const overItem = schedules[newIndex];
                if (activeItem.categoryId !== overItem.categoryId) {
                    const updatedSchedules = newSchedules.map((s, idx) =>
                        idx === newIndex
                            ? { ...activeItem, categoryId: overItem.categoryId }
                            : s
                    );
                    setSchedules(updatedSchedules);
                } else {
                    setSchedules(newSchedules);
                }
            }

            setActiveItem(null);
            setActiveCategory(null);
        },
        [categories, schedules, setCategories, setSchedules]
    );

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
        showModal(<CategoryForm onClose={hideModal} />);
    }, [hideModal, showModal]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <header className="w-full pt-8 pb-4 px-4 sm:px-6 lg:px-8 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-extrabold text-slate-900">
                            Timers / Alarms
                        </h1>
                    </div>
                </header>

                {/* Main content */}
                <main className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex-grow overflow-x-auto">
                    <SortableContext
                        items={categories.map(elem => elem.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex space-x-8 h-full">
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
                    </SortableContext>
                </main>
            </div>
            <DragOverlay>
                {activeCategory !== null ? (
                    <CategoryPanel
                        category={activeCategory}
                        schedules={schedules.filter(
                            elem => elem.categoryId === activeCategory.id
                        )}
                        currentTime={currentTime}
                        flashingId={null}
                    />
                ) : null}
                {activeItem !== null ? (
                    <ScheduleItem
                        schedule={activeItem}
                        currentTime={currentTime}
                        isFlashing={false}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
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
