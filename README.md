# website

The personal site at [josh.tf](https://josh.tf).

A one-page static site built with Astro and served from Cloudflare's edge as an assets-only Worker, with no server-side script. Fonts are self-hosted and downloaded at build time, and `public/_headers` sets a strict Content Security Policy and cache headers. The [FXCommands](https://josh.tf/fxcommands) landing site lives under `public/fxcommands/` as a pre-built bundle from the `fxcommands-landing` repo, with its own looser CSP override.

## Stack

- Astro (static output) with `@astrojs/sitemap`
- JetBrains Mono and IBM Plex Sans via the Astro Fonts API (Fontsource)
- Cloudflare Workers Static Assets, configured in `wrangler.jsonc`
- Playwright, used only by `scripts/build-images.mjs` to render the social card and raster icons
- ESLint, Prettier and cspell for checks

## Develop

Requires Node 22.12 or later and pnpm.

```sh
pnpm install
pnpm dev                 # local dev server
pnpm check               # lint, astro check, format check, spell check, build
pnpm images              # rebuild og.png, apple-touch-icon.png and favicon.ico
```

## Deploy

`pnpm run deploy` builds the site and runs `wrangler deploy`, which publishes `dist/` to the `josh.tf/*` route. It needs Wrangler authenticated against the Cloudflare account that owns the `josh.tf` zone. There is no CI deploy.

To update `/fxcommands`, rebuild it from the `fxcommands-landing` repo and commit the output into `public/fxcommands/`, then deploy this site.

## License

The code is [MIT](LICENSE). The written content and images are not covered by that licence and may not be reused without permission.
