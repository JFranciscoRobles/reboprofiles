# Themes and motion

## Nine themes

`accent` (the profile's own colour), `light`, `dark`, `sand`, `forest`, and four gradients: `ocean`, `sunset`, `aurora`, `midnight`. Each says what the page is drawn with: what is behind it all, its words, its buttons, the boxes of the contact and the networks, the mark beside the name.

```ts
import { themeOf, themes } from '@reboprofiles/core';

themes('#ea580c'); // the nine, the first in this colour
themeOf('midnight'); // { background: 'linear-gradient(…)', button: …, … }
```

<demo name="page" />

## How the page opens

`entrance` says how the blocks come in, one after another, when the page opens: `rise`, `fade`, `zoom`, or `none`. A page drawn with `motion: false` comes in still (the editor's preview, while it is written).

## A link that draws the eye

A link's `highlight` makes it move again and again, to be seen first: `pulse`, `shake`, `shine` or `bounce`; `none` leaves it still. It comes in with the rest, and then starts. With the numbers, you can see whether it is touched more.

## Less motion

Whoever asks their system for less motion sees the page still: no entrance, no link that moves.
