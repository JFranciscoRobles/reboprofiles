// What becomes of a profile: each visit and each click, as the server tells
// them (`@reboprofiles/server`), and what they come to over some days: how
// many came and how many of them were someone new that day, how many touched
// something and what, by day, where they came from, on what, from where, and
// by which campaign. Nothing here keeps them: the application keeps the
// events, and gives them back to be counted.

import type { Block, Profile } from './model';
import { type Locale, NETWORK_NAMES } from './render';

export type Device = 'mobile' | 'tablet' | 'desktop';

/** A visit, or a click on something of the page. */
export interface ProfileEvent {
  type: 'view' | 'click';
  /** When: a date, or as ISO says it. */
  at: Date | string;
  /** Who, without knowing who: the same through a day, another the next (`visitorOf` in the server). */
  visitor: string;
  /** Of a click: the block, which of its parts, and where it went. */
  block?: string;
  part?: string;
  url?: string;
  /** Where they came from, as `sourceOf` names it: instagram, google, direct… */
  source?: string;
  /** The campaign of the address they came by: its `utm_campaign`. */
  campaign?: string;
  /** Of a visit by a QR code: the piece it was scanned from (`poster`, `cards`, `stickers`, `file`); its source is `qr`. */
  qr?: string;
  device?: Device;
  /** Two letters: MX, US. */
  country?: string;
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)(instagram\.com|l\.instagram\.com)$/, 'instagram'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|l\.facebook\.com|m\.facebook\.com)$/, 'facebook'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, 'x'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'whatsapp'],
  [/(^|\.)google\.[a-z.]+$/, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
];

/** Where a visit came from: the campaign's source if the address says one; else the site it came from, by its name; else `direct`. */
export function sourceOf(referrer: string | null | undefined, utmSource?: string | null): string {
  if (utmSource?.trim()) return utmSource.trim().toLowerCase().slice(0, 40);
  if (!referrer) return 'direct';
  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
  return SOURCES.find(([pattern]) => pattern.test(host))?.[1] ?? host.slice(0, 60);
}

/** What a visit came on, by what its browser says, or by how wide its screen is. */
export function deviceOf(userAgent: string | null | undefined, width?: number): Device {
  const ua = userAgent ?? '';
  if (/iPad|Tablet|Nexus (7|9|10)|SM-T|Kindle|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|iPhone|Android|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
  if (width && width < 768) return 'mobile';
  if (width && width < 1100 && /Macintosh/.test(ua) && 'ontouchend' in globalThis) return 'tablet';
  return 'desktop';
}

const PARTS: Record<Locale, Record<string, string>> = {
  en: { whatsapp: 'WhatsApp', phone: 'Phone', email: 'Email', contact: 'Contact', socials: 'Networks', image: 'Image', video: 'Video', gallery: 'Gallery' },
  es: { whatsapp: 'WhatsApp', phone: 'Teléfono', email: 'Correo', contact: 'Contacto', socials: 'Redes', image: 'Imagen', video: 'Video', gallery: 'Galería' },
};

/** What something of a page is called, to say what was touched: the link's words, the network, the button. */
export function labelOf(blocks: Block[], block: string | undefined, part?: string, locale: Locale = 'en'): string {
  const w = PARTS[locale];
  const b = blocks.find((x) => x.id === block);
  if (!b) return part ?? block ?? '—';
  switch (b.type) {
    case 'link':
      return b.label || b.url;
    case 'contact':
      return w[part ?? ''] ?? w.contact;
    case 'socials':
      return part && part in NETWORK_NAMES ? NETWORK_NAMES[part as keyof typeof NETWORK_NAMES] : w.socials;
    case 'image':
      return b.alt || w.image;
    case 'video':
      return b.title || w.video;
    case 'gallery':
      return w.gallery;
    case 'custom':
      return b.kind;
    default:
      return b.type;
  }
}

export interface Count {
  key: string;
  count: number;
}

export interface Summary {
  /** The days counted, as `YYYY-MM-DD` in the time zone given. */
  from: string;
  to: string;
  views: number;
  /** Someone each day: the same person two days counts twice, as the visitor is another each day. */
  visitors: number;
  clicks: number;
  /** Of the visits, how many clicked something: 0 to 1. */
  clickRate: number;
  days: { day: string; views: number; visitors: number; clicks: number; scans: number }[];
  /** The visits that came by the page's QR code. */
  scans: number;
  /** Those, by the piece scanned: a poster, cards, stickers, a file. */
  scanned: Count[];
  /** What was touched, the most first: the block, its part, what it is called, its clicks, and of the visits how many touched it. */
  touched: { block: string; part?: string; label: string; clicks: number; rate: number }[];
  sources: Count[];
  devices: Count[];
  countries: Count[];
  campaigns: Count[];
}

const dayOf = (at: Date | string, timeZone: string) => new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(at));

const counted = (values: (string | undefined)[]): Count[] => {
  const m = new Map<string, number>();
  for (const v of values) if (v) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
};

/**
 * What the events come to from `from` to `to` (days as `YYYY-MM-DD`, both counted; the last thirty if left out), each
 * day as `timeZone` has it (UTC unless said). `profile` names what was touched, in `locale`.
 */
export function summarize(events: ProfileEvent[], options: { from?: string; to?: string; timeZone?: string; profile?: Pick<Profile, 'blocks'>; locale?: Locale } = {}): Summary {
  const timeZone = options.timeZone ?? 'UTC';
  const to = options.to ?? dayOf(new Date(), timeZone);
  const from = options.from ?? dayOf(new Date(Date.parse(`${to}T12:00:00Z`) - 29 * 86_400_000), timeZone);
  const inside = events.map((e) => ({ ...e, day: dayOf(e.at, timeZone) })).filter((e) => e.day >= from && e.day <= to);
  const views = inside.filter((e) => e.type === 'view');
  const clicks = inside.filter((e) => e.type === 'click');
  /** Each visitor once a day. */
  const people = (list: typeof inside) => new Set(list.map((e) => `${e.day}|${e.visitor}`)).size;

  const days: Summary['days'] = [];
  for (let t = Date.parse(`${from}T12:00:00Z`); dayOf(new Date(t), 'UTC') <= to; t += 86_400_000) {
    const day = dayOf(new Date(t), 'UTC');
    const v = views.filter((e) => e.day === day);
    days.push({ day, views: v.length, visitors: people(v), clicks: clicks.filter((e) => e.day === day).length, scans: v.filter((e) => e.qr).length });
  }

  const byPlace = new Map<string, { block: string; part?: string; clickers: Set<string>; clicks: number }>();
  for (const c of clicks) {
    const key = `${c.block}|${c.part ?? ''}`;
    const had = byPlace.get(key) ?? { block: c.block ?? '', part: c.part, clickers: new Set(), clicks: 0 };
    had.clicks++;
    had.clickers.add(`${c.day}|${c.visitor}`);
    byPlace.set(key, had);
  }
  const visitors = people(views);
  const rate = (n: number) => (visitors ? Math.min(1, n / visitors) : 0);
  const blocks = options.profile?.blocks ?? [];

  return {
    from,
    to,
    views: views.length,
    visitors,
    clicks: clicks.length,
    clickRate: rate(people(clicks)),
    days,
    touched: [...byPlace.values()]
      .map((p) => ({ block: p.block, part: p.part, label: labelOf(blocks, p.block, p.part, options.locale), clicks: p.clicks, rate: rate(p.clickers.size) }))
      .sort((a, b) => b.clicks - a.clicks),
    scans: views.filter((e) => e.qr).length,
    scanned: counted(views.map((e) => e.qr)),
    sources: counted(views.map((e) => (e.qr ? 'qr' : (e.source ?? 'direct')))),
    devices: counted(views.map((e) => e.device)),
    countries: counted(views.map((e) => e.country)),
    campaigns: counted(views.map((e) => e.campaign)),
  };
}
