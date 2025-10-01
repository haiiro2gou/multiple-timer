import * as React from "react";

import { useCategories } from "../hooks/use-categories.ts";

interface CategoryTabsProps {
    activeCategoryId: string;
    onSelectCategory: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CategoryTabs = ({
    activeCategoryId,
    onSelectCategory,
}: CategoryTabsProps) => {
    const { categories, addCategory } = useCategories();
    const [newCategoryName, setNewCategoryName] = React.useState("");
    const [isAdding, setIsAdding] = React.useState(false);

    const handleAddCategory = React.useCallback(() => {
        addCategory({ name: newCategoryName });
        setNewCategoryName("");
        setIsAdding(false);
    }, [addCategory, newCategoryName]);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleAddCategory();
            if (e.key === "Escape") {
                setNewCategoryName("");
                setIsAdding(false);
            }
        },
        [handleAddCategory]
    );

    const handleSelectCategory = React.useCallback(() => {
        onSelectCategory(activeCategoryId);
    }, [activeCategoryId, onSelectCategory]);

    const handleNewCategoryNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewCategoryName(e.target.value);
        },
        []
    );

    const handleIsAdding = React.useCallback(() => {
        setIsAdding(true);
    }, []);

    return (
        <div className="border-b border-slate-200">
            <nav
                className="-mb-px flex space-x-6 overflow-x-auto"
                aria-label="Tabs"
            >
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={handleSelectCategory}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            category.id === activeCategoryId
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
                {isAdding ? (
                    <div className="py-3 flex items-center">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={handleNewCategoryNameChange}
                            onBlur={handleAddCategory}
                            onKeyDown={handleKeyDown}
                            className="px-2 py-1 text-sm border-slate-300 rounded w-32"
                            placeholder="Category Name"
                        />
                    </div>
                ) : (
                    <button
                        onClick={handleIsAdding}
                        className="py-4 px-1 text-sm font-medium text-slate-500 hover:text-indigo-600 whitespace-nowrap"
                    >
                        + Add Category
                    </button>
                )}
            </nav>
        </div>
    );
};
