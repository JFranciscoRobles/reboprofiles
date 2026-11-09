# Share and print

A profile is shared by its address, and by its QR code: on a card, a poster in a window, a sticker on a sign. The engine makes the code itself, with nothing else to install.

## The QR code

```ts
import { qrCode, qrSvg } from '@reboprofiles/core';

qrSvg('https://example.com/u/laura', { correction: 'Q', margin: 4 }); // an SVG, sharp at any size
qrCode('https://example.com/u/laura'); // { version, size, modules: boolean[][] }, to draw it as you like
```

Its words go as bytes (any language), in the smallest version that holds them, with its error correction (`L`, `M`, `Q` or `H`: 7, 15, 25 or 30 parts in a hundred may be lost) and the mask a reader trips on least, as ISO/IEC 18004 says. Its tests read it back with another library's reader.

## Its scans, counted

`qrUrl(url, piece)` marks the address with the piece it is on: `https://example.com/u/laura?qr=poster`. The page tells its visit with that mark, and the server counts it as a scan of that piece: [the numbers](/docs/numbers/) say how many came by the code, and from which. The sheets mark their codes by their format; the editor's SVG and PNG, as `file`.

## To print

```ts
import { renderQrSheet } from '@reboprofiles/core';

const html = renderQrSheet(profile, 'https://example.com/u/laura', { format: 'cards', locale: 'en' });
```

| Format | What it is |
| --- | --- |
| `poster` | A letter page: *Scan me*, the photo, the name, what they do, the code large and the address under it. |
| `cards` | Ten business cards a letter page, each its code, the name and the address, with lines to cut them by. |
| `stickers` | Six squares of three inches a page, each its code and the name. |

Each is a document whole, in the profile's colours, ready for the browser's printing (`@page` letter).

## In the editor

Give `ProfileEditor` the page's address and it shows *Share*: the code, saved as SVG (for a printer) or PNG (for a post), the address to copy, and the sheets to print.

```tsx
<ProfileEditor profile={profile} onChange={save} url={`https://example.com/u/${slug}`} />
```

<demo name="editor" />
