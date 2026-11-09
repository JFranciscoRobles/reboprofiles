# The page

`renderProfile(profile, options)` makes a profile into its page: `html`, a document whole, to answer with as it is; and `css` and `body`, to put in a page of your own.

```ts
import { renderProfile } from '@reboprofiles/core';

const { html, css, body, title, description } = renderProfile(profile, {
  locale: 'es',
  country: '52',
  link: tracker.linkFor(id),
  view: tracker.view(id),
});
```

<demo name="page" />

## Its options

| Option | What it is |
| --- | --- |
| `locale` | `'en'` or `'es'`: the words of its buttons. |
| `link` | What each address goes through, with where it is: `(url, { block, type, part })`. As it is, if not given. |
| `view` | Where the visit is told. None: not told. |
| `country` | The code a phone of ten digits is given for WhatsApp: `52`. |
| `base` | Where an address that starts with `/` is. |
| `custom` | How to draw your blocks, by their kind. |
| `canonical` · `footer` | The page's own address; a line at the foot with its link. |
| `motion` | Whether it moves as it opens; true unless said. |

## What it is made of

Plain HTML and one stylesheet: no framework, no script but the beacon of the visit. Its words are escaped, its addresses only those a browser may follow (`https:`, `mailto:`, `tel:`, the page's own), and a block without what it needs is left out.

On a server, `profileResponse(profile, { id, tracker, … })` gives it as a `Response`, with its links and its visit already counted: see [Visits and clicks](/docs/tracking/).
