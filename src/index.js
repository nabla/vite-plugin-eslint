const { resolve } = require("path");
const { Worker } = require("worker_threads");
const debug = require("debug")("eslint");
const { normalizePath } = require("vite");

module.exports = function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\/src\/[^?]*\.(vue|svelte|m?[jt]sx?)$/),
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
      if (shouldLint(path)) {
        worker.postMessage(path);
      } else {
        debug(`${path} was ignored by shouldLint`);
      }
      return null;
    },
  };
};
