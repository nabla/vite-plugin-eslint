const chalk = require("chalk");
const { ESLint } = require("eslint");
const { normalizePath } = require("vite");

module.exports = function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\/src\/.*\.[jt]sx?$/),
    formatter: format,
  } = options;
  const eslint = new ESLint({ cache: true, ...eslintOptions });

  const formatterPromise = format ? eslint.loadFormatter(format) : undefined;

  return {
    name: "eslint",
    apply: "serve",
    transform(_code, id) {
      const path = normalizePath(id);
      if (shouldLint(path)) {
        eslint.isPathIgnored(path).then(async (ignored) => {
          if (ignored) return;
          const [report] = await eslint.lintFiles(path);
          if (report.messages.length === 0) return;
          if (formatterPromise) {
            const formatter = await formatterPromise;
            console.log(formatter.format([report]));
          } else {
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
          }
        });
      }
      return null;
    },
  };
};
