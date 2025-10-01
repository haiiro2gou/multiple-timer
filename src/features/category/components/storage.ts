import { type Category } from "../types.ts";

const STORAGE_KEY = "haiiro2gou-schedule-categories";

const initialCategories: Category[] = [{ id: "default", name: "Default" }];

export const loadCategoriesFromStorage = (): Category[] => {
    try {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const serializedData = localStorage.getItem(STORAGE_KEY);
        if (serializedData !== null)
            return JSON.parse(serializedData) as Category[];
        return initialCategories;
    } catch (e) {
        console.error("Failed to load categories from storage:", e);
        return initialCategories;
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
