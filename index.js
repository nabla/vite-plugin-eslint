const path = require("path");
const { Worker } = require("worker_threads");
const { normalizePath } = require("vite");

module.exports = function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\/src\/.*\.[jt]sx?$/),
    formatter,
  } = options;

  const worker = new Worker(path.resolve(__dirname, "./worker.js"), {
    workerData: { options: { cache: true, ...eslintOptions }, formatter },
  });

  return {
    name: "eslint",
    apply: "serve",
    transform(_code, id) {
      const path = normalizePath(id);
      if (shouldLint(path)) worker.postMessage(path);
      return null;
    },
  };
};
