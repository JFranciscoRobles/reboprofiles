# @reboprofiles/react

The editor of a profile for React, from [ReboProfiles](../../README.md): its form beside the page as it will be shared, the nine themes and the motion, each block a card, the application's own blocks with what they ask; and the numbers of its visits and clicks.

```tsx
import '@reboprofiles/react/styles.css';
import { summarize } from '@reboprofiles/core';
import { ProfileEditor, ProfileStats } from '@reboprofiles/react';

<ProfileEditor profile={profile} onChange={save} locale="es" blocks={[myBlock]} />
<ProfileStats summary={summarize(events, { profile, locale: 'es' })} locale="es" />
```

Its look is set by custom properties on `.rpe` and `.rps` (`--rp-brand`, `--rp-line`, …), light and dark; `data-theme="light"` on them fixes it.
