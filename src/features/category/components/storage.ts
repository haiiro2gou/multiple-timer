import { v4 as uuidv4 } from "uuid";

import { type Category } from "../types.ts";

const STORAGE_KEY = "haiiro2gou-schedule-categories";

const initialCategory: Category = { id: uuidv4(), name: "Your First Category" };

export const loadCategoriesFromStorage = (): Category[] => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const serializedData = localStorage.getItem(STORAGE_KEY);
        if (serializedData === null) {
            saveCategoriesToStorage([initialCategory]);
            return [initialCategory];
        }
        return JSON.parse(serializedData) as Category[];
    } catch (e) {
        console.error("Failed to load categories from storage:", e);
        return [];
    }
};

export const saveCategoriesToStorage = (categories: Category[]): void => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
        console.error("Failed to save categories to storage:", e);
    }
};
