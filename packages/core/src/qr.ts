// A QR code of the page's address, made here, for people to print it (a card,
// a poster, a sticker) and to scan it: its words as bytes, the version as small
// as holds them, its error correction (Reed–Solomon, in blocks interleaved),
// its patterns, and the mask that leaves the fewest marks a reader trips on,
// as ISO/IEC 18004 says. The tables of each version's blocks and the way of
// drawing it follow Project Nayuki's QR Code generator (MIT).

/** How much of it may be lost and still be read: 7, 15, 25 or 30 parts in a hundred. */
export type QrCorrection = 'L' | 'M' | 'Q' | 'H';

export interface QrCode {
  version: number;
  /** How many modules a side. */
  size: number;
  /** Each row, each module: dark or not. */
  modules: boolean[][];
}

const FORMAT_BITS: Record<QrCorrection, number> = { L: 1, M: 0, Q: 3, H: 2 };
const LEVEL: Record<QrCorrection, number> = { L: 0, M: 1, Q: 2, H: 3 };
// Of each correction (L, M, Q, H) and version (1 to 40): the codewords of correction of a block, and how many blocks.
const ECC_PER_BLOCK = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
];
const BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
];

/** The modules of a version that hold data and its correction: all but the patterns and the format. */
function rawModules(ver: number) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const align = Math.floor(ver / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}
const dataCodewords = (ver: number, c: QrCorrection) => Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[LEVEL[c]][ver] * BLOCKS[LEVEL[c]][ver];

/** The product of two bytes in the field Reed–Solomon counts in. */
function multiply(x: number, y: number) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}
function divisor(degree: number) {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = multiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = multiply(root, 0x02);
  }
  return result;
}
function remainder(data: number[], by: number[]) {
  const result = new Array<number>(by.length).fill(0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    by.forEach((coefficient, i) => (result[i] ^= multiply(coefficient, factor)));
  }
  return result;
}

/** The words as the code carries them: their bytes, the version as small as holds them, padded to its length. */
function encode(text: string, correction: QrCorrection) {
  const bytes = [...new TextEncoder().encode(text)];
  for (let ver = 1; ver <= 40; ver++) {
    const countBits = ver <= 9 ? 8 : 16;
    const capacity = dataCodewords(ver, correction) * 8;
    if (4 + countBits + bytes.length * 8 > capacity) continue;
    const bits: number[] = [];
    const put = (value: number, length: number) => {
      for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
    };
    put(0b0100, 4); // bytes
    put(bytes.length, countBits);
    for (const b of bytes) put(b, 8);
    put(0, Math.min(4, capacity - bits.length));
    put(0, (8 - (bits.length % 8)) % 8);
    for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) put(pad, 8);
    const words: number[] = [];
    for (let i = 0; i < bits.length; i += 8) words.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
    return { ver, words };
  }
  throw new Error('Too long for a QR code.');
}

/** The data and its correction, in blocks, read one byte of each block in turn. */
function interleave(data: number[], ver: number, c: QrCorrection) {
  const numBlocks = BLOCKS[LEVEL[c]][ver];
  const eccLength = ECC_PER_BLOCK[LEVEL[c]][ver];
  const raw = Math.floor(rawModules(ver) / 8);
  const shortBlocks = numBlocks - (raw % numBlocks);
  const shortLength = Math.floor(raw / numBlocks);
  const by = divisor(eccLength);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const part = data.slice(k, k + shortLength - eccLength + (i < shortBlocks ? 0 : 1));
    k += part.length;
    const ecc = remainder(part, by);
    if (i < shortBlocks) part.push(0);
    blocks.push([...part, ...ecc]);
  }
  const result: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((block, j) => (i !== shortLength - eccLength || j >= shortBlocks) && result.push(block[i]));
  return result;
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** How much a reader would trip on it: long runs, squares of one colour, what looks like a finder, too much of one. */
function penalty(m: boolean[][]) {
  const size = m.length;
  let score = 0;
  const lines = [...m, ...m.map((_, x) => m.map((row) => row[x]))];
  const finder = [true, false, true, true, true, false, true];
  for (const line of lines) {
    for (let i = 0, run = 1; i < size; i++, run++) {
      if (i === size - 1 || line[i] !== line[i + 1]) {
        if (run >= 5) score += 3 + run - 5;
        run = 0;
      }
    }
    for (let i = 0; i + 7 <= size; i++) {
      if (!finder.every((v, k) => line[i + k] === v)) continue;
      const before = i >= 4 && [1, 2, 3, 4].every((k) => !line[i - k]);
      const after = i + 11 <= size && [7, 8, 9, 10].every((k) => !line[i + k]);
      if (before || after) score += 40;
    }
  }
  for (let y = 0; y + 1 < size; y++) for (let x = 0; x + 1 < size; x++) if (m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) score += 3;
  const dark = m.flat().filter(Boolean).length;
  const total = size * size;
  score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return score;
}

/** A QR code of `text`: its version the smallest that holds it, its correction `M` unless said. */
export function qrCode(text: string, correction: QrCorrection = 'M'): QrCode {
  const { ver, words } = encode(text, correction);
  const size = ver * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fixed = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const set = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    fixed[y][x] = true;
  };

  // The patterns: the timing lines, the three finders, the alignments.
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ])
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4);
      }
  const positions: number[] = [];
  if (ver > 1) {
    const count = Math.floor(ver / 7) + 2;
    const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (count * 2 - 2)) * 2;
    positions.push(6);
    for (let pos = size - 7; positions.length < count; pos -= step) positions.splice(1, 0, pos);
  }
  const last = positions.length - 1;
  positions.forEach((px, i) =>
    positions.forEach((py, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }),
  );

  // Where the format and the version go, kept, drawn when the mask is chosen.
  const format = (mask: number, mark: (x: number, y: number, dark: boolean) => void) => {
    const data = (FORMAT_BITS[correction] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) mark(8, i, bit(i));
    mark(8, 7, bit(6));
    mark(8, 8, bit(7));
    mark(7, 8, bit(8));
    for (let i = 9; i < 15; i++) mark(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) mark(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) mark(8, size - 15 + i, bit(i));
    mark(8, size - 8, true);
  };
  format(0, set);
  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, dark);
      set(b, a, dark);
    }
  }

  // The data, two columns at a time, up and down, from the right.
  const data = interleave(words, ver, correction);
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++)
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (!fixed[y][x] && i < data.length * 8) {
          modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
          i++;
        }
      }
  }

  // The mask with the least penalty.
  let best: boolean[][] = modules;
  let bestScore = Number.POSITIVE_INFINITY;
  MASKS.forEach((mask, n) => {
    const masked = modules.map((row, y) => row.map((dark, x) => (fixed[y][x] ? dark : dark !== mask(x, y))));
    format(n, (x, y, dark) => (masked[y][x] = dark));
    const score = penalty(masked);
    if (score < bestScore) {
      bestScore = score;
      best = masked;
    }
  });
  return { version: ver, size, modules: best };
}

/** The piece of paper (or file) a code is on, as the visits it brings say it: a poster, a card, a sticker, a file saved. */
export const QR_PIECE = /^[a-z0-9-]{1,20}$/;

/**
 * The address a code goes to, with the piece it is on (`?qr=poster`): the page's visit then says it came by the code,
 * and from which. One short mark, for the code to stay small.
 */
export function qrUrl(url: string, piece: string) {
  if (!QR_PIECE.test(piece)) return url;
  const [path, hash = ''] = url.split('#');
  return `${path}${path.includes('?') ? '&' : '?'}qr=${piece}${hash ? `#${hash}` : ''}`;
}

/** A QR code as SVG: one path of its dark modules, its quiet zone around it (`margin` modules, 4 unless said). */
export function qrSvg(text: string, options: { correction?: QrCorrection; margin?: number; color?: string; background?: string; title?: string } = {}) {
  const { size, modules } = qrCode(text, options.correction ?? 'M');
  const margin = options.margin ?? 4;
  const side = size + margin * 2;
  let d = '';
  modules.forEach((row, y) => row.forEach((dark, x) => dark && (d += `M${x + margin} ${y + margin}h1v1h-1z`)));
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}" shape-rendering="crispEdges" role="img" aria-label="${esc(options.title ?? text)}"><rect width="${side}" height="${side}" fill="${esc(options.background ?? '#ffffff')}"/><path d="${d}" fill="${esc(options.color ?? '#000000')}"/></svg>`;
}
