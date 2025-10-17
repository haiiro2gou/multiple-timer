import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { type Category } from "../types.ts";
import { categoryQueryKeys } from "../components/query-key.ts";
import {
    loadCategoriesFromStorage,
    saveCategoriesToStorage,
} from "../components/storage.ts";

export const useCategories = () => {
    const queryClient = useQueryClient();

    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: categoryQueryKeys.all,
        queryFn: () => loadCategoriesFromStorage(),
        staleTime: Infinity,
    });

    const addCategoryMutation = useMutation({
        mutationFn: async (data: Omit<Category, "id">) => {
            if (data.name.trim().length === 0) return;

            const newCategory: Category = { ...data, id: uuidv4() };
            const currentCategories =
                queryClient.getQueryData<Category[]>(categoryQueryKeys.all) ??
                [];
            const updatedCategories = [...currentCategories, newCategory];
            saveCategoriesToStorage(updatedCategories);
            return Promise.resolve(updatedCategories);
        },
        onSuccess: updatedCategories => {
            queryClient.setQueryData(categoryQueryKeys.all, updatedCategories);
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async (updatedCategory: Category) => {
            const currentCategories =
                queryClient.getQueryData<Category[]>(categoryQueryKeys.all) ??
                [];
            const updatedCategories = currentCategories.map(category =>
                category.id === updatedCategory.id ? updatedCategory : category
            );
            saveCategoriesToStorage(updatedCategories);
            return Promise.resolve(updatedCategories);
        },
        onSuccess: updatedCategories => {
            queryClient.setQueryData(categoryQueryKeys.all, updatedCategories);
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: string) => {
            const currentCategories =
                queryClient.getQueryData<Category[]>(categoryQueryKeys.all) ??
                [];
            const updatedCategories = currentCategories.filter(
                category => category.id !== id
            );
            saveCategoriesToStorage(updatedCategories);
            return Promise.resolve(updatedCategories);
        },
        onSuccess: updatedCategories => {
            queryClient.setQueryData(categoryQueryKeys.all, updatedCategories);
        },
    });

    const setCategoriesMutation = useMutation({
        mutationFn: async (newCategories: Category[]) => {
            saveCategoriesToStorage(newCategories);
            return Promise.resolve(newCategories);
        },
        onSuccess: updatedCategories => {
            queryClient.setQueryData(categoryQueryKeys.all, updatedCategories);
        },
    });

    return {
        categories,
        addCategory: addCategoryMutation.mutate,
        updateCategory: updateCategoryMutation.mutate,
        deleteCategory: deleteCategoryMutation.mutate,
        setCategories: setCategoriesMutation.mutate,
    };
};
