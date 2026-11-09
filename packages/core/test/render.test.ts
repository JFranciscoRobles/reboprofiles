import { describe, expect, it } from 'vitest';
import { blankProfile, type CustomBlock, makeBlock, type Profile, readProfile, renderProfile, sampleProfile, themeOf, themes, videoPicture } from '../src';

const profile = (blocks: Profile['blocks'], more: Partial<Profile> = {}): Profile => ({ ...blankProfile({ name: 'Laura', ...more }), blocks });

describe('a profile’s page', () => {
  it('sends every address through what counts the clicks, with its block and its part', () => {
    const places: string[] = [];
    const { body } = renderProfile(sampleProfile('es'), {
      locale: 'es',
      link: (url, place) => (places.push(`${place.type}:${place.part ?? ''}`), `/c?u=${encodeURIComponent(url)}&b=${place.block}`),
    });
    expect(places).toEqual(expect.arrayContaining(['contact:whatsapp', 'contact:phone', 'contact:email', 'link:', 'socials:instagram', 'video:']));
    expect(body).not.toContain('href="https://example.com/visit"');
    expect(body).toContain('href="/c?u=https%3A%2F%2Fexample.com%2Fvisit&amp;b=');
    expect(body).toContain('>Llamar<');
  });

  it('writes WhatsApp’s address with the country’s code and the message', () => {
    const { body } = renderProfile(profile([{ id: 'c', type: 'contact', whatsapp: '664 123 4567', phone: '', email: '', message: 'Hola Laura' }]), { country: '52' });
    expect(body).toContain('href="https://wa.me/526641234567?text=Hola%20Laura"');
  });

  it('leaves out a block without what it needs, and an address no browser should follow', () => {
    const { body } = renderProfile(
      profile([
        { id: 'a', type: 'link', label: '', url: 'https://x.com', note: '', icon: '', highlight: 'none' },
        { id: 'b', type: 'link', label: 'Bad', url: 'javascript:alert(1)', note: '', icon: '', highlight: 'none' },
        { id: 'c', type: 'socials', links: { instagram: 'javascript:x' } },
      ]),
    );
    expect(body).not.toContain('javascript:');
    expect(body).not.toContain('rp-link');
    expect(body).not.toContain('rp-social');
  });

  it('escapes what was written', () => {
    const { body, html } = renderProfile(profile([{ id: 't', type: 'text', text: '<script>x</script>\nnext' }], { name: '<b>Laura</b>' }));
    expect(body).toContain('&lt;script&gt;x&lt;/script&gt;<br>next');
    expect(html).toContain('<title>&lt;b&gt;Laura&lt;/b&gt;</title>');
  });

  it('draws a gallery and a custom block’s items in the layout chosen, each item counted as its own', () => {
    const homes: CustomBlock = {
      html: (b, ctx) => ctx.items([{ title: 'Casa', badge: '$1', href: 'https://x.com/1', image: '/1.jpg' }], b.layout, { block: b.id, type: 'custom', part: 'home' }),
      complete: (b) => !!b.data.on,
    };
    const parts: string[] = [];
    const { body } = renderProfile(
      profile([
        { id: 'g', type: 'gallery', layout: 'grid3', pictures: [{ src: '/a.jpg', alt: 'A', href: '' }] },
        { ...makeBlock('custom', { kind: 'homes', layout: 'list' }), id: 'h' },
      ]),
      { custom: { homes }, link: (url, p) => (parts.push(p.part ?? ''), url) },
    );
    expect(body).toContain('class="rp-items rp-grid3"');
    expect(body).toContain('class="rp-items rp-list"');
    expect(parts).toContain('home:0');
  });

  it('tells the visit with what the visitor came from, and without scripts by a picture', () => {
    const { body } = renderProfile(profile([]), { view: 'https://x.com/v/abc' });
    expect(body).toContain('navigator.sendBeacon');
    expect(body).toContain('utm_campaign');
    expect(body).toContain('<noscript><img src="https://x.com/v/abc"');
    expect(renderProfile(profile([])).body).not.toContain('<script>');
  });

  it('draws each theme’s colours, the first in the accent', () => {
    expect(themes()).toHaveLength(9);
    expect(themes().filter((t) => t.background.includes('gradient')).length).toBeGreaterThanOrEqual(4);
    expect(themeOf('accent', '#ff0000').button).toBe('#ff0000');
    expect(renderProfile(profile([], { theme: 'midnight' })).body).toContain('--rp-button:linear-gradient');
  });

  it('moves as the profile says: its entrance, and the links that draw the eye; still when asked, and for whoever asks for less motion', () => {
    const p = { ...sampleProfile('en'), entrance: 'zoom' as const };
    const { body, css } = renderProfile(p);
    expect(body).toContain('data-entrance="zoom"');
    expect(body).toMatch(/class="rp-link rp-hl-pulse"/);
    expect(renderProfile(p, { motion: false }).body).toContain('data-entrance="none"');
    expect(css).toContain('@keyframes rp-zoom');
    expect(css).toMatch(/prefers-reduced-motion:reduce\)\{[^}]*animation:none/);
  });

  it('reads an entrance and a link’s motion only as one of theirs', () => {
    expect(readProfile({ entrance: 'spin', blocks: [{ type: 'link', highlight: 'explode' }] })).toMatchObject({ entrance: 'rise', blocks: [{ highlight: 'none' }] });
  });

  it('finds the picture of a YouTube video', () => {
    expect(videoPicture('https://youtu.be/aqz-KE-bpKQ')).toBe('https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg');
    expect(videoPicture('https://vimeo.com/1')).toBeNull();
  });
});
