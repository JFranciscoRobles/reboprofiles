# @reboprofiles/core

The engine of [ReboProfiles](../../README.md): a profile of blocks (links, the buttons to reach someone, their networks, words, pictures, a video, and blocks of the application's own), its nine themes and its motion, reading what is given, the page's HTML with every link counted by its block, what it lacks before it is shared, and the numbers of its visits and clicks. No DOM: it runs in the browser, Node, Deno, Bun and Workers.

```ts
import { insertBlock, makeBlock, problemsOf, readProfile, renderProfile, summarize } from '@reboprofiles/core';

let profile = readProfile(JSON.parse(saved));
profile = { ...profile, blocks: insertBlock(profile.blocks, { ...makeBlock('link'), label: 'Book a visit', url: 'https://example.com/visit', highlight: 'pulse' }) };

problemsOf(profile); // []
const { html } = renderProfile(profile, { locale: 'en', link: (url, place) => track(url, place) });
const { views, visitors, clicks, touched, sources } = summarize(events, { profile });
```

Everything is immutable: each function gives a new profile or list, and the blocks it did not touch are the same objects as before.
