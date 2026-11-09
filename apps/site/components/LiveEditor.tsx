'use client';

// The editor, working, on the page: the sample profile in the page's
// language, with a block of its own (homes for sale) to show how an
// application adds one. Loaded only in the browser.

import '@reboprofiles/react/styles.css';
import { type Locale, type Profile, sampleProfile } from '@reboprofiles/core';
import type { EditorBlock } from '@reboprofiles/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ProfileEditor = dynamic(() => import('@reboprofiles/react').then((m) => m.ProfileEditor), {
  ssr: false,
  loading: () => <div className="grid h-[640px] place-items-center rounded-2xl border border-line text-muted">…</div>,
});

const HOMES = [
  { title: 'Casa frente al mar', place: 'Playas de Tijuana', price: '$4,200,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600' },
  { title: 'Departamento con vista', place: 'Zona Río', price: '$2,350,000', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
  { title: 'Terreno en el valle', place: 'Valle de Guadalupe', price: '$1,800,000', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600' },
];

/** Homes for sale, as an application would add them: its items as cards, in the layout chosen. */
export const homes = (locale: Locale): EditorBlock => ({
  kind: 'homes',
  label: locale === 'es' ? 'Casas' : 'Homes',
  layout: 'grid2',
  data: () => ({ count: 3 }),
  render: {
    html: (b, ctx) =>
      ctx.items(
        HOMES.slice(0, Number(b.data.count) || 3).map((h) => ({ title: h.title, subtitle: h.place, badge: h.price, image: h.image, href: 'https://example.com/homes' })),
        b.layout,
        { block: b.id, type: 'custom', part: 'home' },
      ),
  },
  Fields: ({ block, update }) => (
    <label className="rpe-field">
      <span>{locale === 'es' ? 'Cuántas' : 'How many'}</span>
      <input className="rpe-input" type="number" min={1} max={3} value={Number(block.data.count) || 3} onChange={(e) => update({ count: Number(e.target.value) })} />
    </label>
  ),
});

/** The sample, with the homes after its links. */
export const startProfile = (locale: Locale): Profile => {
  const p = sampleProfile(locale);
  return { ...p, blocks: [...p.blocks.slice(0, 4), { id: 'homes', type: 'custom', kind: 'homes', data: { count: 3 }, layout: 'grid2' }, ...p.blocks.slice(4)] };
};

export function LiveEditor({ locale, onChange }: { locale: Locale; onChange?: (p: Profile) => void }) {
  // The profile and the block made once a language: the editor starts from them, and is then the reader's.
  const profile = useMemo(() => startProfile(locale), [locale]);
  const blocks = useMemo(() => [homes(locale)], [locale]);
  return <ProfileEditor profile={profile} blocks={blocks} locale={locale} onChange={onChange} render={{ country: '52' }} url="https://reboprofiles.com/u/laura-mendez" />;
}
