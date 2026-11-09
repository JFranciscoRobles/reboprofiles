# Visits and clicks

`@reboprofiles/server` counts what becomes of a page: each visit, and each click on its way to where it goes. It keeps nothing: each is an event your application is told, and keeps.

## The tracker

```ts
import { createTracker } from '@reboprofiles/server';

const tracker = createTracker({ secret: process.env.PROFILES_SECRET!, base: 'https://example.com', prefix: '/p' });
```

It signs each profile's addresses. A link is marked with where it goes and where it is in the page: no one can make up a visit to another profile, nor send a link anywhere it was not sent to.

## The routes

```ts
import { createProfileHandler } from '@reboprofiles/server';

const routes = createProfileHandler({
  tracker,
  secret: process.env.PROFILES_SECRET!,
  onEvent: (event) => db.events.insert(event),
  fallback: 'https://example.com',
});
```

| Route | What it does |
| --- | --- |
| `POST /p/v/:token` | The visit, told by the page's beacon: where it came from, the campaign of its address, how wide the screen is. |
| `GET /p/v/:token` | The visit without scripts, by a picture. |
| `GET /p/c/:token?u=…&b=…&p=…&s=…` | A click, counted on its way: then where it goes. A link not made here goes to `fallback`. |

It is a function from a `Request` to a `Response`: a route of Next.js, a Worker, Bun, or `node:http` by `nodeHandler`.

## The events

```ts
{ type: 'view' | 'click', profile, at, visitor, block?, part?, url?, source?, campaign?, qr?, device?, country? }
```

| Field | What it is |
| --- | --- |
| `visitor` | A mark of the connection and the browser, made anew each day: who came back today, not who they are. No cookie is set. |
| `block` · `part` | Of a click: the block, and which of its parts (`whatsapp`, `instagram`, `home:2`). |
| `source` | The campaign's source if the address says one; else the site it came from by its name: `instagram`, `tiktok`, `whatsapp`, `google`; else `direct`. |
| `qr` | Of a visit by the page's QR code: the piece it was scanned from (`poster`, `cards`, `stickers`, `file`), as the code's address says it (`?qr=cards`); its `source` is then `qr`. |
| `device` | `mobile`, `tablet` or `desktop`. |
| `country` | Two letters, when the CDN in front says it: Cloudflare's, Vercel's, Fastly's. |

Robots and the previews apps make of a link (WhatsApp's, Facebook's) are never counted.
