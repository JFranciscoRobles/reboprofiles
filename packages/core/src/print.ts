// The page's QR code on paper, for people to scan it where they are: a
// poster (a letter page: who they are, the code large, the address under it),
// cards (ten a letter page, the size of a business card, with lines to cut
// them by) and stickers (six squares a page). Each a document whole, ready
// for the browser's printing, in the profile's colours.

import type { Profile } from './model';
import { qrSvg, qrUrl } from './qr';
import { escapeHtml as esc, type Locale } from './render';
import { themeOf } from './themes';

export type PrintFormat = 'poster' | 'cards' | 'stickers';
export const PRINT_FORMATS: readonly PrintFormat[] = ['poster', 'cards', 'stickers'];

const WORDS: Record<Locale, { scan: string; title: string }> = {
  en: { scan: 'Scan me', title: 'To print' },
  es: { scan: 'Escanéame', title: 'Para imprimir' },
};

/** An address as it reads on paper: without its `https://` and its last slash. */
export const shortUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** A sheet of the page's QR code, `url` its address, in a format, ready to print. */
export function renderQrSheet(profile: Profile, url: string, options: { format?: PrintFormat; locale?: Locale } = {}) {
  const format = options.format ?? 'poster';
  const w = WORDS[options.locale ?? 'en'];
  const theme = themeOf(profile.theme, profile.accent);
  // The code always dark on white: a reader sees it best so, whatever the theme. It says the piece it is on, for its scans to be counted by it.
  const code = qrSvg(qrUrl(url, format), { correction: 'Q', margin: 2, title: `${w.scan}: ${url}` });
  const accent = theme.id === 'accent' ? profile.accent : theme.button.startsWith('linear-gradient') ? theme.accent : theme.button;
  const ink = /^#[0-9a-f]{6}$/i.test(accent) ? accent : '#18181b';
  const photo = profile.photo ? `<img class="photo" src="${esc(profile.photo)}" alt="">` : `<span class="photo initial">${esc(profile.name.trim()[0] ?? '·')}</span>`;
  const name = esc(profile.name);
  const headline = profile.headline ? `<p class="headline">${esc(profile.headline)}</p>` : '';
  const address = `<p class="url">${esc(shortUrl(url))}</p>`;

  const bodies: Record<PrintFormat, string> = {
    poster: `<main class="poster"><p class="scan">${w.scan}</p>${photo}<h1>${name}</h1>${headline}<div class="code">${code}</div>${address}</main>`,
    cards: `<main class="sheet cards">${Array.from({ length: 10 }, () => `<section class="card"><div class="code">${code}</div><div class="words"><b>${name}</b>${headline}${address}</div></section>`).join('')}</main>`,
    stickers: `<main class="sheet stickers">${Array.from({ length: 6 }, () => `<section class="sticker"><div class="code">${code}</div><b>${name}</b><span>${w.scan}</span></section>`).join('')}</main>`,
  };
  const css = `
@page{size:letter;margin:${format === 'poster' ? '0.6in' : '0.5in 0.75in'}}
*{box-sizing:border-box}
body{margin:0;color:#18181b;font:14px/1.4 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p,h1{margin:0}
.code svg{display:block;width:100%;height:auto}
.url{color:#52525b;font-family:ui-monospace,Menlo,Consolas,monospace;word-break:break-all}
.headline{color:#52525b}
.photo{display:grid;place-items:center;width:1.3in;height:1.3in;border-radius:50%;object-fit:cover;background:${ink};color:#fff;font-size:48px;font-weight:800}
.poster{display:flex;flex-direction:column;align-items:center;gap:14px;min-height:9.6in;padding-top:.3in;text-align:center}
.poster .scan{padding:8px 22px;border-radius:999px;background:${ink};color:#fff;font-size:22px;font-weight:800;letter-spacing:.02em}
.poster h1{font-size:40px;font-weight:800;letter-spacing:-.01em}
.poster .headline{font-size:20px}
.poster .code{width:4.6in;margin-top:10px;padding:14px;border:3px solid ${ink};border-radius:24px}
.poster .url{font-size:18px}
.sheet{display:grid}
.cards{grid-template-columns:repeat(2,3.5in);grid-auto-rows:2in;justify-content:center}
.card{display:flex;align-items:center;gap:.16in;padding:.16in;border:1px dashed #c6c6c6}
.card .code{width:1.55in;flex:none}
.card .words{display:flex;flex-direction:column;gap:3px;min-width:0}
.card b{font-size:15px}
.card .headline,.card .url{font-size:10px}
.card .words::before{content:"";display:block;width:28px;height:4px;margin-bottom:4px;border-radius:2px;background:${ink}}
.stickers{grid-template-columns:repeat(2,3in);grid-auto-rows:3in;justify-content:center;gap:.25in .5in}
.sticker{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:1px dashed #c6c6c6;border-radius:.3in;text-align:center}
.sticker .code{width:2.1in}
.sticker b{font-size:14px}
.sticker span{color:${ink};font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:.06em}
@media screen{body{background:#e9e9e9;padding:24px}main{max-width:8.5in;margin:0 auto;padding:.5in;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.15)}}`
    .trim()
    .replace(/\n/g, '');
  const title = `${w.title} · ${profile.name}`;
  return `<!doctype html>
<html lang="${options.locale ?? 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${css}</style></head>
<body>${bodies[format]}</body></html>`;
}
