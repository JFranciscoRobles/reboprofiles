import { describe, expect, it } from 'vitest';
import { BLOCK_TYPES, duplicateBlock, insertBlock, makeBlock, moveBlock, readProfile, removeBlock, safeUrl, slugOf, updateBlock } from '../src';

describe('reading a profile', () => {
  it('keeps only what each block has, as long as it may be, and leaves out what is not a block', () => {
    const p = readProfile({
      name: 'A'.repeat(200),
      theme: 'nope',
      accent: 'red',
      blocks: [{ type: 'link', label: 'Go', url: 'https://x.com', extra: 1 }, { type: 'script' }, { type: 'custom' }, { type: 'gallery', layout: 'grid9', pictures: [{ src: '/a.jpg' }] }],
    });
    expect(p.name).toHaveLength(80);
    expect(p.theme).toBe('accent');
    expect(p.accent).toBe('#3b63fb');
    expect(p.blocks.map((b) => b.type)).toEqual(['link', 'gallery']);
    expect(p.blocks[0]).toMatchObject({ label: 'Go', url: 'https://x.com', note: '', icon: '' });
    expect(p.blocks[0]).not.toHaveProperty('extra');
    expect(p.blocks[1]).toMatchObject({ layout: 'grid3', pictures: [{ src: '/a.jpg', alt: '', href: '' }] });
  });

  it('keeps a photo that is a picture of its own or an address that may be followed, and nothing else', () => {
    expect(readProfile({ photo: 'data:image/jpeg;base64,AAAA' }).photo).toBe('data:image/jpeg;base64,AAAA');
    expect(readProfile({ photo: 'https://x.com/me.jpg' }).photo).toBe('https://x.com/me.jpg');
    expect(readProfile({ photo: 'javascript:alert(1)' }).photo).toBeNull();
  });

  it('makes each type as it starts', () => {
    for (const type of BLOCK_TYPES) expect(makeBlock(type).type).toBe(type);
    expect(makeBlock('custom', { kind: 'homes', layout: 'grid2' })).toMatchObject({ kind: 'homes', layout: 'grid2', data: {} });
  });
});

describe('addresses', () => {
  it('follows only the web, a mail, a phone and the page’s own', () => {
    for (const ok of ['https://x.com', 'mailto:a@b.co', 'tel:+52 664 123 4567', '/homes']) expect(safeUrl(ok)).toBe(true);
    for (const bad of ['javascript:alert(1)', '//evil.com', 'data:text/html,x', 'x.com']) expect(safeUrl(bad)).toBe(false);
  });

  it('makes a page’s address of words', () => {
    expect(slugOf('  Laura Méndez Ñandú! ')).toBe('laura-mendez-nandu');
  });
});

describe('the list of blocks', () => {
  it('puts, moves, changes, copies and takes away, each giving a new list', () => {
    const [a, b, c] = ['heading', 'text', 'divider'].map((t) => makeBlock(t as 'heading'));
    let list = insertBlock(insertBlock([a], c), b, 1);
    expect(list.map((x) => x.id)).toEqual([a.id, b.id, c.id]);
    list = moveBlock(list, a.id, 2);
    expect(list.map((x) => x.id)).toEqual([b.id, c.id, a.id]);
    list = updateBlock(list, a.id, { text: 'Hi' });
    expect(list[2]).toMatchObject({ id: a.id, text: 'Hi' });
    const copied = duplicateBlock(list, a.id);
    expect(copied).toHaveLength(4);
    expect(copied[3]).toMatchObject({ type: 'heading', text: 'Hi' });
    expect(copied[3].id).not.toBe(a.id);
    expect(removeBlock(copied, b.id).map((x) => x.id)).not.toContain(b.id);
  });
});
