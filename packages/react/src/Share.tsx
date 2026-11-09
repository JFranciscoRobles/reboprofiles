// The page's QR code beside the editor, for people to scan it from paper: the
// code of its address, saved as SVG (for a printer, sharp at any size) or as
// PNG (for a post, a document), and printed as a poster, cards or stickers in
// the profile's colours.

import { type Locale, PRINT_FORMATS, type PrintFormat, type Profile, qrCode, qrSvg, qrUrl, renderQrSheet, shortUrl, slugOf } from '@reboprofiles/core';
import { useMemo, useState } from 'react';
import { WORDS } from './i18n';

/** Bytes saved as a file of this name. */
function save(blob: Blob, name: string) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** The code as a PNG `side` pixels a side, its quiet zone around it. */
function png(url: string, side = 1024): Promise<Blob> {
  const { size, modules } = qrCode(url, 'Q');
  const canvas = Object.assign(document.createElement('canvas'), { width: side, height: side });
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('No 2D canvas here.'));
  const cell = side / (size + 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, side, side);
  ctx.fillStyle = '#000000';
  modules.forEach((row, y) => row.forEach((dark, x) => dark && ctx.fillRect(Math.floor((x + 2) * cell), Math.floor((y + 2) * cell), Math.ceil(cell), Math.ceil(cell))));
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('The canvas made no picture.'))), 'image/png'));
}

export function ProfileShare({ profile, url, locale = 'en' }: { profile: Profile; url: string; locale?: Locale }) {
  const w = WORDS[locale].share;
  const [format, setFormat] = useState<PrintFormat>('poster');
  // The code saved goes to the address with its mark (`?qr=file`): its scans are counted as the file's.
  const coded = qrUrl(url, 'file');
  const svg = useMemo(() => qrSvg(coded, { correction: 'Q', margin: 2, title: url }), [coded, url]);
  const file = slugOf(profile.name) || 'profile';
  const print = () => {
    const sheet = window.open('', '_blank');
    if (!sheet) return;
    sheet.document.write(renderQrSheet(profile, url, { format, locale }));
    sheet.document.close();
    // Once its pictures are in (the photo, if it is an address), or a moment after: once.
    let printed = false;
    const go = () => {
      if (printed) return;
      printed = true;
      sheet.focus();
      sheet.print();
    };
    sheet.addEventListener('load', go);
    setTimeout(go, 800);
  };
  return (
    <div className="rpe-share">
      <p className="rpe-label">{w.title}</p>
      <div className="rpe-qr">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the code drawn here as SVG, of the profile's own address. */}
        <span className="rpe-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
        <span className="rpe-qr-words">
          <a href={url} target="_blank" rel="noreferrer" className="rpe-qr-url">
            {shortUrl(url)}
          </a>
          <span className="rpe-layouts">
            <button type="button" className="rpe-button" onClick={() => save(new Blob([svg], { type: 'image/svg+xml' }), `qr-${file}.svg`)}>
              SVG
            </button>
            <button type="button" className="rpe-button" onClick={() => void png(coded).then((b) => save(b, `qr-${file}.png`))}>
              PNG
            </button>
            <button type="button" className="rpe-button" onClick={() => void navigator.clipboard?.writeText(url)}>
              {w.copy}
            </button>
          </span>
        </span>
      </div>
      <fieldset className="rpe-field rpe-group">
        <legend>{w.print}</legend>
        <span className="rpe-layouts">
          {PRINT_FORMATS.map((f) => (
            <button key={f} type="button" className="rpe-chip" aria-pressed={format === f} onClick={() => setFormat(f)}>
              {w.formats[f]}
            </button>
          ))}
        </span>
      </fieldset>
      <button type="button" className="rpe-button rpe-primary" onClick={print}>
        {w.printIt}
      </button>
    </div>
  );
}
