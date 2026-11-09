# Before it is shared

`problemsOf(profile)` says what a profile lacks, in the order it is read; `describeProblem(problem, locale)` says it in words, in English or Spanish.

```ts
import { describeProblem, problemsOf } from '@reboprofiles/core';

for (const p of problemsOf(profile, { custom })) console.log(describeProblem(p, 'en'));
// Your name is missing.
// The link block is missing something.
```

## What it finds

| Code | When |
| --- | --- |
| `no-name` | The profile has no name. |
| `no-blocks` | It has no blocks. |
| `incomplete` | A block without what it needs to show anything: a link without its words or its address, a contact without a way to reach them. A custom block says so itself, by its `complete`. |
| `bad-link` | An address no browser should follow: `javascript:`, a page of another site's without its `https:`. |

The editor shows them beside the page, under *Before you share it*.
