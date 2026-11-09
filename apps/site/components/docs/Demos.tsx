'use client';

// The demos the pages of the documentation put among their words, each by the
// name a page gives it (`<demo name="page" />`): the engine, the editor and
// the numbers running in the page, with what they say beside them.

import '@reboprofiles/react/styles.css';
import {
  ENTRANCES,
  type Entrance,
  HIGHLIGHTS,
  type Highlight,
  LAYOUTS,
  type Layout,
  type LinkPlace,
  type Profile,
  type ProfileEvent,
  renderProfile,
  summarize,
  THEME_IDS,
  type ThemeId,
  themes,
} from '@reboprofiles/core';
import dynamic from 'next/dynamic';
import { type ReactNode, useMemo, useState } from 'react';
import { useLocale, useT } from '@/components/i18n';
import { homes, LiveEditor, startProfile } from '@/components/LiveEditor';

const ProfileStats = dynamic(() => import('@reboprofiles/react').then((m) => m.ProfileStats), { ssr: false });

const CAPTION = 'm-0 text-xs font-semibold uppercase tracking-[0.04em] text-muted';
const chip = (on: boolean) =>
  `cursor-pointer rounded-full border px-3 py-1 text-[13px] font-medium transition-colors ${on ? 'border-brand bg-brand-light text-brand-dark' : 'border-border-strong bg-white text-ink hover:bg-hover'}`;

/** A demo to try, with a line on what it shows; `aside` goes beside it, `children` is the demo itself. */
export function DemoBox({ children, aside, title }: { children: ReactNode; aside?: ReactNode; title?: string }) {
  const t = useT();
  return (
    <div className="mt-7 flex flex-wrap overflow-hidden rounded-[18px] border border-border">
      <div className="min-w-0 flex-[1.2_1_360px] bg-surface px-6 py-5">
        <p className={`${CAPTION} flex items-center gap-2`}>
          <span className="size-2 animate-pulse-dot rounded-full bg-brand" aria-hidden="true" />
          {title ?? t({ en: 'Try it', es: 'Pruébalo' })}
        </p>
        <div className="mt-3">{children}</div>
      </div>
      {aside && <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 px-6 py-5">{aside}</div>}
    </div>
  );
}

/** What the engine says while a demo runs: a dark panel of plain lines. */
export function Readout({ label, lines }: { label: string; lines: [key: string, value: string, tone?: 'good' | 'warn' | 'dim'][] }) {
  const TONE = { good: 'text-[#9ee0b0]', warn: 'text-[#f5c443]', dim: 'text-[#a8a49a]' };
  return (
    <div>
      <p className={CAPTION}>{label}</p>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: it scrolls when a line is long, and the keyboard reaches it. */}
      <div tabIndex={0} aria-live="polite" className="mt-2.5 overflow-x-auto rounded-xl bg-[#2f2e2b] px-4 py-3.5 font-code text-[13px] leading-[1.75] text-[#edece8]">
        {lines.map(([key, value, tone]) => (
          <div key={key} className="flex gap-2.5 whitespace-nowrap">
            <span className="text-[#9cc0fa]">{key}</span>
            <span className="text-[#a8a49a]" aria-hidden="true">
              →
            </span>
            <span className={tone ? TONE[tone] : 'text-[#f5c443]'}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chips<T extends string>({ label, of, value, name, onChange }: { label: string; of: readonly T[]; value: T; name: (v: T) => string; onChange: (v: T) => void }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className={`${CAPTION} p-0`}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {of.map((v) => (
          <button key={v} type="button" aria-pressed={value === v} className={chip(value === v)} onClick={() => onChange(v)}>
            {name(v)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function EditorDemo() {
  const locale = useLocale();
  const t = useT();
  return (
    <div className="mt-7">
      <p className={`${CAPTION} mb-3 flex items-center gap-2`}>
        <span className="size-2 animate-pulse-dot rounded-full bg-brand" aria-hidden="true" />
        {t({ en: 'The editor, working: write, choose a theme, add a block', es: 'El editor, funcionando: escribe, elige un tema, agrega un bloque' })}
      </p>
      <LiveEditor locale={locale} />
    </div>
  );
}

/** The page as it is shared, in a phone, its theme, its entrance, its homes' layout and its first link's motion chosen beside it. */
function PageDemo() {
  const locale = useLocale();
  const t = useT();
  const [theme, setTheme] = useState<ThemeId>('accent');
  const [entrance, setEntrance] = useState<Entrance>('rise');
  const [layout, setLayout] = useState<Layout>('grid2');
  const [highlight, setHighlight] = useState<Highlight>('pulse');
  const [opened, setOpened] = useState(0);
  const { html, places } = useMemo(() => {
    const p = startProfile(locale);
    const profile: Profile = {
      ...p,
      theme,
      entrance,
      blocks: p.blocks.map((b) => (b.type === 'custom' ? { ...b, layout } : b.type === 'link' && b === p.blocks.find((x) => x.type === 'link') ? { ...b, highlight } : b)),
    };
    const seen: LinkPlace[] = [];
    const made = renderProfile(profile, { locale, country: '52', custom: { homes: homes(locale).render }, link: (url, place) => (seen.push(place), url) });
    return { html: made.html, places: seen };
  }, [locale, theme, entrance, layout, highlight]);
  const names = themes();
  return (
    <DemoBox
      title={t({ en: 'The page, as it is shared', es: 'La página, como se comparte' })}
      aside={
        <>
          <Chips label={t({ en: 'Theme', es: 'Tema' })} of={THEME_IDS} value={theme} name={(id) => names.find((n) => n.id === id)!.label[locale]} onChange={setTheme} />
          <Chips
            label={t({ en: 'When it opens', es: 'Al abrir' })}
            of={ENTRANCES}
            value={entrance}
            name={(e) => t({ en: { rise: 'Rise', fade: 'Fade in', zoom: 'Zoom', none: 'None' }[e], es: { rise: 'Desde abajo', fade: 'Aparecer', zoom: 'Acercar', none: 'Ninguna' }[e] })}
            onChange={(e) => (setEntrance(e), setOpened((n) => n + 1))}
          />
          <Chips
            label={t({ en: 'The homes', es: 'Las casas' })}
            of={LAYOUTS}
            value={layout}
            name={(l) => ({ cards: '1 × 1', grid2: '2 × 2', grid3: '3 × 3', list: t({ en: 'List', es: 'Lista' }), carousel: t({ en: 'Carousel', es: 'Carrusel' }) })[l]}
            onChange={setLayout}
          />
          <Chips
            label={t({ en: 'The first link', es: 'La primera liga' })}
            of={HIGHLIGHTS}
            value={highlight}
            name={(h) =>
              t({
                en: { none: 'Still', pulse: 'Pulse', shake: 'Shake', shine: 'Shine', bounce: 'Bounce' }[h],
                es: { none: 'Quieta', pulse: 'Pulso', shake: 'Vibrar', shine: 'Brillo', bounce: 'Rebote' }[h],
              })
            }
            onChange={setHighlight}
          />
          <Readout
            label={t({ en: 'What the server would count, by block', es: 'Lo que el servidor contaría, por bloque' })}
            lines={places.slice(0, 9).map((p, i) => [`${i + 1}`, `${p.type}${p.part ? ` · ${p.part}` : ''}`, p.type === 'custom' ? 'good' : undefined])}
          />
        </>
      }
    >
      <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[28px] border-[6px] border-[#18181b] bg-white shadow-editor">
        <iframe key={opened} title={t({ en: 'The page', es: 'La página' })} srcDoc={html} sandbox="allow-popups" className="block h-[640px] w-full" />
      </div>
    </DemoBox>
  );
}

/** The same visits each time, as many visitors would make them: a seed, not chance, so the page reads the same. */
function visitsOf(profile: Profile, days: number): ProfileEvent[] {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(random() * xs.length)];
  const clickable = profile.blocks.filter((b) => b.type === 'link' || b.type === 'contact' || b.type === 'socials' || b.type === 'custom' || b.type === 'video');
  const events: ProfileEvent[] = [];
  const now = Date.parse('2026-10-30T18:00:00Z');
  for (let d = days - 1; d >= 0; d--) {
    const count = 10 + Math.floor(random() * 22) + (d < 5 ? 14 : 0);
    for (let v = 0; v < count; v++) {
      const at = new Date(now - d * 86_400_000 - random() * 36_000_000);
      const visitor = `${d}-${v}`;
      // One in eight comes by the QR code printed: a poster in the office, the cards handed out.
      const qr = random() < 0.13 ? pick(['poster', 'poster', 'cards', 'cards', 'cards', 'stickers', 'file']) : undefined;
      events.push({
        type: 'view',
        at,
        visitor,
        qr,
        source: qr ? 'qr' : pick(['instagram', 'instagram', 'instagram', 'whatsapp', 'tiktok', 'google', 'direct', 'facebook']),
        device: pick(['mobile', 'mobile', 'mobile', 'mobile', 'desktop', 'tablet'] as const),
        country: pick(['MX', 'MX', 'MX', 'US', 'US', 'CA']),
        campaign: random() < 0.15 ? 'otono' : undefined,
      });
      if (random() < 0.55) {
        const b = pick(clickable);
        events.push({
          type: 'click',
          at,
          visitor,
          block: b.id,
          part: b.type === 'contact' ? pick(['whatsapp', 'whatsapp', 'phone']) : b.type === 'socials' ? pick(['instagram', 'tiktok']) : undefined,
        });
      }
    }
  }
  return events;
}

function StatsDemo() {
  const locale = useLocale();
  const t = useT();
  const [days, setDays] = useState(14);
  const profile = useMemo(() => startProfile(locale), [locale]);
  const summary = useMemo(() => {
    const events = visitsOf(profile, 30);
    const to = '2026-10-30';
    const from = new Date(Date.parse(`${to}T12:00:00Z`) - (days - 1) * 86_400_000).toISOString().slice(0, 10);
    return summarize(events, { from, to, profile, locale });
  }, [profile, days, locale]);
  return (
    <div className="mt-7">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className={`${CAPTION} mr-auto flex items-center gap-2`}>
          <span className="size-2 animate-pulse-dot rounded-full bg-brand" aria-hidden="true" />
          {t({ en: 'The numbers of a month of made-up visits', es: 'Las cifras de un mes de visitas inventadas' })}
        </p>
        {[7, 14, 30].map((d) => (
          <button key={d} type="button" aria-pressed={days === d} className={chip(days === d)} onClick={() => setDays(d)}>
            {d} {t({ en: 'days', es: 'días' })}
          </button>
        ))}
      </div>
      <ProfileStats summary={summary} locale={locale} />
    </div>
  );
}

/** A demo by its name, as a page of the documentation says it. */
export function Demo({ name }: { name: string }) {
  if (name === 'editor') return <EditorDemo />;
  if (name === 'page') return <PageDemo />;
  if (name === 'stats') return <StatsDemo />;
  return null;
}
