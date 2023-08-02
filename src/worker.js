const { workerData, parentPort } = require("worker_threads");
const chalk = require("chalk");
const fs = require("fs").promises;
const { ESLint } = require("eslint");
const eslint = new ESLint(workerData.options);
const path = require("path");
const formatterPromise = workerData.formatter
  ? eslint.loadFormatter(workerData.formatter)
  : undefined;

function getPrettyPath(absolutePath) {
  let relativePath = path.relative(process.cwd(), absolutePath);
  let containingDir = path.dirname(relativePath);

  if (containingDir && containingDir !== '.') {
      relativePath = path.join(path.basename(containingDir), path.basename(relativePath));
  }

  return relativePath;
}

function logMessage(message) {
  console.log(
    chalk.dim(new Date().toLocaleTimeString()),
    chalk.bold(chalk.cyan("[vite-plugin-eslint]")),
    message
  );
}

parentPort.on("message", (path) => {
  eslint
    .isPathIgnored(path)
    .then(async (ignored) => {
      if (ignored) return;
      const [report] = await eslint.lintFiles(path);
      if (!report) return;
      if (report.output !== undefined) await fs.writeFile(path, report.output);
      if (report.messages.length === 0) return;
      if (formatterPromise) {
        const formatter = await formatterPromise;
        logMessage(await formatter.format([report]));
      } else {
        report.messages.forEach((m) => {
          const prettyPath = getPrettyPath(path)
          const location = `${prettyPath}(${m.line},${m.column})`;
          const rule = m.ruleId ? ` ${m.ruleId}` : "";
          const color = chalk[m.severity === 2 ? "red" : "yellow"]
          logMessage(
            `${chalk.dim(location + ':')} ${color(
              m.message
            )}${rule}`
          );
        });
      }
    })
    .catch((e) => {
      if (e.messageTemplate === "file-not-found" && e.messageData?.pattern) {
        // Can happen when the file is deleted or moved
        logMessage(
          `${chalk.yellow(`File not found`)} ${chalk.dim(
            e.messageData.pattern
          )}`
        );
      } else {
        // Otherwise log the full error
        console.error(e);
      }
    });
});
