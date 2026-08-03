// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://josh.tf',
  output: 'static',
  trailingSlash: 'never',

  // /fxcommands is a separate pre-built static site living in public/, so Astro
  // knows nothing about its routes and cannot enumerate them here. It ships its
  // own sitemap and public/robots.txt points crawlers at both.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],

  // Astro inlines a hoisted <script> straight into the HTML when the bundle is
  // small enough, and the mail decoder is about 300 bytes — comfortably under
  // the default threshold. Inlined, it is blocked outright by the
  // `script-src 'self'` in public/_headers and the contact link never gets its
  // href. Forcing every asset out to a file keeps it a same-origin /_astro
  // request that the CSP allows, which is worth one extra round trip on a page
  // that makes almost none.
  vite: { build: { assetsInlineLimit: 0 } },

  // Self-hosted, latin-subset, metric-matched. The old hand-written page pulled
  // both faces from fonts.googleapis.com, which costs a render-blocking round
  // trip to a third party before any text paints; Astro downloads them at build
  // time and serves them from our own origin instead. `optimizedFallbacks` (on
  // by default) generates a metrics-adjusted local fallback so the swap doesn't
  // shift the layout.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      // Variable axis, but the page only ever sets 400 — the wordmark is the
      // one run of it. The range is declared so a future weight change doesn't
      // need a second file.
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      // 300 is the body default; 400 is the tooltip text. Static family, so
      // each weight is its own file — shipping only the two that are used.
      weights: [300, 400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],
});
