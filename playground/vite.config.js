import eslint from "..";

export default {
  plugins: [
    eslint({
      formatter: console.log,
    }),
  ],
};
