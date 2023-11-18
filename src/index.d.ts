import { ESLint } from "eslint";
import { Plugin } from "vite";

declare const eslintPlugin: (options?: {
  eslintOptions?: ESLint.Options;
  shouldLint?: (path: string) => boolean;
  formatter?: string | ((result: ESLint.LintResult) => void);
}) => Plugin;

export default eslintPlugin;
