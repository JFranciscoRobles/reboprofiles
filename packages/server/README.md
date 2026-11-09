# @reboprofiles/server

What a profile's page needs of a server, for [ReboProfiles](../../README.md): the page with its links signed, and the routes its visits and clicks come back to, each told to your application as an event. Nothing kept, no cookies: a visitor is a mark of their connection made anew each day. Robots and the previews apps make of a link are never counted.

```ts
import { createProfileHandler, createTracker, profileResponse } from '@reboprofiles/server';

const tracker = createTracker({ secret: process.env.PROFILES_SECRET!, base: 'https://example.com' });
const routes = createProfileHandler({ tracker, secret: process.env.PROFILES_SECRET!, onEvent: (event) => db.events.insert(event) });

profileResponse(profile, { id: profile.id, tracker, locale: 'en' }); // GET /u/:slug
routes(request); // GET and POST /p/*
```

The routes are a function from a `Request` to a `Response`: a route of Next.js, a Worker, Bun, or `node:http` by `nodeHandler`.
