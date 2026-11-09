<p align="center">
  <img src="apps/site/public/logo.svg" alt="" width="64" height="64">
</p>

<h1 align="center">ReboProfiles</h1>

<p align="center">
  Profile pages for your application, with their numbers.<br>
  One address with who someone is, how to reach them, their links and what they offer; and what each visitor touched.
</p>

<p align="center">
  <a href="https://reboprofiles.com/"><b>Site</b></a> ·
  <a href="https://reboprofiles.com/docs/">Documentation</a> ·
  <a href="https://reboprofiles.com/docs/getting-started/">Getting started</a> ·
  <a href="https://reboprofiles.com/docs/status/">Status</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2e6b3c" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/tests-51%20passing-2e6b3c" alt="51 tests passing">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6" alt="TypeScript">
</p>

---

ReboProfiles makes the one page someone puts in their Instagram, their
email or their card: their photo, what they do, the buttons to write or call
them, their links, their networks, words, pictures, a video, and blocks of
your application's own (the homes an agent sells, the dishes of a cook). It
is written in a form beside the page as it will look, in one of nine themes.

And it counts. Every link of the page goes through your server with the
block it is in, and every visit says where it came from: you know how many
came, how many touched something and what, by day, from which network, on
what and by which campaign. Without cookies, and without a service of
someone else's.

People find it from paper too: the engine makes the page's QR code
itself, and sheets to print it as a poster, cards or stickers; each piece
marks its code, so you know how many came by each one.

It keeps nothing of its own. The profile is JSON your application keeps;
the visits and clicks are events it is told, and gives back to be counted.

## Quick start

```bash
npm install @reboprofiles/react @reboprofiles/server
```

The editor, in your application:

```tsx
'use client';
import '@reboprofiles/react/styles.css';
import { ProfileEditor } from '@reboprofiles/react';

<ProfileEditor profile={profile} onChange={save} locale="es" />;
```

The page, and the routes its visits and clicks come back to:

```ts
import { createProfileHandler, createTracker, profileResponse } from '@reboprofiles/server';

const tracker = createTracker({ secret: process.env.PROFILES_SECRET!, base: 'https://example.com' });
const routes = createProfileHandler({ tracker, secret: process.env.PROFILES_SECRET!, onEvent: (e) => db.events.insert(e) });

// GET /u/:slug
profileResponse(profile, { id: profile.id, tracker, locale: 'es' });
// GET|POST /p/*
routes(request);
```

Its numbers:

```tsx
import { summarize } from '@reboprofiles/core';
import { ProfileStats } from '@reboprofiles/react';

<ProfileStats summary={summarize(events, { profile, locale: 'es' })} locale="es" />;
```

## Packages

| Package | What it is |
| --- | --- |
| `@reboprofiles/core` | The engine, without a DOM: a profile of blocks, its nine themes, reading what is given, the page's HTML, what it lacks, and the events counted (`summarize`). |
| `@reboprofiles/server` | The page with its links signed, and the routes its visits and clicks come back to, as a `Request` → `Response` handler or for `node:http`. |
| `@reboprofiles/react` | The editor (form and page side by side) and the numbers (`ProfileStats`), as components and parts. |

## What it counts

| | |
| --- | --- |
| Visits and visitors | Each visit; each visitor once a day, by a mark of their connection made anew each day: who came back today, not who they are. |
| Clicks | Each link, button, network and item, by the block it is in and its part (`contact` · `whatsapp`). |
| Where from | The campaign of the address (`utm_source`, `utm_campaign`), else the site it came from: Instagram, TikTok, WhatsApp, Google. |
| On what, from where | A phone, a tablet or a computer; the country, when the CDN in front says it. |
| Never | Robots, and the previews apps make of a link. |

## Develop

```bash
npm install
npm run dev     # the playground, on :5310: the editor, /u/demo and its numbers
npm run site    # the site and its documentation, on :5311
npm test        # vitest
npm run typecheck && npm run lint
```

## License

MIT
