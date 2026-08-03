import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    // public/fxcommands is a pre-built static site vendored in whole — its
    // bundled JS is generated output and not ours to lint.
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.wrangler/**', 'public/fxcommands/**'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    // Build tooling runs in Node, not the browser. The page-rendering helpers in
    // scripts/build-images.mjs also contain callbacks that Playwright evaluates
    // inside the browser, so both global sets are legitimately in scope here.
    files: ['scripts/**/*.mjs', '*.config.mjs', '*.config.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
