import * as React from "react";

import { TimerItem } from "./components/timer/item.tsx";
import { useTimers } from "./hooks/use-timers.ts";
import { useCurrentTime } from "./hooks/use-current-time.ts";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const App = () => {
    const { timers, addTimer, updateTimer } = useTimers();
    const currentTime = useCurrentTime();

    React.useEffect(() => {
        timers.forEach(elem => {
            if (elem.status === "running" && currentTime >= elem.targetTime)
                updateTimer({ ...elem, status: "finished" });
        });
    }, [currentTime, timers, updateTimer]);

    const handleAddTimer = () => {
        addTimer({ name: "New Timer", duration: 5 * 60 * 1000, repeat: false });
    };

    return (
        <div>
            <h1>Timers / Alarms</h1>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <button onClick={handleAddTimer}>Add 5-min Timer</button>
            <ul>
                {timers.map(elem => (
                    <TimerItem
                        key={elem.id}
                        timer={elem}
                        currentTime={currentTime}
                    ></TimerItem>
                ))}
            </ul>
        </div>
    );
};
