import * as React from "react";

import { type Schedule } from "../types.ts";
import { ScheduleItem } from "./item.tsx";

interface ScheduleListProps {
    schedules: Schedule[];
    currentTime: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ScheduleList = ({ schedules, currentTime }: ScheduleListProps) => {
    if (schedules.length === 0) {
        return (
            <p className="mt-12 text-center text-slate-500">
                No schedules available.
            </p>
        );
    }

    return (
        <ul className="space-y-4">
            {schedules.map(elem => (
                <ScheduleItem
                    key={elem.id}
                    schedule={elem}
                    currentTime={currentTime}
                />
            ))}
        </ul>
    );
};
