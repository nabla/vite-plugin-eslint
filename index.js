const { ESLint } = require("eslint");
const { normalizePath } = require("vite");

module.exports = function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\.[jt]sx?$/),
  } = options;
  const eslint = new ESLint({ cache: true, ...eslintOptions });

  return {
    name: "eslint",
    apply: "serve",
    transform(_code, id) {
      const path = normalizePath(id);
      if (path.includes("/src/") && shouldLint(path)) {
        eslint.isPathIgnored(path).then(async (ignored) => {
          if (ignored) return;
          const report = await eslint.lintFiles(path);
          const formatter = await eslint.loadFormatter('stylish');
          const result = formatter.format(report);
          const hasWarnings = report.some(
              (item) => item.warningCount !== 0
          );
          const hasErrors = report.some(
              (item) => item.errorCount !== 0
          );
          if (hasWarnings || hasErrors) {
            console.log(result);
          }
        });
      }
      return null;
    },
  };
};
