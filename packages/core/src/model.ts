// What a profile is: someone's one page. On top, who they are (their name,
// their photo, what they do, a few words, where, a mark that they are who
// they say); below it, its blocks one under another: a link, the buttons to
// reach them, their networks, a heading, words, a picture, a gallery, a
// video, a line, and blocks of the application's own (`custom`: a kind and
// its data, drawn by what the application gives the renderer: the properties
// of an agent, the dishes of a cook). And its look: one of nine themes, an
// accent for the one that is theirs, and how its blocks come in when the
// page opens; a link may move, to be seen first.

export interface Profile {
  name: string;
  /** What they do, in a line. */
  headline: string;
  /** A few words; a line break where it is written. */
  bio: string;
  /** A picture's address, or a data: address. */
  photo: string | null;
  /** Where they are, or work. */
  location: string;
  /** A mark that they are who they say: a licence, a registration. Shown beside their name, when there is one. */
  badge: string;
  theme: ThemeId;
  /** #rrggbb: the colour of the `accent` theme. */
  accent: string;
  /** How the blocks come in when the page opens, one after another. */
  entrance: Entrance;
  blocks: Block[];
}

/** How the blocks come in: rising, fading in, growing, or there already. */
export type Entrance = 'rise' | 'fade' | 'zoom' | 'none';
/** How a link draws the eye, again and again: a beat, a shake, a light across it, a bounce. */
export type Highlight = 'none' | 'pulse' | 'shake' | 'shine' | 'bounce';

export type ThemeId = 'accent' | 'light' | 'dark' | 'sand' | 'forest' | 'ocean' | 'sunset' | 'aurora' | 'midnight';
export type Network = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'linkedin' | 'x' | 'whatsapp' | 'website';
/**
 * How what is shown many at once is laid out (a gallery, the items of a custom block): a card a row, two a row, a
 * mosaic of three, a list of small ones, or a row to slide.
 */
export type Layout = 'cards' | 'grid2' | 'grid3' | 'list' | 'carousel';

/** A picture of a gallery: its address, what it shows, where a click goes. */
export interface Picture {
  src: string;
  alt: string;
  href: string;
}

export type Block =
  | {
      id: string;
      type: 'link';
      label: string;
      url: string;
      /** A second line under it. */
      note: string;
      /** An emoji before it. */
      icon: string;
      highlight: Highlight;
    }
  | {
      id: string;
      type: 'contact';
      /** The numbers and the address, each its button when given. */
      whatsapp: string;
      phone: string;
      email: string;
      /** What a WhatsApp starts with, written for them. */
      message: string;
    }
  | { id: string; type: 'socials'; links: Partial<Record<Network, string>> }
  | { id: string; type: 'heading'; text: string }
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'image'; src: string; alt: string; href: string }
  | { id: string; type: 'gallery'; pictures: Picture[]; layout: Layout }
  | { id: string; type: 'video' /** A picture of it and the way to it: YouTube's or Vimeo's address. */; url: string; title: string }
  | { id: string; type: 'divider' }
  | { id: string; type: 'custom' /** Which of the application's own. */; kind: string; data: CustomData; layout: Layout };

export type BlockType = Block['type'];
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;
export type CustomData = { [key: string]: Json };
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export const THEME_IDS: readonly ThemeId[] = ['accent', 'light', 'dark', 'sand', 'forest', 'ocean', 'sunset', 'aurora', 'midnight'];
export const NETWORKS: readonly Network[] = ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'x', 'whatsapp', 'website'];
export const LAYOUTS: readonly Layout[] = ['cards', 'grid2', 'grid3', 'list', 'carousel'];
export const ENTRANCES: readonly Entrance[] = ['rise', 'fade', 'zoom', 'none'];
export const HIGHLIGHTS: readonly Highlight[] = ['none', 'pulse', 'shake', 'shine', 'bounce'];
export const BLOCK_TYPES: readonly BlockType[] = ['link', 'contact', 'socials', 'heading', 'text', 'image', 'gallery', 'video', 'divider', 'custom'];

export const DEFAULT_ACCENT = '#3b63fb';
