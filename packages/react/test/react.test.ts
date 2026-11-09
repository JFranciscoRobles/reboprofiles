// @vitest-environment happy-dom
import { blankProfile, type ProfileEvent, type Profile, sampleProfile, summarize } from '@reboprofiles/core';
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { type EditorBlock, ProfileEditor, ProfileStats } from '../src';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let host: HTMLElement | undefined;
afterEach(async () => {
  await act(async () => root?.unmount());
  host?.remove();
});

async function mount(element: ReturnType<typeof createElement>) {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root!.render(element));
  // The preview's page, loaded.
  const frame = host.querySelector('iframe');
  if (frame) await act(async () => void frame.dispatchEvent(new Event('load')));
  return host;
}

/** What the preview shows now: the page it opened with, or what was written in it since. */
const preview = (h: HTMLElement) => {
  const frame = h.querySelector('iframe') as HTMLIFrameElement;
  return frame.contentDocument?.body?.innerHTML || frame.getAttribute('srcdoc') || '';
};

const click = (el: Element | null | undefined) => act(async () => (el as HTMLElement).click());
const type = async (el: Element | null | undefined, value: string) => {
  const input = el as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

describe('the editor', () => {
  it('adds a link, writes in it, and tells each change; the preview is the page itself', async () => {
    const changes: Profile[] = [];
    const h = await mount(createElement(ProfileEditor, { profile: { ...blankProfile(), name: 'Laura' }, onChange: (p) => changes.push(p), locale: 'es' }));
    const link = [...h.querySelectorAll('.rpe-add .rpe-action')].find((b) => b.textContent === 'Liga');
    await click(link);
    expect(changes.at(-1)?.blocks.map((b) => b.type)).toEqual(['link']);
    const fields = h.querySelectorAll('.rpe-block-fields input');
    await type(fields[0], 'Agenda una visita');
    await type(fields[2], 'https://example.com');
    expect(changes.at(-1)?.blocks[0]).toMatchObject({ label: 'Agenda una visita', url: 'https://example.com' });
    expect(preview(h)).toContain('Agenda una visita');
    expect(h.querySelector('.rpe-ok')?.textContent).toContain('No falta nada');
  });

  it('plays the entrance when what moves changes, and not at each letter', async () => {
    const h = await mount(createElement(ProfileEditor, { profile: sampleProfile('en') }));
    await type(h.querySelector('.rpe-part input.rpe-input'), 'Laura M');
    expect(preview(h)).toContain('data-entrance="none"');
    await click([...h.querySelectorAll('.rpe-chip')].find((b) => b.textContent === 'Zoom'));
    expect(preview(h)).toContain('data-entrance="zoom"');
    await type(h.querySelector('.rpe-part input.rpe-input'), 'Laura Mé');
    expect(preview(h)).toContain('data-entrance="none"');
  });

  it('chooses a theme, moves and takes away blocks', async () => {
    const changes: Profile[] = [];
    const start = sampleProfile('en');
    const h = await mount(createElement(ProfileEditor, { profile: start, onChange: (p) => changes.push(p) }));
    await click([...h.querySelectorAll('.rpe-theme')].find((b) => b.textContent === 'Midnight'));
    expect(changes.at(-1)?.theme).toBe('midnight');
    await click(h.querySelectorAll('.rpe-block')[1].querySelector('[aria-label="Move up"]'));
    expect(changes.at(-1)?.blocks[0].id).toBe(start.blocks[1].id);
    await click(h.querySelectorAll('.rpe-block')[0].querySelector('[aria-label="Remove"]'));
    expect(changes.at(-1)?.blocks).toHaveLength(start.blocks.length - 1);
  });

  it('adds the application’s own blocks, with what they ask and how they are drawn', async () => {
    const homes: EditorBlock = {
      kind: 'homes',
      label: 'Homes',
      data: () => ({ count: 2 }),
      layout: 'grid2',
      render: { html: (b, ctx) => ctx.items([{ title: `Home ${b.data.count}`, badge: '$1' }], b.layout, { block: b.id, type: 'custom' }) },
      Fields: ({ block, update }) => createElement('button', { type: 'button', className: 'more', onClick: () => update({ count: Number(block.data.count) + 1 }) }, 'More'),
    };
    const changes: Profile[] = [];
    const h = await mount(createElement(ProfileEditor, { profile: blankProfile({ name: 'A' }), onChange: (p) => changes.push(p), blocks: [homes] }));
    await click([...h.querySelectorAll('.rpe-add .rpe-action')].find((b) => b.textContent === 'Homes'));
    expect(changes.at(-1)?.blocks[0]).toMatchObject({ type: 'custom', kind: 'homes', layout: 'grid2', data: { count: 2 } });
    await click(h.querySelector('.more'));
    expect(changes.at(-1)?.blocks[0]).toMatchObject({ data: { count: 3 } });
    expect(preview(h)).toContain('Home 3');
  });
});

describe('sharing', () => {
  it('shows the QR code of the page’s address, and the ways to save and print it, once it has one', async () => {
    const h = await mount(createElement(ProfileEditor, { profile: sampleProfile('es'), locale: 'es', url: 'https://example.com/u/laura' }));
    expect(h.querySelector('.rpe-qr-code svg')?.getAttribute('aria-label')).toBe('https://example.com/u/laura');
    expect(h.querySelector('.rpe-qr-url')?.textContent).toBe('example.com/u/laura');
    expect([...h.querySelectorAll('.rpe-share .rpe-chip')].map((b) => b.textContent)).toEqual(['Póster', 'Tarjetas', 'Etiquetas']);
    const without = await mount(createElement(ProfileEditor, { profile: sampleProfile('es') }));
    expect(without.querySelector('.rpe-share')).toBeNull();
  });
});

describe('the numbers', () => {
  it('shows the visits, the visitors, the clicks and what was touched', async () => {
    const profile = sampleProfile('es');
    const events: ProfileEvent[] = [
      { type: 'view', at: '2026-10-30T12:00:00Z', visitor: 'a', source: 'instagram', device: 'mobile' },
      { type: 'view', at: '2026-10-30T12:00:00Z', visitor: 'b', source: 'direct', device: 'desktop' },
      { type: 'click', at: '2026-10-30T12:00:00Z', visitor: 'a', block: profile.blocks[1].id },
    ];
    const h = await mount(createElement(ProfileStats, { summary: summarize(events, { from: '2026-10-24', to: '2026-10-30', profile }), locale: 'es' }));
    expect([...h.querySelectorAll('.rps-number b')].map((b) => b.textContent?.replace(/\s/g, ' '))).toEqual(['2', '2', '1', '50 %', '0']);
    expect(h.querySelector('.rps-wide .rps-bar-label')).toBeTruthy();
    expect(h.textContent).toContain('Agenda una visita');
    expect(h.textContent).toContain('Directo');
    expect(h.textContent).toContain('Celular');
    expect(h.querySelectorAll('.rps-day')).toHaveLength(7);
  });
});
