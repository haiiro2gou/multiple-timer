import * as React from "react";

import { type TimerData } from "../types.ts";
import { TimerItem } from "./item.tsx";

interface TimerListProps {
    timers: TimerData[];
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TimerList = ({ timers, currentTime }: TimerListProps) => {
    if (timers.length === 0) return <div>No timers available.</div>;

    return (
        <div>
            {timers.map(elem => (
                <TimerItem
                    key={elem.id}
                    timer={elem}
                    currentTime={currentTime}
                ></TimerItem>
            ))}
        </div>
    );
};
