/*
 * Renders public/og.png, public/apple-touch-icon.png and public/favicon.ico.
 *
 * Done with headless Chromium rather than an SVG rasteriser so the social card
 * is set in the real JetBrains Mono the site ships — the same file, loaded from
 * dist/_astro/fonts. A rasteriser would fall back to a system face and the card
 * would not match the page it links to.
 *
 * The two SVG favicons are not generated here. They are the hand-drawn JTF mark
 * and are checked in; this script only produces the raster forms that browsers
 * and social cards ask for by name.
 *
 * Run `pnpm build` first: this reads the built fonts out of dist/.
 *
 *   node scripts/build-images.mjs
 */
import { chromium } from 'playwright';
import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import path from 'node:path';

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));
const fontsDir = path.join(root, 'dist/_astro/fonts');
const publicDir = path.join(root, 'public');

const BG = '#0A0A0A';
const TEXT = '#CCCCCC';
const DIM = '#707070';
const ACCENT = '#52FF9E';

// The build emits one variable JetBrains Mono file and two static IBM Plex Sans
// weights. Plex 300 and 400 are near-identical in size, so picking by size is
// not reliable for those — but the mono face is the only variable one and is
// comfortably the largest, which is all this card needs.
async function fontDataUrls() {
  const files = (await readdir(fontsDir)).filter((f) => f.endsWith('.woff2'));
  if (files.length < 2) throw new Error(`expected ≥2 woff2 in ${fontsDir} — run pnpm build first`);
  const sized = await Promise.all(
    files.map(async (f) => {
      const buf = await readFile(path.join(fontsDir, f));
      return { buf, size: buf.length };
    }),
  );
  sized.sort((a, b) => b.size - a.size);
  const url = (e) => `data:font/woff2;base64,${e.buf.toString('base64')}`;
  return { mono: url(sized[0]), sans: url(sized[sized.length - 1]) };
}

const shell = (fonts, body) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Mono';
    src: url('${fonts.mono}') format('woff2');
    font-weight: 400 700;
  }
  @font-face {
    font-family: 'Sans';
    src: url('${fonts.sans}') format('woff2');
    font-weight: 300;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: 'Sans', sans-serif; -webkit-font-smoothing: antialiased; }
</style>
${body}`;

// A scaled-up restatement of the page: same palette, same wordmark, same
// receding grid. Not a screenshot — at 1200x630 the live layout leaves the
// centred stack stranded in a lot of empty space.
const ogCard = (fonts) =>
  shell(
    fonts,
    `<div style="width:1200px;height:630px;background:${BG};color:${TEXT};position:relative;
                 display:flex;flex-direction:column;align-items:center;justify-content:center;
                 overflow:hidden">
    <div style="position:absolute;bottom:0;left:-50%;width:200%;height:70%;
                background-image:linear-gradient(rgba(82,255,158,0.05) 2px, transparent 2px),
                                 linear-gradient(90deg, rgba(82,255,158,0.05) 2px, transparent 2px);
                background-size:100px 100px;
                transform:perspective(800px) rotateX(55deg);transform-origin:bottom center;
                -webkit-mask-image:linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)"></div>
    <div style="position:absolute;bottom:15%;left:50%;transform:translateX(-50%);
                width:900px;height:3px;filter:blur(14px);
                background:radial-gradient(ellipse, rgba(82,255,158,0.16) 0%, transparent 70%)"></div>
    <div style="position:relative;text-align:center">
      <div style="font-family:'Mono',monospace;font-size:132px;font-weight:400;
                  letter-spacing:-0.02em;line-height:1">josh<span
        style="color:${ACCENT}">.</span>tf</div>
      <div style="margin-top:26px;font-size:27px;color:${DIM};letter-spacing:0.02em">
        Software developer &middot; Melbourne
      </div>
    </div>
  </div>`,
  );

// Matches the checked-in favicon SVGs: the JTF mark, ink on accent so it still
// reads at 32px against either a light or a dark browser chrome. The paths are
// lifted verbatim from public/favicon-dark.svg.
const MARK =
  'M97,16 L193,16 C191.73,19.82 190.57,23.14 188.87,26.71 C188.28,27.96 188.28,27.96 187.67,29.23 C187.27,30.08 186.86,30.94 186.44,31.81 C186.03,32.68 185.61,33.55 185.19,34.45 C182.14,40.86 182.14,40.86 181,42 L132,42 L132,42 L132,127 L85,127 L85,125 C85.91,124.4 86.82,123.8 87.75,123.19 C91.46,120.69 94.33,118.34 95.59,113.92 C96.16,109.85 96.18,105.82 96.21,101.71 C96.22,100.3 96.22,100.3 96.24,98.86 C96.27,95.81 96.29,92.77 96.32,89.73 C96.33,87.85 96.35,85.97 96.37,84.09 C96.44,77.12 96.5,70.15 96.56,63.19 C96.71,47.62 96.85,32.04 97,16 Z M56,16 L92,16 C92.09,27.47 92.16,38.93 92.21,50.4 C92.23,55.72 92.26,61.05 92.3,66.37 C92.35,71.51 92.37,76.65 92.38,81.8 C92.39,83.76 92.4,85.71 92.42,87.67 C92.45,90.42 92.46,93.17 92.45,95.92 C92.47,96.73 92.48,97.53 92.5,98.36 C92.44,105.85 89.7,111.87 84.38,117.19 C77.84,123.41 70,127.14 60.96,127.11 L56.33,127.1 L40.75,127.06 L33.58,127.05 L16,127 L16,98 C18.17,97.97 20.34,97.95 22.57,97.92 C24.69,97.88 26.8,97.84 28.92,97.79 C30.38,97.76 31.84,97.74 33.3,97.73 C35.41,97.71 37.52,97.66 39.63,97.61 C40.9,97.59 42.17,97.57 43.47,97.55 C47.62,96.9 49.78,95.67 53,93 C55.42,89.43 55.28,86.08 55.32,81.84 C55.33,80.78 55.33,80.78 55.35,79.69 C55.38,77.34 55.4,74.99 55.41,72.64 C55.43,71.01 55.45,69.38 55.47,67.75 C55.52,63.46 55.56,59.17 55.6,54.89 C55.65,49.74 55.71,44.59 55.77,39.44 C55.86,31.63 55.93,23.81 56,16 Z M139,47 L180,47 L180,60 L239,60 L239,83 C218.21,83.33 197.42,83.66 176,84 C176.04,97.78 176.04,97.78 176.09,111.55 C176.09,113.27 176.1,114.99 176.1,116.71 C176.1,117.62 176.11,118.52 176.11,119.45 C176.11,121.63 176.06,123.82 176,126 L139,126 C138.91,117.49 138.89,108.98 138.93,100.48 C138.94,97.52 138.94,94.56 138.93,91.59 C138.93,88.15 138.94,84.71 138.95,81.27 C138.96,79.5 138.96,77.73 138.96,75.96 C138.97,71.29 138.98,66.63 138.99,61.96 C139,56.37 139.01,50.77 139.01,45.17 C139.02,42.16 139.01,39.15 139,36.14 Z M198,16 L239,16 L239,42 L186,42 C187.38,38.55 188.79,35.26 190.38,31.92 C190.78,31.08 191.18,30.24 191.6,29.37 C192.1,28.32 192.61,27.27 193.13,26.19 C194.73,22.83 196.34,19.46 198,16 Z';

const icon = (fonts, size) =>
  shell(
    fonts,
    `<div style="width:${size}px;height:${size}px;background:${ACCENT};
                 border-radius:${Math.round(size / 16)}px;display:flex;
                 align-items:center;justify-content:center">
      <svg width="${size * 0.72}" height="${size * 0.72}" viewBox="6 6 243 131">
        <path d="${MARK}" fill="${BG}"/>
      </svg>
    </div>`,
  );

const shot = async (browser, html, width, height) => {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await page.close();
  return buf;
};

// Prefer whatever Chromium Playwright has bundled. Failing that, reuse a build
// already sitting in the shared ms-playwright cache rather than pulling another
// ~170 MB copy down for a script that runs about twice a year. Set
// CHROMIUM_PATH to override either.
async function launch() {
  if (process.env.CHROMIUM_PATH) {
    return chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  }
  try {
    return await chromium.launch();
  } catch (err) {
    const cache = path.join(homedir(), '.cache/ms-playwright');
    const builds = (await readdir(cache).catch(() => []))
      .filter((d) => d.startsWith('chromium-'))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const build of builds) {
      for (const dir of ['chrome-linux64', 'chrome-linux']) {
        const exe = path.join(cache, build, dir, 'chrome');
        if (
          await access(exe).then(
            () => true,
            () => false,
          )
        ) {
          console.log(`using cached chromium: ${build}`);
          return chromium.launch({ executablePath: exe });
        }
      }
    }
    throw err;
  }
}

const fonts = await fontDataUrls();
const browser = await launch();

await writeFile(path.join(publicDir, 'og.png'), await shot(browser, ogCard(fonts), 1200, 630));
await writeFile(
  path.join(publicDir, 'apple-touch-icon.png'),
  await shot(browser, icon(fonts, 180), 180, 180),
);
// favicon.ico, for the browsers and crawlers that still ask for it by name.
// A single PNG wrapped in a 22-byte ICONDIR + ICONDIRENTRY — PNG-in-ICO is
// understood everywhere that matters, and it saves pulling in a converter.
const png32 = await shot(browser, icon(fonts, 32), 32, 32);
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); // reserved
ico.writeUInt16LE(1, 2); // type: icon
ico.writeUInt16LE(1, 4); // one image
ico.writeUInt8(32, 6); // width
ico.writeUInt8(32, 7); // height
ico.writeUInt8(0, 8); // palette size: not paletted
ico.writeUInt8(0, 9); // reserved
ico.writeUInt16LE(1, 10); // colour planes
ico.writeUInt16LE(32, 12); // bits per pixel
ico.writeUInt32LE(png32.length, 14);
ico.writeUInt32LE(22, 18); // offset to the PNG payload
await writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([ico, png32]));

await browser.close();
console.log('wrote og.png, apple-touch-icon.png, favicon.ico');
