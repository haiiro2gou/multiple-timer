import js from "@eslint/js";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import { essentials, node, typescript, react } from "@haiiro2gou/eslint-config";

export default tseslint.config([
    globalIgnores(["dist", "vite.config.ts"]),
    ...essentials,
    ...node,
    ...typescript,
    ...react,
    {
        files: ["**/*.{ts,tsx}"],
        extends: [js.configs.recommended, reactRefresh.configs.vite],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ["./tsconfig.json", "./tsconfig.eslint.json"],
            },
        },
    },
]);
