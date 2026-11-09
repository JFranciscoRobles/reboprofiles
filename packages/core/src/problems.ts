// What a profile lacks before it is shared: a name, something in it, a block
// without what it needs to show anything (a link without its words or its
// address, a contact without a way to reach them), an address no browser
// should follow. Each said by a code, for the application, and in words, in
// English or Spanish.

import { safeUrl } from './blocks';
import type { Block, BlockType, Profile } from './model';
import { NETWORKS } from './model';
import type { CustomBlock, Locale } from './render';

export type Problem = { code: 'no-name' } | { code: 'no-blocks' } | { code: 'incomplete'; block: string; type: BlockType } | { code: 'bad-link'; block: string; type: BlockType; url: string };

/** Whether a block has what it needs to show something. A custom one says so itself; it is complete if it does not. */
export function isComplete(b: Block, custom: Record<string, CustomBlock> = {}): boolean {
  switch (b.type) {
    case 'link':
      return !!b.label.trim() && !!b.url.trim();
    case 'contact':
      return !!(b.whatsapp.trim() || b.phone.trim() || b.email.trim());
    case 'socials':
      return Object.values(b.links).some(Boolean);
    case 'heading':
    case 'text':
      return !!b.text.trim();
    case 'image':
      return !!b.src;
    case 'gallery':
      return b.pictures.some((p) => p.src);
    case 'video':
      return !!b.url.trim();
    case 'divider':
      return true;
    case 'custom':
      return custom[b.kind]?.complete?.(b) ?? true;
  }
}

/** The addresses a block goes to. */
const linksOf = (b: Block): string[] => {
  switch (b.type) {
    case 'link':
    case 'video':
      return [b.url];
    case 'image':
      return [b.href];
    case 'gallery':
      return b.pictures.map((p) => p.href);
    case 'socials':
      return NETWORKS.map((n) => b.links[n] ?? '');
    default:
      return [];
  }
};

/** What a profile lacks, in the order it is read. */
export function problemsOf(profile: Profile, options: { custom?: Record<string, CustomBlock> } = {}): Problem[] {
  const out: Problem[] = [];
  if (!profile.name.trim()) out.push({ code: 'no-name' });
  if (!profile.blocks.length) out.push({ code: 'no-blocks' });
  for (const b of profile.blocks) {
    if (!isComplete(b, options.custom)) out.push({ code: 'incomplete', block: b.id, type: b.type });
    for (const url of linksOf(b)) if (url.trim() && !safeUrl(url)) out.push({ code: 'bad-link', block: b.id, type: b.type, url });
  }
  return out;
}

export const TYPE_NAMES: Record<Locale, Record<BlockType, string>> = {
  en: { link: 'link', contact: 'contact', socials: 'networks', heading: 'heading', text: 'text', image: 'image', gallery: 'gallery', video: 'video', divider: 'divider', custom: 'block' },
  es: { link: 'liga', contact: 'contacto', socials: 'redes', heading: 'título', text: 'texto', image: 'imagen', gallery: 'galería', video: 'video', divider: 'separador', custom: 'bloque' },
};

/** A problem in words, to show whoever writes the profile. */
export function describeProblem(p: Problem, locale: Locale = 'en'): string {
  const es = locale === 'es';
  const name = 'type' in p ? TYPE_NAMES[locale][p.type] : '';
  switch (p.code) {
    case 'no-name':
      return es ? 'Falta tu nombre.' : 'Your name is missing.';
    case 'no-blocks':
      return es ? 'La página está vacía: agrega una liga.' : 'The page is empty: add a link.';
    case 'incomplete':
      return es ? `Le falta algo al bloque «${name}».` : `The ${name} block is missing something.`;
    case 'bad-link':
      return es ? `La dirección «${p.url}» no se puede abrir.` : `The address “${p.url}” cannot be opened.`;
  }
}
