module.exports = async function eslintPlugin(options) {
  return (await import("./index.mjs")).default(options)
};
