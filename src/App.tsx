import * as React from "react";

import { CacheProvider } from "./features/cache-provider.tsx";
import { ModalProvider } from "./features/modal";
import {
    TimerList,
    useCurrentTime,
    useTimers,
    initializeTimerCache,
} from "./features/timer";

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppContent = () => {
    const { timers, addTimer, updateTimer } = useTimers();
    const currentTime = useCurrentTime();

    React.useEffect(() => {
        timers.forEach(elem => {
            if (elem.status === "running" && elem.targetTime <= currentTime)
                updateTimer({ ...elem, status: "finished" });
        });
    }, [currentTime, timers, updateTimer]);

    const handleAddTimer = () => {
        addTimer({ name: "New Timer", duration: 5 * 60 * 1000, repeat: false });
    };

    return (
        <>
            <header className="sticky top-0 z-10 w-fll bg-slate-100/95 backdrop-blue-sm shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-4xl font-bold text-start text-slate-900">
                        Timers / Alarms
                    </h1>
                </div>
            </header>

            <main className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-28">
                <TimerList timers={timers} currentTime={currentTime} />
            </main>

            <div className="fixed bottom-8 left-8">
                <button
                    /* eslint-disable-next-line react/jsx-no-bind */
                    onClick={handleAddTimer}
                    aria-label="Add 5-min timer"
                    className="
                        w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center
                        text-4xl shadow-lg transition-transform duration-200 pb-2.5
                        hover:bg-indigo-700 hover:scale-110
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    "
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
            <div className="min-h-screen">
                <AppContent />
            </div>
        </ModalProvider>
    </CacheProvider>
);
