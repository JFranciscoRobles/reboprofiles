// The looks a profile may have: nine, four of them gradients, the first in
// its own accent. Each says what its page is drawn with: what is behind it
// all, its words, its buttons, the boxes of how to reach them and of their
// networks, and the mark beside their name.

import { DEFAULT_ACCENT, type ThemeId } from './model';

export interface Theme {
  id: ThemeId;
  /** Its name, in English and Spanish. */
  label: { en: string; es: string };
  /** A colour or a gradient. */
  background: string;
  text: string;
  muted: string;
  /** The links: a colour or a gradient, and their words. */
  button: string;
  buttonText: string;
  /** The boxes of the contact and the networks, and the cards of a gallery or a custom block. */
  card: string;
  cardText: string;
  /** The mark of who they are, the icons. */
  accent: string;
  /** Whether it is dark: its pictures' captions and its cards drawn for it. */
  dark: boolean;
}

/** The nine themes, the first in `accent` (#rrggbb). */
export function themes(accent = DEFAULT_ACCENT): Theme[] {
  const light = `color-mix(in srgb, ${accent} 12%, white)`;
  return [
    {
      id: 'accent',
      label: { en: 'Accent', es: 'Tu color' },
      background: `linear-gradient(to bottom, ${light}, #ffffff 420px)`,
      text: '#18181b',
      muted: '#71717a',
      button: accent,
      buttonText: '#ffffff',
      card: '#ffffff',
      cardText: accent,
      accent,
      dark: false,
    },
    {
      id: 'light',
      label: { en: 'Light', es: 'Claro' },
      background: '#ffffff',
      text: '#18181b',
      muted: '#71717a',
      button: '#18181b',
      buttonText: '#ffffff',
      card: '#f4f4f5',
      cardText: '#18181b',
      accent: '#18181b',
      dark: false,
    },
    {
      id: 'dark',
      label: { en: 'Dark', es: 'Oscuro' },
      background: '#0f0f10',
      text: '#fafafa',
      muted: '#a1a1aa',
      button: '#fafafa',
      buttonText: '#0f0f10',
      card: '#1c1c1f',
      cardText: '#fafafa',
      accent: '#fafafa',
      dark: true,
    },
    {
      id: 'sand',
      label: { en: 'Sand', es: 'Arena' },
      background: '#f5efe6',
      text: '#3d3027',
      muted: '#7a6a5b',
      button: '#8c6a4f',
      buttonText: '#fffaf3',
      card: '#fffaf3',
      cardText: '#8c6a4f',
      accent: '#8c6a4f',
      dark: false,
    },
    {
      id: 'forest',
      label: { en: 'Forest', es: 'Bosque' },
      background: '#14322a',
      text: '#f1f7f3',
      muted: '#a8c3b6',
      button: '#d6efe2',
      buttonText: '#14322a',
      card: '#1d4237',
      cardText: '#d6efe2',
      accent: '#8fd3b0',
      dark: true,
    },
    {
      id: 'ocean',
      label: { en: 'Ocean', es: 'Océano' },
      background: 'linear-gradient(160deg, #0ea5e9 0%, #2563eb 55%, #1e3a8a 100%)',
      text: '#ffffff',
      muted: '#dbeafe',
      button: '#ffffff',
      buttonText: '#1e40af',
      card: 'rgba(255,255,255,0.16)',
      cardText: '#ffffff',
      accent: '#ffffff',
      dark: true,
    },
    {
      id: 'sunset',
      label: { en: 'Sunset', es: 'Atardecer' },
      background: 'linear-gradient(160deg, #fb923c 0%, #f43f5e 55%, #9d174d 100%)',
      text: '#ffffff',
      muted: '#ffe4e6',
      button: '#ffffff',
      buttonText: '#be123c',
      card: 'rgba(255,255,255,0.18)',
      cardText: '#ffffff',
      accent: '#ffffff',
      dark: true,
    },
    {
      id: 'aurora',
      label: { en: 'Aurora', es: 'Aurora' },
      background: 'linear-gradient(160deg, #a78bfa 0%, #6366f1 45%, #14b8a6 100%)',
      text: '#ffffff',
      muted: '#ede9fe',
      button: '#ffffff',
      buttonText: '#4338ca',
      card: 'rgba(255,255,255,0.18)',
      cardText: '#ffffff',
      accent: '#ffffff',
      dark: true,
    },
    {
      id: 'midnight',
      label: { en: 'Midnight', es: 'Medianoche' },
      background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #701a75 100%)',
      text: '#ffffff',
      muted: '#c7d2fe',
      button: 'linear-gradient(90deg, #f472b6, #a78bfa)',
      buttonText: '#ffffff',
      card: 'rgba(255,255,255,0.1)',
      cardText: '#ffffff',
      accent: '#f0abfc',
      dark: true,
    },
  ];
}

/** A theme by its id, in `accent`. */
export const themeOf = (id: ThemeId, accent = DEFAULT_ACCENT): Theme => themes(accent).find((t) => t.id === id) ?? themes(accent)[0];

/** A theme as the custom properties its page is drawn with (`--rp-bg`, `--rp-text`…), as CSS declarations. */
export const themeCss = (t: Theme) =>
  [
    ['bg', t.background],
    ['text', t.text],
    ['muted', t.muted],
    ['button', t.button],
    ['button-text', t.buttonText],
    ['card', t.card],
    ['card-text', t.cardText],
    ['accent', t.accent],
  ]
    .map(([k, v]) => `--rp-${k}:${v};`)
    .join('');
