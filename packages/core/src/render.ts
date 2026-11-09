// A profile made into its page: HTML and its CSS, which any server may give
// as they are (`html`, a document whole) or put in a page of its own (`css`
// and `body`). Every address it links to goes through `link`, with the block
// it is in, for the clicks to be counted by block; and the visit is told to
// `view` (what the visitor came from, and the campaign of the address) by a
// beacon, or by a picture without scripts. The blocks of the application's
// own are drawn by what it gives (`custom`), with the cards every block of
// many things is laid out in (`ctx.items`).

import { safeUrl } from './blocks';
import type { Block, BlockOf, Layout, Network, Profile } from './model';
import { NETWORKS } from './model';
import { type Theme, themeCss, themeOf } from './themes';

export type Locale = 'en' | 'es';

/** Where a link is in the page: the block it is in, for its clicks to be counted as that block's. */
export interface LinkPlace {
  block: string;
  type: Block['type'] | 'profile';
  /** Which of the block's: the network, the button, the item. */
  part?: string;
}

/** One of many things a block shows (a picture of a gallery, an item of a custom block), as its card draws it. */
export interface Item {
  title: string;
  image?: string | null;
  /** A second line: where, what it is. */
  subtitle?: string;
  /** What stands out: a price, a date. */
  badge?: string;
  href?: string;
}

/** How a custom block is drawn: its HTML, and whether it has what it needs. */
export interface CustomBlock {
  html(block: BlockOf<'custom'>, ctx: RenderContext): string;
  complete?(block: BlockOf<'custom'>): boolean;
}

export interface RenderOptions {
  locale?: Locale;
  /** What each address goes through: to count its click, by the block it is in. As it is, if not given. */
  link?: (url: string, place: LinkPlace) => string;
  /** Where the visit is told: the beacon's address. None: not told. */
  view?: string;
  /** Where an address that starts with `/` is: `https://example.com`. */
  base?: string;
  /** The country code a phone of ten digits is given for WhatsApp: `52`. As it is, if not given. */
  country?: string;
  /** How to draw the blocks of the application's own, by their kind. */
  custom?: Record<string, CustomBlock>;
  /** The page's own address, for those who share it. */
  canonical?: string;
  /** Whether the page moves as it opens, as the profile's entrance says; true unless said. A link that draws the eye moves anyway. */
  motion?: boolean;
  /** A line at the foot, with its link: "Made with …". */
  footer?: { label: string; url: string };
}

/** What a block is drawn with: its theme, its words, and the ways to its addresses and cards. */
export interface RenderContext {
  theme: Theme;
  locale: Locale;
  /** An address as it goes in the page: whole, and through what counts its clicks. */
  link(url: string, place: LinkPlace): string;
  /** What goes in HTML as text. */
  esc(text: string): string;
  /** Many things as cards, as `layout` sets them, each linking to its address through `link`, as `place` says. */
  items(list: Item[], layout: Layout, place: LinkPlace): string;
}

const WORDS: Record<Locale, { whatsapp: string; call: string; email: string; watch: string; verified: string; photo: string }> = {
  en: { whatsapp: 'WhatsApp', call: 'Call', email: 'Email', watch: 'Watch the video', verified: 'Verified', photo: 'Photo of' },
  es: { whatsapp: 'WhatsApp', call: 'Llamar', email: 'Correo', watch: 'Ver el video', verified: 'Verificado', photo: 'Foto de' },
};
export const NETWORK_NAMES: Record<Network, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
  whatsapp: 'WhatsApp',
  website: 'Web',
};

/** What goes in HTML as text: nothing in it read as a tag or an attribute's end. */
export const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const esc = escapeHtml;

/** Lines of 24, in the colour of the words beside them. */
const svg = (d: string, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const ICONS: Record<Network | 'phone' | 'mail' | 'pin' | 'check' | 'play', string> = {
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6.5h.01',
  facebook: 'M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.6l.4-3h-3V6.8c0-.5.3-.8.8-.8H15z',
  tiktok: 'M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6',
  youtube:
    'M3.5 8a3 3 0 0 1 2.6-2.8C8 5 10 5 12 5s4 0 5.9.2A3 3 0 0 1 20.5 8c.2 1.3.3 2.7.3 4s-.1 2.7-.3 4a3 3 0 0 1-2.6 2.8C16 19 14 19 12 19s-4 0-5.9-.2A3 3 0 0 1 3.5 16c-.2-1.3-.3-2.7-.3-4s.1-2.7.3-4zM10 9.2v5.6l4.8-2.8z',
  linkedin: 'M4 9h3.5v11H4zM5.75 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 9h3.3v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.6 2 3.6 4.6V20H17v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z',
  x: 'M4 4l16 16M20 4L4 20',
  whatsapp: 'M4 20l1.3-4A8 8 0 1 1 8.4 19zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a5 5 0 0 1-2.4-2.4l1-1-1-2z',
  website: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3c-2.5 2.6-3.8 5.6-3.8 9s1.3 6.4 3.8 9',
  phone: 'M5 4h3.5l1.5 4-2 1.2a11 11 0 0 0 6.8 6.8L16 14l4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z',
  mail: 'M3.5 6h17v12h-17zM3.5 6.5l8.5 6.5 8.5-6.5',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  check: 'M12 2.5l2.4 1.8 3-.2.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3-.2L12 21.5l-2.4-1.8-3 .2-.9-2.9-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.9 3 .2zM8.5 12l2.5 2.5 4.5-5',
  play: 'M8 5.5v13l10.5-6.5z',
};

/** A YouTube video's picture, from its address; none for another's. */
export function videoPicture(url: string) {
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** A phone as WhatsApp takes it: its digits, with the country's code when it has ten. */
export const whatsappOf = (phone: string, country?: string) => {
  const digits = phone.replace(/\D/g, '');
  return country && digits.length === 10 ? `${country}${digits}` : digits;
};

/** Words with their line breaks, each line as text. */
const lines = (text: string) => esc(text.trim()).replace(/\n/g, '<br>');

/** Many things as cards, as a layout sets them. */
function items(list: Item[], layout: Layout, place: LinkPlace, ctx: Pick<RenderContext, 'link'>) {
  const card = (it: Item, i: number, kind: string) => {
    const href = it.href && safeUrl(it.href) ? ctx.link(it.href, { ...place, part: `${place.part ?? 'item'}:${i}` }) : '';
    const picture = it.image ? `<img src="${esc(it.image)}" alt="${esc(it.title)}" loading="lazy">` : '<span class="rp-noimage"></span>';
    const words = `<span class="rp-item-words">${it.badge ? `<b class="rp-item-badge">${esc(it.badge)}</b>` : ''}<span class="rp-item-title">${esc(it.title)}</span>${it.subtitle ? `<span class="rp-item-sub">${esc(it.subtitle)}</span>` : ''}</span>`;
    const inner = kind === 'grid3' ? `${picture}${it.badge ? `<b class="rp-item-over">${esc(it.badge)}</b>` : ''}` : `<span class="rp-item-picture">${picture}</span>${words}`;
    return href ? `<a class="rp-item" href="${esc(href)}" data-rp="${esc(place.block)}">${inner}</a>` : `<div class="rp-item">${inner}</div>`;
  };
  return list.length ? `<div class="rp-items rp-${layout}">${list.map((it, i) => card(it, i, layout)).join('')}</div>` : '';
}

/** A block as it goes in the page. */
function blockHtml(b: Block, ctx: RenderContext, options: RenderOptions): string {
  const w = WORDS[ctx.locale];
  const at = (part?: string): LinkPlace => ({ block: b.id, type: b.type, part });
  const a = (url: string, place: LinkPlace, cls: string, inner: string, label?: string) =>
    `<a class="${cls}" href="${esc(ctx.link(url, place))}" data-rp="${esc(b.id)}"${/^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : ''}${label ? ` aria-label="${esc(label)}"` : ''}>${inner}</a>`;
  switch (b.type) {
    case 'link':
      return b.label.trim() && safeUrl(b.url)
        ? a(
            b.url,
            at(),
            b.highlight && b.highlight !== 'none' ? `rp-link rp-hl-${b.highlight}` : 'rp-link',
            `${b.icon ? `<span class="rp-link-icon">${esc(b.icon)}</span>` : ''}<span class="rp-link-words"><span>${esc(b.label)}</span>${b.note ? `<small>${esc(b.note)}</small>` : ''}</span>`,
          )
        : '';
    case 'contact': {
      const buttons = [
        b.whatsapp.trim() &&
          a(
            `https://wa.me/${whatsappOf(b.whatsapp, options.country)}${b.message ? `?text=${encodeURIComponent(b.message)}` : ''}`,
            at('whatsapp'),
            'rp-contact-button',
            `${svg(ICONS.whatsapp)}<span>${w.whatsapp}</span>`,
          ),
        b.phone.trim() && a(`tel:${b.phone.replace(/[^\d+]/g, '')}`, at('phone'), 'rp-contact-button', `${svg(ICONS.phone)}<span>${w.call}</span>`),
        b.email.trim() && a(`mailto:${b.email.trim()}`, at('email'), 'rp-contact-button', `${svg(ICONS.mail)}<span>${w.email}</span>`),
      ].filter(Boolean);
      return buttons.length ? `<div class="rp-contact">${buttons.join('')}</div>` : '';
    }
    case 'socials': {
      const given = NETWORKS.filter((n) => b.links[n] && safeUrl(b.links[n]!));
      return given.length ? `<div class="rp-socials">${given.map((n) => a(b.links[n]!, at(n), 'rp-social', svg(ICONS[n]), NETWORK_NAMES[n])).join('')}</div>` : '';
    }
    case 'heading':
      return b.text.trim() ? `<h2 class="rp-heading">${esc(b.text)}</h2>` : '';
    case 'text':
      return b.text.trim() ? `<p class="rp-text">${lines(b.text)}</p>` : '';
    case 'image': {
      if (!b.src) return '';
      const img = `<img class="rp-image" src="${esc(b.src)}" alt="${esc(b.alt)}" loading="lazy">`;
      return b.href && safeUrl(b.href) ? a(b.href, at(), 'rp-image-link', img) : img;
    }
    case 'gallery':
      return ctx.items(
        b.pictures.filter((p) => p.src).map((p) => ({ title: p.alt, image: p.src, href: p.href || undefined })),
        b.layout,
        at('picture'),
      );
    case 'video': {
      if (!safeUrl(b.url)) return '';
      const picture = videoPicture(b.url);
      return a(
        b.url,
        at(),
        'rp-video',
        `<span class="rp-video-picture">${picture ? `<img src="${esc(picture)}" alt="" loading="lazy">` : ''}<span class="rp-play">${svg(ICONS.play, 28)}</span></span><span class="rp-video-title">${esc(b.title || w.watch)}</span>`,
      );
    }
    case 'divider':
      return '<hr class="rp-divider">';
    case 'custom':
      return options.custom?.[b.kind]?.html(b, ctx) ?? '';
  }
}

/** The page's style: its theme's colours as custom properties, the rest by them. */
export const PROFILE_CSS = `
.rp{min-height:100vh;background:var(--rp-bg);color:var(--rp-text);font:16px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
.rp *{box-sizing:border-box}
.rp a{color:inherit;text-decoration:none}
.rp-page{max-width:480px;margin:0 auto;padding:48px 16px 40px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.rp-photo{width:112px;height:112px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:var(--rp-button);color:var(--rp-button-text);font-size:40px;font-weight:800;box-shadow:0 0 0 4px rgba(255,255,255,.7),0 10px 30px rgba(0,0,0,.15)}
.rp-photo img{width:100%;height:100%;object-fit:cover}
.rp-name{margin:6px 0 0;font-size:26px;font-weight:800;line-height:1.2;letter-spacing:-.01em;display:flex;align-items:center;justify-content:center;gap:6px}
.rp-badge{color:var(--rp-accent);display:inline-flex}
.rp-headline{margin:0;color:var(--rp-muted);font-size:15px}
.rp-location{margin:0;color:var(--rp-muted);font-size:14px;display:flex;align-items:center;justify-content:center;gap:4px}
.rp-bio{margin:4px 0 6px;font-size:15px;line-height:1.6;opacity:.92}
.rp-link{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;border-radius:18px;background:var(--rp-button);color:var(--rp-button-text)!important;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.08);transition:transform .15s,box-shadow .15s}
.rp-link:hover,.rp-contact-button:hover,.rp-social:hover,.rp-item:hover,.rp-video:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.14)}
.rp-link-icon{font-size:20px;line-height:1}
.rp-link-words{flex:1;display:flex;flex-direction:column;align-items:center}
.rp-link-icon+.rp-link-words{margin-right:32px}
.rp-link small{font-weight:500;font-size:13px;opacity:.8}
.rp-contact{display:flex;gap:8px;width:100%}
.rp-contact-button{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:18px;background:var(--rp-card);color:var(--rp-card-text)!important;font-size:13px;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.08);backdrop-filter:blur(6px);transition:transform .15s,box-shadow .15s}
.rp-socials{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.rp-social{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--rp-card);color:var(--rp-card-text)!important;box-shadow:0 1px 3px rgba(0,0,0,.08);backdrop-filter:blur(6px);transition:transform .15s,box-shadow .15s}
.rp-heading{margin:14px 0 0;width:100%;font-size:18px;font-weight:800;text-align:left}
.rp-text{margin:0;width:100%;font-size:15px;line-height:1.6;text-align:left}
.rp-image,.rp-image-link{display:block;width:100%;border-radius:18px;overflow:hidden}
.rp-image{height:auto}
.rp-divider{width:100%;border:0;border-top:1px solid currentColor;opacity:.15;margin:6px 0}
.rp-video{display:block;width:100%;border-radius:18px;overflow:hidden;background:var(--rp-card);color:var(--rp-card-text)!important;text-align:left;transition:transform .15s,box-shadow .15s}
.rp-video-picture{position:relative;display:block;aspect-ratio:16/9;background:#000}
.rp-video-picture img{width:100%;height:100%;object-fit:cover;opacity:.85}
.rp-play{position:absolute;inset:0;margin:auto;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.55);color:#fff}
.rp-video-title{display:block;padding:10px 14px;font-weight:700;font-size:14px}
.rp-items{width:100%;text-align:left}
.rp-item{display:flex;flex-direction:column;overflow:hidden;border-radius:16px;background:#fff;color:#18181b!important;box-shadow:0 1px 3px rgba(0,0,0,.08);transition:transform .15s,box-shadow .15s}
.rp-item img,.rp-noimage{display:block;width:100%;height:100%;object-fit:cover;background:#e4e4e7}
.rp-item-picture{display:block;aspect-ratio:4/3;overflow:hidden}
.rp-item-words{display:flex;flex-direction:column;gap:2px;padding:10px 12px}
.rp-item-badge{font-size:16px}
.rp-item-title{font-size:14px;font-weight:600;line-height:1.3}
.rp-item-sub{font-size:12px;color:#71717a}
.rp-cards{display:grid;gap:14px}
.rp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rp-grid2 .rp-item-title{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;border-radius:14px;overflow:hidden}
.rp-grid3 .rp-item{position:relative;aspect-ratio:1;border-radius:0;box-shadow:none}
.rp-item-over{position:absolute;left:0;right:0;bottom:0;padding:14px 6px 4px;background:linear-gradient(to top,rgba(0,0,0,.7),transparent);color:#fff;font-size:11px}
.rp-list{display:flex;flex-direction:column;gap:8px}
.rp-list .rp-item{flex-direction:row;align-items:center;padding:8px}
.rp-list .rp-item-picture{width:72px;height:72px;flex:none;aspect-ratio:1;border-radius:12px}
.rp-carousel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:6px;margin:0 -16px;padding-left:16px;padding-right:16px}
.rp-carousel .rp-item{flex:none;width:78%;scroll-snap-align:start}
.rp-footer{margin-top:20px;font-size:13px;color:var(--rp-muted)}
.rp-footer a:hover{text-decoration:underline}
@keyframes rp-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes rp-fade{from{opacity:0}to{opacity:1}}
@keyframes rp-zoom{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
.rp[data-entrance=rise] .rp-page>*{animation:rp-rise .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--rp-i,0)*70ms)}
.rp[data-entrance=fade] .rp-page>*{animation:rp-fade .7s ease both;animation-delay:calc(var(--rp-i,0)*70ms)}
.rp[data-entrance=zoom] .rp-page>*{animation:rp-zoom .5s cubic-bezier(.2,.8,.2,1.2) both;animation-delay:calc(var(--rp-i,0)*70ms)}
${Array.from({ length: 24 }, (_, i) => `.rp-page>:nth-child(${i + 1}){--rp-i:${i}}`).join('')}.rp-page>:nth-child(n+25){--rp-i:24}
@keyframes rp-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@keyframes rp-shake{0%,84%,100%{transform:rotate(0)}86%{transform:rotate(-2.5deg)}89%{transform:rotate(2.5deg)}92%{transform:rotate(-2deg)}95%{transform:rotate(1.5deg)}98%{transform:rotate(-.5deg)}}
@keyframes rp-bounce{0%,70%,100%{transform:translateY(0)}78%{transform:translateY(-7px)}86%{transform:translateY(0)}92%{transform:translateY(-3px)}}
@keyframes rp-shine{0%,60%{left:-60%}100%{left:130%}}
.rp-hl-pulse{animation:rp-pulse 1.8s ease-in-out infinite}
.rp-hl-shake{animation:rp-shake 3s ease-in-out infinite}
.rp-hl-bounce{animation:rp-bounce 2.6s ease-in-out infinite}
.rp-hl-shine{position:relative;overflow:hidden}
.rp-hl-shine::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:45%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);animation:rp-shine 3.2s ease-in-out infinite;pointer-events:none}
${(
  [
    ['rise', 'rp-rise .55s cubic-bezier(.2,.8,.2,1) both'],
    ['fade', 'rp-fade .7s ease both'],
    ['zoom', 'rp-zoom .5s cubic-bezier(.2,.8,.2,1.2) both'],
  ] as const
)
  .flatMap(([entrance, enter]) =>
    (
      [
        ['pulse', 'rp-pulse 1.8s ease-in-out infinite'],
        ['shake', 'rp-shake 3s ease-in-out infinite'],
        ['bounce', 'rp-bounce 2.6s ease-in-out infinite'],
      ] as const
    ).map(
      // A link that draws the eye comes in as the rest, then starts.
      ([highlight, move]) => `.rp[data-entrance=${entrance}] .rp-page>.rp-hl-${highlight}{animation:${enter},${move};animation-delay:calc(var(--rp-i,0)*70ms),calc(var(--rp-i,0)*70ms + .7s)}`,
    ),
  )
  .join('')}
@media (prefers-reduced-motion:reduce){.rp *,.rp *::after{transition:none!important;animation:none!important}}
`
  .trim()
  .replace(/\n/g, '');

/** A profile made into its page. */
export function renderProfile(profile: Profile, options: RenderOptions = {}) {
  const locale = options.locale ?? 'en';
  const w = WORDS[locale];
  const theme = themeOf(profile.theme, profile.accent);
  const base = options.base?.replace(/\/$/, '') ?? '';
  const whole = (url: string) => (url.startsWith('/') && !url.startsWith('//') ? `${base}${url}` : url);
  const ctx: RenderContext = {
    theme,
    locale,
    esc,
    link: (url, place) => (options.link ? options.link(whole(url.trim()), place) : whole(url.trim())),
    items: (list, layout, place) => items(list, layout, place, ctx),
  };
  const initial = esc(profile.name.trim()[0] ?? '·');
  const head = `<div class="rp-photo">${profile.photo ? `<img src="${esc(profile.photo)}" alt="${esc(`${w.photo} ${profile.name}`)}">` : initial}</div>
<h1 class="rp-name">${esc(profile.name)}${profile.badge ? `<span class="rp-badge" title="${esc(profile.badge)}" aria-label="${esc(`${w.verified}: ${profile.badge}`)}">${svg(ICONS.check, 22)}</span>` : ''}</h1>
${profile.headline ? `<p class="rp-headline">${esc(profile.headline)}</p>` : ''}${profile.location ? `<p class="rp-location">${svg(ICONS.pin, 14)}${esc(profile.location)}</p>` : ''}${profile.bio ? `<p class="rp-bio">${lines(profile.bio)}</p>` : ''}`;
  const blocks = profile.blocks.map((b) => blockHtml(b, ctx, options)).filter(Boolean);
  const footer = options.footer ? `<p class="rp-footer"><a href="${esc(options.footer.url)}" target="_blank" rel="noopener">${esc(options.footer.label)}</a></p>` : '';
  // The visit, told once the page is there: where the visitor came from, the campaign of the address and the QR code it was scanned from, which a picture cannot say.
  const beacon = options.view
    ? `<script>(function(){var u=${JSON.stringify(options.view)},q=new URLSearchParams(location.search),d=new URLSearchParams();d.set("r",document.referrer);["utm_source","utm_medium","utm_campaign","qr"].forEach(function(k){q.get(k)&&d.set(k,q.get(k))});d.set("w",String(screen.width));if(navigator.sendBeacon)navigator.sendBeacon(u,d);else fetch(u,{method:"POST",body:d,keepalive:true})})()</script><noscript><img src="${esc(options.view)}" width="1" height="1" alt="" style="position:absolute"></noscript>`
    : '';
  const entrance = options.motion === false ? 'none' : profile.entrance;
  const body = `<div class="rp" data-entrance="${entrance}" style="${esc(themeCss(theme))}"><main class="rp-page">${head}${blocks.join('\n')}${footer}</main></div>${beacon}`;
  const title = profile.headline ? `${profile.name} · ${profile.headline}` : profile.name;
  const description = (profile.bio || profile.headline).replace(/\s+/g, ' ').trim().slice(0, 200);
  const shared = profile.photo && /^https?:/i.test(profile.photo) ? profile.photo : null;
  const html = `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>${description ? `<meta name="description" content="${esc(description)}">` : ''}
<meta property="og:title" content="${esc(profile.name)}">${description ? `<meta property="og:description" content="${esc(description)}">` : ''}${shared ? `<meta property="og:image" content="${esc(shared)}">` : ''}${options.canonical ? `<link rel="canonical" href="${esc(options.canonical)}">` : ''}
<meta name="theme-color" content="${esc(theme.dark ? '#0f0f10' : '#ffffff')}"><style>body{margin:0}${PROFILE_CSS}</style></head>
<body>${body}</body></html>`;
  return { title, description, css: PROFILE_CSS, body, html };
}
