import * as React from "react";
import { useQuery } from "@tanstack/react-query";

interface TimerData {
    name: string;
    isActive: boolean;
    triggerTime: Date | number; // Date for absolute time, number for seconds until trigger
    repeat: boolean;
}

const fetchTimers = () => [] as TimerData[];

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function Timer() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["haiiro2gou-timer"],
        queryFn: fetchTimers,
    });

    if (isLoading) return <div>Loading...</div>;

    if (isError) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return <div style={{ color: "red" }}>Error: {errorMessage}</div>;
    }

    return (
        <div>
            <h2>Timer</h2>
            <ul>
                {data?.map(timers => (
                    <li
                        key={timers.name}
                        style={{
                            textDecoration: timers.isActive
                                ? "none"
                                : "line-through",
                        }}
                    >
                        {timers.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
