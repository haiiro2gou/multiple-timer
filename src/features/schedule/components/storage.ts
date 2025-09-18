import { type Schedule } from "../types.ts";

const STORAGE_KEY = "haiiro2gou-schedules";

export const loadSchedulesFromStorage = (): Schedule[] => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const serializedData = localStorage.getItem(STORAGE_KEY);
        if (serializedData !== null)
            return JSON.parse(serializedData) as Schedule[];
        return [];
    } catch (e) {
        console.error("Failed to load schedules from storage:", e);
        return [];
    }
};

export const saveSchedulesToStorage = (timerDatas: Schedule[]): void => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timerDatas));
    } catch (e) {
        console.error("Failed to save schedules to storage:", e);
    }
};
