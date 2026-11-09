// A profile written in a form beside its page as it will look: on top who
// they are (their photo, made square and small, their name, what they do, a
// few words, where, what they are verified as) and the look of the page (its
// nine themes, its accent); below it each block as a card of its own, moved
// up and down, copied and taken away, and the blocks to add; beside it the
// page itself, as `renderProfile` makes it (what is seen is what is shared),
// and what it lacks. The blocks of the application's own are added as it
// registers them: what they ask, and how they are drawn.

import {
  type Block,
  type BlockOf,
  type BlockType,
  type CustomBlock,
  type CustomData,
  describeProblem,
  duplicateBlock,
  ENTRANCES,
  HIGHLIGHTS,
  insertBlock,
  type Layout,
  LAYOUTS,
  type Locale,
  makeBlock,
  moveBlock,
  NETWORK_NAMES,
  NETWORKS,
  type Profile,
  problemsOf,
  type RenderOptions,
  removeBlock,
  renderProfile,
  themes,
  updateBlock,
} from '@reboprofiles/core';
import { type ComponentType, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { WORDS, type Words } from './i18n';
import { ProfileShare } from './Share';

/** One of the application's own blocks: its kind, its name, its data as it starts, how it is drawn, and what it asks. */
export interface EditorBlock {
  kind: string;
  label: string;
  data?: () => CustomData;
  /** How it is laid out as it starts, when it shows many things. */
  layout?: Layout;
  render: CustomBlock;
  Fields?: ComponentType<{ block: BlockOf<'custom'>; update: (data: CustomData) => void; locale: Locale }>;
}

export interface ProfileEditorProps {
  /** The profile to start from: the editor keeps it from then on, and tells each change. */
  profile: Profile;
  onChange?: (profile: Profile) => void;
  locale?: Locale;
  blocks?: EditorBlock[];
  /** The page's address, once it has one: its QR code is shown to save and print. */
  url?: string;
  /** What the preview's page is drawn with, but the blocks and the language: the base, the country of the phones. */
  render?: Omit<RenderOptions, 'custom' | 'locale' | 'link' | 'view'>;
  className?: string;
}

const BUILT_IN: Exclude<BlockType, 'custom'>[] = ['link', 'contact', 'socials', 'heading', 'text', 'image', 'gallery', 'video', 'divider'];

export function ProfileEditor({ profile: start, onChange, locale = 'en', blocks = [], render, url, className }: ProfileEditorProps) {
  const [profile, setProfile] = useState(start);
  const set = (next: Profile) => {
    setProfile(next);
    onChange?.(next);
  };
  const custom = useMemo(() => Object.fromEntries(blocks.map((b) => [b.kind, b.render])), [blocks]);
  return (
    <div className={`rpe${className ? ` ${className}` : ''}`}>
      <ProfileForm profile={profile} onChange={set} locale={locale} blocks={blocks} />
      <aside className="rpe-side">
        <ProfilePreview profile={profile} locale={locale} custom={custom} render={render} />
        <ProfileProblems profile={profile} locale={locale} custom={custom} />
        {url && <ProfileShare profile={profile} url={url} locale={locale} />}
      </aside>
    </div>
  );
}

// ——— The form ———

export function ProfileForm({ profile, onChange, locale = 'en', blocks = [] }: { profile: Profile; onChange: (p: Profile) => void; locale?: Locale; blocks?: EditorBlock[] }) {
  const w = WORDS[locale];
  const set = (patch: Partial<Profile>) => onChange({ ...profile, ...patch });
  const setBlocks = (list: Block[]) => set({ blocks: list });
  const [open, setOpen] = useState<string | null>(null);
  const add = (block: Block) => {
    setBlocks(insertBlock(profile.blocks, block));
    setOpen(block.id);
  };
  return (
    <div className="rpe-form">
      <section className="rpe-part">
        <h2>{w.you}</h2>
        <PhotoField value={profile.photo} onChange={(photo) => set({ photo })} words={w} />
        <Field label={w.name}>
          <input className="rpe-input" value={profile.name} maxLength={80} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label={w.headline} hint={w.headlineHint}>
          <input className="rpe-input" value={profile.headline} maxLength={120} onChange={(e) => set({ headline: e.target.value })} />
        </Field>
        <Field label={w.bio} hint={`${profile.bio.length}/600`}>
          <textarea className="rpe-input" rows={3} value={profile.bio} maxLength={600} onChange={(e) => set({ bio: e.target.value })} />
        </Field>
        <div className="rpe-row">
          <Field label={w.location}>
            <input className="rpe-input" value={profile.location} maxLength={120} onChange={(e) => set({ location: e.target.value })} />
          </Field>
          <Field label={w.badge} hint={w.badgeHint}>
            <input className="rpe-input" value={profile.badge} maxLength={60} onChange={(e) => set({ badge: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="rpe-part">
        <h2>{w.look}</h2>
        <ThemePicker profile={profile} onChange={set} locale={locale} />
      </section>

      <section className="rpe-part">
        <h2>{w.page}</h2>
        {profile.blocks.length ? (
          <ol className="rpe-blocks">
            {profile.blocks.map((b, i) => (
              <li key={b.id} className="rpe-block" data-open={open === b.id || undefined}>
                <div className="rpe-block-head">
                  <button type="button" className="rpe-block-name" onClick={() => setOpen(open === b.id ? null : b.id)} aria-expanded={open === b.id}>
                    <span className="rpe-chevron">
                      <Icon name="chevron" size={16} />
                    </span>
                    <b>{nameOf(b, w, blocks)}</b>
                    <span>{summaryOf(b)}</span>
                  </button>
                  <IconButton label={w.up} disabled={i === 0} onClick={() => setBlocks(moveBlock(profile.blocks, b.id, i - 1))}>
                    <Icon name="up" />
                  </IconButton>
                  <IconButton label={w.down} disabled={i === profile.blocks.length - 1} onClick={() => setBlocks(moveBlock(profile.blocks, b.id, i + 1))}>
                    <Icon name="down" />
                  </IconButton>
                  <IconButton label={w.duplicate} onClick={() => setBlocks(duplicateBlock(profile.blocks, b.id))}>
                    <Icon name="copy" />
                  </IconButton>
                  <IconButton label={w.remove} onClick={() => setBlocks(removeBlock(profile.blocks, b.id))}>
                    <Icon name="trash" />
                  </IconButton>
                </div>
                {open === b.id && (
                  <div className="rpe-block-fields">
                    <BlockFields block={b} update={(patch) => setBlocks(updateBlock(profile.blocks, b.id, patch))} words={w} locale={locale} custom={blocks} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="rpe-help">{w.empty}</p>
        )}
        <div className="rpe-add">
          <span>{w.add}</span>
          {BUILT_IN.map((type) => (
            <button key={type} type="button" className="rpe-action" onClick={() => add(makeBlock(type))}>
              <Icon name="plus" size={16} />
              {w.blocks[type]}
            </button>
          ))}
          {blocks.map((b) => (
            <button key={b.kind} type="button" className="rpe-action" onClick={() => add(makeBlock('custom', { kind: b.kind, data: b.data?.(), layout: b.layout }))}>
              <Icon name="plus" size={16} />
              {b.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

const nameOf = (b: Block, w: Words, custom: EditorBlock[]) => (b.type === 'custom' ? (custom.find((c) => c.kind === b.kind)?.label ?? b.kind) : w.blocks[b.type]);
const summaryOf = (b: Block) => {
  switch (b.type) {
    case 'link':
      return b.label || b.url;
    case 'heading':
    case 'text':
      return b.text.slice(0, 60);
    case 'video':
      return b.title || b.url;
    case 'contact':
      return [b.whatsapp, b.phone, b.email].filter(Boolean).join(' · ');
    case 'socials':
      return NETWORKS.filter((n) => b.links[n])
        .map((n) => NETWORK_NAMES[n])
        .join(' · ');
    case 'gallery':
      return `${b.pictures.length}`;
    default:
      return '';
  }
};

function BlockFields({ block: b, update, words: w, locale, custom }: { block: Block; update: (patch: Partial<Block>) => void; words: Words; locale: Locale; custom: EditorBlock[] }) {
  const f = w.fields;
  const input = (label: string, value: string, change: (v: string) => void, extra: { type?: string; max?: number; placeholder?: string } = {}) => (
    <Field label={label}>
      <input className="rpe-input" type={extra.type ?? 'text'} value={value} maxLength={extra.max} placeholder={extra.placeholder} onChange={(e) => change(e.target.value)} />
    </Field>
  );
  switch (b.type) {
    case 'link':
      return (
        <>
          <div className="rpe-row">
            {input(f.label, b.label, (label) => update({ label }), { max: 80 })}
            {input(f.icon, b.icon, (icon) => update({ icon }), { max: 8, placeholder: '📅' })}
          </div>
          {input(f.url, b.url, (url) => update({ url }), { placeholder: 'https://' })}
          {input(f.note, b.note, (note) => update({ note }), { max: 120 })}
          <Group label={w.highlight}>
            {HIGHLIGHTS.map((h) => (
              <button key={h} type="button" className="rpe-chip" aria-pressed={b.highlight === h} onClick={() => update({ highlight: h })}>
                {w.highlights[h]}
              </button>
            ))}
          </Group>
        </>
      );
    case 'contact':
      return (
        <>
          <div className="rpe-row">
            {input(f.whatsapp, b.whatsapp, (whatsapp) => update({ whatsapp }), { type: 'tel' })}
            {input(f.phone, b.phone, (phone) => update({ phone }), { type: 'tel' })}
          </div>
          {input(f.email, b.email, (email) => update({ email }), { type: 'email' })}
          {input(f.message, b.message, (message) => update({ message }), { max: 300 })}
        </>
      );
    case 'socials':
      return (
        <div className="rpe-grid2">
          {NETWORKS.map((n) => (
            <Field key={n} label={NETWORK_NAMES[n]}>
              <input className="rpe-input" type="url" value={b.links[n] ?? ''} placeholder="https://" onChange={(e) => update({ links: { ...b.links, [n]: e.target.value } })} />
            </Field>
          ))}
        </div>
      );
    case 'heading':
      return input(f.text, b.text, (text) => update({ text }), { max: 120 });
    case 'text':
      return (
        <Field label={f.text}>
          <textarea className="rpe-input" rows={4} value={b.text} maxLength={2000} onChange={(e) => update({ text: e.target.value })} />
        </Field>
      );
    case 'image':
      return (
        <>
          {input(f.src, b.src, (src) => update({ src }), { placeholder: 'https://' })}
          {input(f.alt, b.alt, (alt) => update({ alt }))}
          {input(f.href, b.href, (href) => update({ href }), { placeholder: 'https://' })}
        </>
      );
    case 'gallery':
      return (
        <>
          <LayoutPicker value={b.layout} onChange={(layout) => update({ layout })} words={w} />
          <Field label={f.pictures}>
            <div className="rpe-pictures">
              {b.pictures.map((p, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: the pictures are where they are, in their order.
                <div key={i} className="rpe-row">
                  <input
                    className="rpe-input"
                    value={p.src}
                    placeholder="https://"
                    aria-label={f.src}
                    onChange={(e) => update({ pictures: b.pictures.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)) })}
                  />
                  <input
                    className="rpe-input"
                    value={p.alt}
                    placeholder={f.alt}
                    aria-label={f.alt}
                    onChange={(e) => update({ pictures: b.pictures.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) })}
                  />
                  <IconButton label={w.remove} onClick={() => update({ pictures: b.pictures.filter((_, j) => j !== i) })}>
                    <Icon name="trash" />
                  </IconButton>
                </div>
              ))}
              {b.pictures.length < 30 && (
                <button type="button" className="rpe-action" onClick={() => update({ pictures: [...b.pictures, { src: '', alt: '', href: '' }] })}>
                  <Icon name="plus" size={16} />
                  {f.addPicture}
                </button>
              )}
            </div>
          </Field>
        </>
      );
    case 'video':
      return (
        <>
          {input(f.video, b.url, (url) => update({ url }), { placeholder: 'https://youtube.com/watch?v=…' })}
          {input(f.title, b.title, (title) => update({ title }), { max: 120 })}
        </>
      );
    case 'divider':
      return null;
    case 'custom': {
      const definition = custom.find((c) => c.kind === b.kind);
      return (
        <>
          <LayoutPicker value={b.layout} onChange={(layout) => update({ layout })} words={w} />
          {definition?.Fields && <definition.Fields block={b} update={(data) => update({ data })} locale={locale} />}
        </>
      );
    }
  }
}

// ——— Its parts ———

const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: the control is the child given.
  <label className="rpe-field">
    <span>
      {label}
      {hint && <small> · {hint}</small>}
    </span>
    {children}
  </label>
);

/** Lines of 20, as Spectrum's workflow icons draw them, in the colour of the words beside them. */
const ICONS = {
  up: 'M10 15.5v-11M5.5 9 10 4.5 14.5 9',
  down: 'M10 4.5v11M5.5 11 10 15.5 14.5 11',
  copy: 'M7 7h9v9H7zM4 13V4h9',
  trash: 'M4.5 6h11M8 6V4.25h4V6M6 6l.7 10h6.6L14 6',
  chevron: 'M7.5 5 12.5 10l-5 5',
  plus: 'M10 4.5v11M4.5 10h11',
} as const;
export const Icon = ({ name, size = 18 }: { name: keyof typeof ICONS; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
);

/** Buttons that choose one thing, named together: a fieldset, not a label, which would name only the first of them. */
const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <fieldset className="rpe-field rpe-group">
    <legend>{label}</legend>
    <span className="rpe-layouts">{children}</span>
  </fieldset>
);

const IconButton = ({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) => (
  <button type="button" className="rpe-icon" title={label} aria-label={label} disabled={disabled} onClick={onClick}>
    {children}
  </button>
);

/** A picture made a square of 400 pixels, its middle, as a JPEG: small enough to keep with the profile. */
async function squareOf(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = Object.assign(document.createElement('canvas'), { width: 400, height: 400 });
    canvas.getContext('2d')?.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 400, 400);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function PhotoField({ value, onChange, words: w }: { value: string | null; onChange: (photo: string | null) => void; words: Words }) {
  const picker = useRef<HTMLInputElement>(null);
  return (
    <div className="rpe-photo">
      <span className="rpe-photo-circle">{value ? <img src={value} alt="" /> : null}</span>
      <span className="rpe-photo-actions">
        <b>{w.photo}</b>
        <span>
          <button type="button" className="rpe-button" onClick={() => picker.current?.click()}>
            {w.upload}
          </button>
          {value && (
            <button type="button" className="rpe-button rpe-quiet" onClick={() => onChange(null)}>
              {w.remove}
            </button>
          )}
        </span>
      </span>
      <input
        ref={picker}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) void squareOf(file).then(onChange, () => undefined);
        }}
      />
    </div>
  );
}

/** The nine themes, each a little page of its colours; the first in the accent, chosen beside it. */
export function ThemePicker({ profile, onChange, locale = 'en' }: { profile: Profile; onChange: (p: Profile) => void; locale?: Locale }) {
  const w = WORDS[locale];
  return (
    <>
      <div className="rpe-themes">
        {themes(profile.accent).map((t) => (
          <button key={t.id} type="button" className="rpe-theme" aria-pressed={profile.theme === t.id} onClick={() => onChange({ ...profile, theme: t.id })}>
            <span className="rpe-theme-sample" style={{ background: t.background }}>
              <span style={{ background: t.card }} />
              <span style={{ background: t.button }} />
              <span style={{ background: t.button }} />
            </span>
            <span className="rpe-theme-name">{t.label[locale]}</span>
          </button>
        ))}
      </div>
      {profile.theme === 'accent' && (
        <label className="rpe-accent">
          <input type="color" value={profile.accent} onChange={(e) => onChange({ ...profile, accent: e.target.value })} /> {w.accent}
        </label>
      )}
      <Group label={w.entrance}>
        {ENTRANCES.map((e) => (
          <button key={e} type="button" className="rpe-chip" aria-pressed={profile.entrance === e} onClick={() => onChange({ ...profile, entrance: e })}>
            {w.entrances[e]}
          </button>
        ))}
      </Group>
    </>
  );
}

export function LayoutPicker({ value, onChange, words: w }: { value: Layout; onChange: (layout: Layout) => void; words: Words }) {
  return (
    <Group label={w.fields.layout}>
      {LAYOUTS.map((l) => (
        <button key={l} type="button" className="rpe-chip" aria-pressed={value === l} onClick={() => onChange(l)}>
          {w.layouts[l]}
        </button>
      ))}
    </Group>
  );
}

/** The page itself, as it is shared, in a phone's width. */
/** What moves in a page: its entrance and its links that draw the eye. A change of it plays the entrance again. */
const motionOf = (p: Profile) => `${p.entrance}|${p.blocks.map((b) => (b.type === 'link' ? b.highlight : '')).join(',')}`;

/**
 * The page itself, as it is shared, in a phone's width. Loaded once, then its body written anew as the profile
 * changes: its entrance plays when it opens, when what moves in it changes, and when asked; not at each letter.
 */
export function ProfilePreview({ profile, locale = 'en', custom = {}, render }: { profile: Profile; locale?: Locale; custom?: Record<string, CustomBlock>; render?: ProfileEditorProps['render'] }) {
  const w = WORDS[locale];
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [replay, setReplay] = useState(0);
  const draw = (motion: boolean) => renderProfile(profile, { ...render, locale, custom, motion });
  // The page it opens with, moving; what changes after is written into it.
  const [first] = useState(() => draw(true).html);
  const written = useRef<{ motion: string; replay: number; body: string } | null>(null);
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (!loaded || !doc?.body) return;
    const motion = motionOf(profile);
    const still = draw(false).body;
    if (!written.current) {
      written.current = { motion, replay, body: still };
      if (doc.body.innerHTML.includes('class="rp"')) return;
    }
    const moves = written.current.motion !== motion || written.current.replay !== replay;
    if (!moves && written.current.body === still) return;
    doc.body.innerHTML = moves ? draw(true).body : still;
    written.current = { motion, replay, body: still };
  });
  return (
    <div className="rpe-preview">
      <p className="rpe-preview-head">
        <span className="rpe-label">{w.preview}</span>
        <button type="button" className="rpe-button rpe-quiet" onClick={() => setReplay((n) => n + 1)}>
          ▶ {w.replay}
        </button>
      </p>
      <iframe ref={frame} title={w.preview} srcDoc={first} onLoad={() => setLoaded(true)} sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" className="rpe-phone" />
    </div>
  );
}

export function ProfileProblems({ profile, locale = 'en', custom = {} }: { profile: Profile; locale?: Locale; custom?: Record<string, CustomBlock> }) {
  const w = WORDS[locale];
  const problems = problemsOf(profile, { custom });
  return (
    <div className="rpe-problems">
      <p className="rpe-label">{w.problems}</p>
      {problems.length ? (
        <ul>
          {problems.map((p, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the problems as they are found, in their order.
            <li key={i}>{describeProblem(p, locale)}</li>
          ))}
        </ul>
      ) : (
        <p className="rpe-ok">✓ {w.noProblems}</p>
      )}
    </div>
  );
}
