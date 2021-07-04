const { workerData, parentPort } = require("worker_threads");
const chalk = require("chalk");
const { ESLint } = require("eslint");

const eslint = new ESLint(workerData.options);

const formatterPromise = workerData.formatter
  ? eslint.loadFormatter(workerData.formatter)
  : undefined;

parentPort.on("message", (path) => {
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
});
