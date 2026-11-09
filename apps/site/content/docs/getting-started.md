# Getting started

The editor in a React page, the page and its routes on a server, and the numbers: the three ways in, each in a few lines.

## Put the editor in your app

```bash
npm install @reboprofiles/react
```

```tsx
'use client';
import '@reboprofiles/react/styles.css';
import { type Profile, sampleProfile } from '@reboprofiles/core';
import { ProfileEditor } from '@reboprofiles/react';

export function MyPage({ saved }: { saved?: Profile }) {
  return <ProfileEditor profile={saved ?? sampleProfile('en')} onChange={save} locale="en" />;
}
```

The profile is a plain object: keep it as JSON, and read it back with `readProfile(json)`, which keeps only what each block may have.

## Give the page, and count it

```bash
npm install @reboprofiles/server
```

```ts
import { readProfile } from '@reboprofiles/core';
import { createProfileHandler, createTracker, profileResponse } from '@reboprofiles/server';

const secret = process.env.PROFILES_SECRET!; // long and random
const tracker = createTracker({ secret, base: 'https://example.com' });
const routes = createProfileHandler({ tracker, secret, onEvent: (event) => db.events.insert(event) });

// GET /u/:slug — the page, its links through the tracker
export const page = (row) => profileResponse(readProfile(row.profile), { id: row.id, tracker, locale: 'en' });
// GET and POST /p/* — its visits and clicks
export const track = (request: Request) => routes(request);
```

## Show the numbers

```tsx
import { summarize } from '@reboprofiles/core';
import { ProfileStats } from '@reboprofiles/react';

const summary = summarize(events, { profile, timeZone: 'America/Mexico_City' });
<ProfileStats summary={summary} />;
```

## Run the repository

```bash
git clone https://github.com/JFranciscoRobles/reboprofiles && cd reboprofiles
npm install
npm run dev    # the playground on :5310: the editor, /u/demo counted as it is visited, its numbers
npm test
```
