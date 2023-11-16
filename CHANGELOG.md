# Changelog

## 1.6.0

- Add vite@5 to peer dependency range
- Fix error when using `errorOnUnmatchedPattern: false`
- Update plugin name from `eslint` to `vite-plugin-eslint` to avoid confusion in case of errors reported by Vite

## 1.5.0

- Support async formatters ([#17](https://github.com/nabla/vite-plugin-eslint/pull/17))
- Add `.svelte` to default shouldLint regex

## 1.4.2

Add vite@4 to peer dependency range

## 1.4.1

Add vite@3 to peer dependency range

## 1.4.0

- Update default shouldLint option to include `.vue`, `.mjs` & `.mts` files by default
- Add debug log when a file is ignored by shouldLint ([#7](https://github.com/nabla/vite-plugin-eslint/issues/7))

## 1.3.5

Pin chalk to v4 ([#5](https://github.com/nabla/vite-plugin-eslint/issues/5))

## 1.3.4

Enable fix option ([#3](https://github.com/nabla/vite-plugin-eslint/issues/3))

## 1.3.2

Handle file not found error

## 1.3.1

Move ESLint to a worker to improve performances
