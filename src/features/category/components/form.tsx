import * as React from "react";

import { type Category } from "../types.ts";
import { useCategories } from "../hooks/use-categories.ts";

interface CategoryFormProps {
    category?: Category;
    onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
    const { addCategory, updateCategory } = useCategories();
    const [name, setName] = React.useState(category?.name ?? "");

    const handleSubmit = React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (name.trim() === "") return;

            if (category !== undefined) updateCategory({ ...category, name });
            else addCategory({ name });
            onClose();
        },
        [addCategory, category, name, onClose, updateCategory]
    );

    const handleNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
        },
        []
    );

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
                {category !== undefined ? "Edit Category" : "Add Category"}
            </h2>
            <div>
                <label htmlFor="category-name" className="form-label">
                    Category Name
                </label>
                <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="form-input"
                    required
                />
            </div>
            <div className="pt-8 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="button button-secondary"
                >
                    Cancel
                </button>
                <button type="submit" className="button button-primary">
                    Save
                </button>
            </div>
        </form>
    );
};
