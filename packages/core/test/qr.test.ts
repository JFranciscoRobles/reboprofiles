import jsQR from 'jsqr';
import { describe, expect, it } from 'vitest';
import { PRINT_FORMATS, type QrCorrection, qrCode, qrSvg, qrUrl, renderProfile, renderQrSheet, sampleProfile, shortUrl } from '../src';

/** What a reader makes of a code: drawn as a picture, four pixels a module, its quiet zone around it, and read. */
function read(text: string, correction: QrCorrection) {
  const { size, modules } = qrCode(text, correction);
  const scale = 4;
  const side = (size + 8) * scale;
  const pixels = new Uint8ClampedArray(side * side * 4).fill(255);
  modules.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (!dark) return;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const at = (((y + 4) * scale + dy) * side + (x + 4) * scale + dx) * 4;
          pixels[at] = pixels[at + 1] = pixels[at + 2] = 0;
        }
    }),
  );
  return jsQR(pixels, side, side)?.data;
}

describe('a QR code', () => {
  const texts = ['https://x.co', 'https://example.com/u/laura-mendez', `https://example.com/u/${'a'.repeat(120)}`, `https://example.com/?q=${'b'.repeat(260)}`];

  it('is read back as it was written, at every correction and size', () => {
    for (const correction of ['L', 'M', 'Q', 'H'] as const) for (const text of texts) expect(read(text, correction)).toBe(text);
  });

  it('is as small as holds its words, and its version says how large', () => {
    expect(qrCode('https://x.co', 'L').version).toBe(1);
    expect(qrCode('https://x.co', 'L').size).toBe(21);
    const long = qrCode(texts[3], 'H');
    expect(long.version).toBeGreaterThanOrEqual(7);
    expect(long.size).toBe(long.version * 4 + 17);
  });

  it('carries words of any language, as bytes', () => {
    expect(read('https://example.com/u/ñandú-méndez', 'M')).toBe('https://example.com/u/ñandú-méndez');
  });

  it('is drawn as SVG, its quiet zone around it', () => {
    const svg = qrSvg('https://x.co', { margin: 4 });
    expect(svg).toContain('viewBox="0 0 29 29"');
    expect(svg).toContain('<path d="M4 4h1v1h-1z');
  });

  it('refuses words no code holds', () => {
    expect(() => qrCode('x'.repeat(4000), 'H')).toThrow();
  });
});

describe('a code that says where it was scanned', () => {
  it('marks the address with the piece it is on, after what it has', () => {
    expect(qrUrl('https://x.com/u/laura', 'poster')).toBe('https://x.com/u/laura?qr=poster');
    expect(qrUrl('https://x.com/u/laura?lang=es#top', 'cards')).toBe('https://x.com/u/laura?lang=es&qr=cards#top');
    expect(qrUrl('https://x.com/u/laura', 'Not a piece!')).toBe('https://x.com/u/laura');
  });

  it('prints each sheet with its own mark, read back from its code', () => {
    const html = renderQrSheet(sampleProfile('en'), 'https://x.com/u/laura', { format: 'cards' });
    expect(html).toContain('<svg');
    expect(read(qrUrl('https://x.com/u/laura', 'cards'), 'Q')).toBe('https://x.com/u/laura?qr=cards');
  });

  it('has the page tell its visit with the mark it came by', () => {
    expect(renderProfile(sampleProfile('en'), { view: 'https://x.com/p/v/t' }).body).toContain('"qr"');
  });
});

describe('the sheets to print', () => {
  it('makes a poster, cards and stickers, each a letter page with the code and the address', () => {
    const url = 'https://example.com/u/laura-mendez';
    for (const format of PRINT_FORMATS) {
      const html = renderQrSheet(sampleProfile('es'), url, { format, locale: 'es' });
      expect(html).toContain('@page{size:letter');
      expect(html).toContain('<svg');
      expect(html).toContain('Laura Méndez');
    }
    expect(renderQrSheet(sampleProfile('es'), url, { format: 'cards' }).match(/class="card"/g)).toHaveLength(10);
    expect(renderQrSheet(sampleProfile('es'), url, { format: 'stickers', locale: 'es' })).toContain('Escanéame');
    expect(shortUrl(url)).toBe('example.com/u/laura-mendez');
  });
});
