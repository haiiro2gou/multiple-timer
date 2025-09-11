import { type TimerData } from "../../types/timer.ts";

const STORAGE_KEY = "haiiro2gou-timer";

export const loadTimerDatasFromStorage = (): TimerData[] => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const serializedData = localStorage.getItem(STORAGE_KEY);
        if (serializedData !== null)
            return JSON.parse(serializedData) as TimerData[];
        return [];
    } catch (e) {
        console.error("Failed to load timers from storage:", e);
        return [];
    }
};

export const saveTimerDatasToStorage = (timerDatas: TimerData[]): void => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timerDatas));
    } catch (e) {
        console.error("Failed to save timers to storage:", e);
    }
};
