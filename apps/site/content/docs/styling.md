# Styling

The editor and the numbers are drawn by one stylesheet, `@reboprofiles/react/styles.css`, its classes prefixed `rpe-` (the editor) and `rps-` (the numbers), in the language of Adobe's Spectrum 2: its grays and its blue, fields with an edge of two pixels and the ring of the focus outside them, round buttons, choices in a track, cards that rise a little. Light and dark by the system unless `data-theme="light"` says otherwise. Adobe Clean is used when the page has it; Source Sans 3, or the system's, when not.

## Its colours

They are custom properties on `.rpe` and `.rps`: set yours over them.

```css
.rpe,
.rps {
  --rp-brand: #ea580c;
  --rp-brand-light: #fff1e8;
  --rp-panel: #ffffff;
  --rp-line: #e7e7ea;
}
```

| Property | What it colours |
| --- | --- |
| `--rp-ink` · `--rp-soft` · `--rp-muted` | The words, strong to faint. |
| `--rp-line` | The edges. |
| `--rp-surface` · `--rp-panel` | What is behind, and the cards. |
| `--rp-brand` · `--rp-brand-light` | What is chosen, the bars of the numbers. |

## The page is not styled here

The page a profile is shared as has its own style, in its HTML (`PROFILE_CSS`, classes prefixed `rp-`), its colours its theme's: see [Themes and motion](/docs/themes/).
