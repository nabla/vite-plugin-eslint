const chalk = require("chalk");
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
          const [report] = await eslint.lintFiles(path);
          report.messages.forEach((m) => {
            const prettyPath = path.slice(path.indexOf("/src/") + 1);
            const location = `${prettyPath}(${m.line},${m.column})`;
            const rule = m.ruleId ? ` ${m.ruleId}` : "";
            console.log(
              `${location}: ${chalk[m.severity === 2 ? "red" : "yellow"](
                `${m.message}`
              )}${rule}`
            );
          });
        });
      }
      return null;
    },
  };
};
