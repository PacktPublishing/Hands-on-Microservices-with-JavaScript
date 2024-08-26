// eslint.config.js
import { ESLint } from "eslint";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      "semi": "error",
      "quotes": ["error", "double"],
      "no-unused-vars": "warn",
    },
  },
];
