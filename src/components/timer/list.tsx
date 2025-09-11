import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { type TimerData } from "../../types/timer.ts";
import { timerQueryKeys } from "./query-key";
import { TimerItem } from "./item.tsx";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TimerList = () => {
    const { data: timers = [] } = useQuery<TimerData[]>({
        queryKey: timerQueryKeys.all,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });

    const [currentTime, setCurrentTime] = React.useState(Date.now());

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

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
