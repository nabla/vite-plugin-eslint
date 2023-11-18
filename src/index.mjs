import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import debug0 from "debug";
import { normalizePath } from "vite";

const debug = debug0("eslint");

export default function eslintPlugin(options = {}) {
  const {
    eslintOptions = {},
    shouldLint = (path) => path.match(/\/src\/[^?]*\.(vue|svelte|m?[jt]sx?)$/),
    formatter,
  } = options;

  let worker; // Don't initialize worker for builds

  return {
    name: "vite-plugin-eslint",
    apply: "serve",
    transform(_code, id) {
      const path = normalizePath(id);
      if (!worker) {
        const customFormatter = typeof formatter === "function";
        worker = new Worker(
          resolve(dirname(fileURLToPath(import.meta.url)), "./worker.cjs"),
          {
            workerData: {
              options: { cache: true, ...eslintOptions },
              formatter: typeof formatter === "string" ? formatter : undefined,
              customFormatter,
            },
          },
        );
        if (customFormatter) worker.on("message", formatter);
      }
      if (shouldLint(path)) {
        worker.postMessage(path);
      } else {
        debug(`${path} was ignored by shouldLint`);
      }
      return null;
    },
  };
}
