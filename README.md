# @nabla/vite-plugin-eslint

Plugs ESLint into Vite dev server. 

## Differences with [vite-plugin-eslint](https://github.com/gxmari007/vite-plugin-eslint)

- Keeps HMR fast: linting is done asynchronously and doesn't block the transform process
- Reduces noise: Display results via console logs

![logs.png](logs.png)

Because of this, the plugin can't fail the build and is only applied in dev. Like typechecking, linting should be done before or in parallel of the build command.

## Install

`yarn add --dev @nabla/vite-plugin-eslint`

## Usage

```ts
import { defineConfig } from "vite";
import eslintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig({
  plugins: [eslintPlugin()],
});
```

## Options

### eslintOptions

- Type: `ESLint.Options`
- Default: `{ cache: true }`

### shouldLint

- Type: `(path: string) => boolean`
- Default: `(path) => path.match(/\.[jt]sx?$/)`
