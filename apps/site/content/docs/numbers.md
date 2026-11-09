# The numbers

`summarize(events, options)` counts what the events come to over some days; `ProfileStats` draws it.

<demo name="stats" />

## Counting

```ts
import { summarize } from '@reboprofiles/core';

const s = summarize(events, { from: '2026-10-01', to: '2026-10-30', timeZone: 'America/Mexico_City', profile, locale: 'en' });
```

| Option | What it is |
| --- | --- |
| `from` · `to` | The days counted, both in, as `YYYY-MM-DD`. The last thirty if left out. |
| `timeZone` | The time zone each day is: a visit at 11 p.m. in Tijuana is that day's. UTC unless said. |
| `profile` · `locale` | What was touched, named: a link by its words, a network by its name. |

## What it gives

| Field | What it is |
| --- | --- |
| `views` · `visitors` · `clicks` | Visits; visitors, each once a day; clicks. |
| `clickRate` | Of the visitors, how many touched something: 0 to 1. |
| `days` | Each day, its visits, visitors and clicks, the days without any too. |
| `touched` | What was touched, the most first: its block, its part, its name, its clicks, and of the visitors how many touched it. |
| `scans` · `scanned` | The visits that came by the page's QR code, and those by the piece scanned: a poster, cards, stickers, a file. Each day says its `scans` too. |
| `sources` · `devices` · `countries` · `campaigns` | Each counted, the most first. |

## Drawing it

```tsx
import { ProfileStats } from '@reboprofiles/react';

<ProfileStats summary={s} locale="en" />;
```

It is drawn from the summary alone: count where you keep the events, on the server or in the page.
