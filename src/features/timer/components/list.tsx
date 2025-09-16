import * as React from "react";

import { type TimerData } from "../types.ts";
import { TimerItem } from "./item.tsx";

interface TimerListProps {
    timers: TimerData[];
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TimerList = ({ timers, currentTime }: TimerListProps) => {
    if (timers.length === 0) {
        return (
            <p className="mt-8 text-center text-slate-500">
                No timers available.
            </p>
        );
    }

    return (
        <ul className="mt-8 space-y-4">
            {timers.map(elem => (
                <TimerItem
                    key={elem.id}
                    timer={elem}
                    currentTime={currentTime}
                />
            ))}
        </ul>
    );
};
