# Blocks

A `Profile` is who someone is, on top, and their blocks below, one under another.

```ts
interface Profile {
  name: string;
  headline: string; // what they do, in a line
  bio: string;
  photo: string | null; // an address, or a data: address
  location: string;
  badge: string; // a licence: a mark beside the name
  theme: ThemeId;
  accent: string; // #rrggbb, of the `accent` theme
  entrance: Entrance;
  blocks: Block[];
}
```

## The blocks

| Block | What it is |
| --- | --- |
| `link` | Words and where they go, a second line, an emoji, and a motion to draw the eye (`highlight`). |
| `contact` | WhatsApp (with its first message written), a call and an email, each a button when given. |
| `socials` | Instagram, Facebook, TikTok, YouTube, LinkedIn, X, WhatsApp and a website, as icons. |
| `heading` · `text` | Words; a line break where it is written. |
| `image` | A picture, linked or not. |
| `gallery` | Pictures, in one of the five layouts. |
| `video` | A picture of it and the way to it: YouTube's picture is found by itself. |
| `divider` | A line. |
| `custom` | Your application's own: see [Blocks of your own](/docs/custom-blocks/). |

## Five layouts

A gallery, and any custom block of many things, is laid out as `cards` (one a row), `grid2` (two), `grid3` (a mosaic of three, the badge over the picture), `list` (a small picture and its words beside it) or `carousel` (a row to slide).

## Made, read and moved

```ts
import { insertBlock, makeBlock, moveBlock, readProfile, removeBlock, updateBlock } from '@reboprofiles/core';

let blocks = insertBlock(profile.blocks, makeBlock('link'));
blocks = updateBlock(blocks, id, { label: 'Book a visit', url: 'https://…' });
blocks = moveBlock(blocks, id, 0);
const profile = readProfile(JSON.parse(saved)); // only what each block may have
```

Every one gives a new list: nothing is changed in place.
