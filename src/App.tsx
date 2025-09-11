import * as React from "react";

import { CacheProvider } from "./features/cache-provider.tsx";
import {
    TimerList,
    useCurrentTime,
    useTimers,
    initializeTimerCache,
} from "./features/timer/index.ts";

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
        <div style={{ padding: "2rem" }}>
            <h1>Timers / Alarms</h1>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <button onClick={handleAddTimer}>Add 5-min Timer</button>
            <TimerList timers={timers} currentTime={currentTime} />
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = () => (
    <CacheProvider initializer={initializeTimerCache}>
        <AppContent />
    </CacheProvider>
);
