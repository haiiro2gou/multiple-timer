import * as React from "react";

import { type Schedule } from "../types.ts";
import { ScheduleItem } from "./item.tsx";

interface ScheduleListProps {
    schedules: Schedule[];
    currentTime: number;
    flashingId: string | null;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ScheduleList = ({
    schedules,
    currentTime,
    flashingId,
}: ScheduleListProps) => {
    if (schedules.length === 0) {
        return (
            <p className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-lg">
                No schedules available.
            </p>
        );
    }

    return (
        <ul className="space-y-3">
            {schedules.map(elem => (
                <ScheduleItem
                    key={elem.id}
                    schedule={elem}
                    currentTime={currentTime}
                    isFlashing={elem.id === flashingId}
                />
            ))}
        </ul>
    );
};
