import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import boundaries from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    // Приложение (browser, React) — строгое type-aware linting и FSD-ограничения
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      boundaries,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.app.json",
        },
      },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "pages", pattern: "src/pages/**" },
        { type: "widgets", pattern: "src/widgets/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "entities", pattern: "src/entities/**" },
        // Исключение: в проекте есть набор селектов, физически лежащих в shared,
        // но зависящих от entities (fetch/typing). Классифицируем их как entities для строгих правил слоёв.
        { type: "entities", pattern: "src/shared/ui/select/**" },
        { type: "shared", pattern: "src/shared/**" },
      ],
    },
    rules: {
      // сортировка/чистка импортов
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // react
      "react/prop-types": "off",
      "react/jsx-key": "warn",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // TS safety (пока в warn, иначе будет 1к+ ошибок. Буду ужесточать постепенно)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",

      // FSD: слои (строго)
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "app",
              allow: [
                "app",
                "pages",
                "widgets",
                "features",
                "entities",
                "shared",
              ],
            },
            {
              from: "pages",
              allow: ["pages", "widgets", "features", "entities", "shared"],
            },
            {
              from: "widgets",
              allow: ["widgets", "features", "entities", "shared", "app"],
            },
            { from: "features", allow: ["features", "entities", "shared"] },
            { from: "entities", allow: ["entities", "shared"] },
            { from: "shared", allow: ["shared"] },
          ],
        },
      ],

      // FSD: запрет absolute deep-import между срезами (только через public API)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/**", "!@/features/*"],
              message:
                "Импорт из features — только через public API: @/features/<slice>",
            },
            {
              group: ["@/entities/*/**", "!@/entities/*"],
              message:
                "Импорт из entities — только через public API: @/entities/<slice>",
            },
            {
              group: ["@/widgets/*/**", "!@/widgets/*"],
              message:
                "Импорт из widgets — только через public API: @/widgets/<slice>",
            },
            {
              group: ["@/pages/*/**", "!@/pages/*"],
              message:
                "Импорт из pages — только через public API: @/pages/<page>",
            },
          ],
        },
      ],

      "prettier/prettier": "warn",
    },
  },
  {
    // Tooling/Node-окружение (vite config, scripts) — без parserOptions.project,
    // чтобы ESLint не падал на файлах вне tsconfig.app.json
    files: ["vite.config.ts", "scripts/**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.node.json",
        },
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prettier/prettier": "warn",
    },
  },
  prettierConfig,
]);
