const { resolve } = require("path");
const { Worker } = require("worker_threads");
const { normalizePath } = require("vite");

module.exports = function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\/src\/.*\.[jt]sx?$/),
    formatter,
  } = options;

  let worker; // Don't initialize worker for builds

  return {
    name: "eslint",
    apply: "serve",
    transform(_code, id) {
      const path = normalizePath(id);
      if (!worker) {
        worker = new Worker(resolve(__dirname, "./worker.js"), {
          workerData: { options: { cache: true, ...eslintOptions }, formatter },
        });
      }
      if (shouldLint(path)) worker.postMessage(path);
      return null;
    },
  };
};
