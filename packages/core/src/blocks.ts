// The blocks of a profile: each made new, as it starts; a profile read from
// what was given (kept anywhere, sent by anyone), only what each block has
// and as long as it may be; the addresses that may be followed from it; its
// own address made of words; and what is done to its list as it is written,
// each giving a new list (nothing is changed in place).

import {
  type Block,
  type BlockOf,
  type BlockType,
  BLOCK_TYPES,
  type CustomData,
  DEFAULT_ACCENT,
  ENTRANCES,
  HIGHLIGHTS,
  type Json,
  type Layout,
  LAYOUTS,
  NETWORKS,
  type Profile,
  THEME_IDS,
} from './model';

export const newId = () => Math.random().toString(36).slice(2, 10);

/** A block of `type` as it starts: empty, for whoever writes it. A custom one says its kind and its data. */
export function makeBlock<T extends BlockType>(type: T, custom?: { kind: string; data?: CustomData; layout?: Layout }): BlockOf<T> {
  const id = newId();
  const made: Record<BlockType, () => Block> = {
    link: () => ({ id, type: 'link', label: '', url: '', note: '', icon: '', highlight: 'none' }),
    contact: () => ({ id, type: 'contact', whatsapp: '', phone: '', email: '', message: '' }),
    socials: () => ({ id, type: 'socials', links: {} }),
    heading: () => ({ id, type: 'heading', text: '' }),
    text: () => ({ id, type: 'text', text: '' }),
    image: () => ({ id, type: 'image', src: '', alt: '', href: '' }),
    gallery: () => ({ id, type: 'gallery', pictures: [], layout: 'grid3' }),
    video: () => ({ id, type: 'video', url: '', title: '' }),
    divider: () => ({ id, type: 'divider' }),
    custom: () => ({ id, type: 'custom', kind: custom?.kind ?? '', data: custom?.data ?? {}, layout: custom?.layout ?? 'cards' }),
  };
  return made[type]() as BlockOf<T>;
}

/** A profile with nothing in it yet, in the theme of its accent. */
export const blankProfile = (given: Partial<Omit<Profile, 'blocks'>> = {}): Profile => ({
  name: '',
  headline: '',
  bio: '',
  photo: null,
  location: '',
  badge: '',
  theme: 'accent',
  accent: DEFAULT_ACCENT,
  entrance: 'rise',
  ...given,
  blocks: [],
});

// ——— Addresses ———

/** Only these may be followed from a page: the web, a mail, a phone, and the page's own (`/…`). */
export const safeUrl = (url: string) => /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s().-]+|\/(?!\/)[^\s]*)$/i.test(url.trim());

/** A page's address made of words: lowercase, without accents, joined by dashes, forty at most. */
export const slugOf = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

// ——— Reading what was given ———

const text = (v: unknown, most = 2000) => (typeof v === 'string' ? v.slice(0, most) : '');
const url = (v: unknown) => text(v, 2000).trim();
const color = (v: unknown) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null);
const oneOf = <T>(v: unknown, of: readonly T[], otherwise: T): T => (of.includes(v as T) ? (v as T) : otherwise);
const object = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/** What JSON says, no deeper than eight and no longer than it may be: the data of a custom block. */
function json(v: unknown, depth = 0): Json {
  if (depth > 8) return null;
  if (v === null || typeof v === 'boolean') return v;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') return v.slice(0, 20_000);
  if (Array.isArray(v)) return v.slice(0, 200).map((x) => json(x, depth + 1));
  if (typeof v === 'object')
    return Object.fromEntries(
      Object.entries(v)
        .slice(0, 100)
        .map(([k, x]) => [k.slice(0, 100), json(x, depth + 1)]),
    );
  return null;
}

const KNOWN = new Set<string>(BLOCK_TYPES);

/** Blocks as they were given, only what each type has and as long as it may be; what is not a block is left out. */
export function readBlocks(given: unknown): Block[] {
  if (!Array.isArray(given)) return [];
  return given.slice(0, 100).flatMap((raw): Block[] => {
    const b = object(raw);
    const type = b.type as BlockType;
    if (!KNOWN.has(type)) return [];
    const id = text(b.id, 40) || newId();
    switch (type) {
      case 'link':
        return [{ id, type, label: text(b.label, 80), url: url(b.url), note: text(b.note, 120), icon: text(b.icon, 8), highlight: oneOf(b.highlight, HIGHLIGHTS, 'none') }];
      case 'contact':
        return [{ id, type, whatsapp: text(b.whatsapp, 24), phone: text(b.phone, 24), email: text(b.email, 200), message: text(b.message, 300) }];
      case 'socials': {
        const links = object(b.links);
        return [{ id, type, links: Object.fromEntries(NETWORKS.map((n) => [n, url(links[n])]).filter(([, v]) => v)) }];
      }
      case 'heading':
        return [{ id, type, text: text(b.text, 120) }];
      case 'text':
        return [{ id, type, text: text(b.text, 2000) }];
      case 'image':
        return [{ id, type, src: url(b.src), alt: text(b.alt, 200), href: url(b.href) }];
      case 'gallery': {
        const pictures = (Array.isArray(b.pictures) ? b.pictures : []).slice(0, 30).map(object);
        return [{ id, type, pictures: pictures.map((p) => ({ src: url(p.src), alt: text(p.alt, 200), href: url(p.href) })), layout: oneOf(b.layout, LAYOUTS, 'grid3') }];
      }
      case 'video':
        return [{ id, type, url: url(b.url), title: text(b.title, 120) }];
      case 'divider':
        return [{ id, type }];
      case 'custom': {
        const kind = text(b.kind, 60);
        const data = json(b.data);
        return kind ? [{ id, type, kind, data: data && typeof data === 'object' && !Array.isArray(data) ? data : {}, layout: oneOf(b.layout, LAYOUTS, 'cards') }] : [];
      }
    }
  });
}

/** A profile as it was given: each text as long as it may be, its theme one of the nine, its blocks read. */
export function readProfile(given: unknown): Profile {
  const p = object(given);
  const photo = url(p.photo);
  return {
    name: text(p.name, 80),
    headline: text(p.headline, 120),
    bio: text(p.bio, 600),
    // A picture of its own (a data: address) may be large; up to a few hundred kilobytes.
    photo: photo && (photo.startsWith('data:image/') ? photo.length <= 600_000 : safeUrl(photo)) ? photo : null,
    location: text(p.location, 120),
    badge: text(p.badge, 60),
    theme: oneOf(p.theme, THEME_IDS, 'accent'),
    accent: color(p.accent) ?? DEFAULT_ACCENT,
    entrance: oneOf(p.entrance, ENTRANCES, 'rise'),
    blocks: readBlocks(p.blocks),
  };
}

// ——— The list of blocks ———

/** The list with `block` at `index` (the end if left out). */
export const insertBlock = (blocks: Block[], block: Block, index = blocks.length) => [...blocks.slice(0, index), block, ...blocks.slice(index)];

/** The list without the block of `id`. */
export const removeBlock = (blocks: Block[], id: string) => blocks.filter((b) => b.id !== id);

/** The list with the block of `id` changed: what is given over what it has. */
export const updateBlock = (blocks: Block[], id: string, patch: Partial<Block>) => blocks.map((b) => (b.id === id ? ({ ...b, ...patch, id: b.id, type: b.type } as Block) : b));

/** The list with the block of `id` moved to `index`, as it is counted once it is out. */
export function moveBlock(blocks: Block[], id: string, index: number): Block[] {
  const at = blocks.findIndex((b) => b.id === id);
  if (at < 0) return blocks;
  const rest = [...blocks.slice(0, at), ...blocks.slice(at + 1)];
  const to = Math.max(0, Math.min(index, rest.length));
  return [...rest.slice(0, to), blocks[at], ...rest.slice(to)];
}

/** The list with a copy of the block of `id` after it, a new id its own. */
export function duplicateBlock(blocks: Block[], id: string): Block[] {
  const at = blocks.findIndex((b) => b.id === id);
  if (at < 0) return blocks;
  return insertBlock(blocks, { ...structuredClone(blocks[at]), id: newId() }, at + 1);
}
