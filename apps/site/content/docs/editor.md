# The editor

`ProfileEditor` is the whole editor: the form, and beside it the page as it will be shared, and what it lacks.

<demo name="editor" />

## Its props

| Prop | What it is |
| --- | --- |
| `profile` | The profile to start from. The editor keeps it from then on. |
| `onChange` | Told the profile after each change: keep it. |
| `locale` | `'en'` or `'es'`: the editor's words and the page's. |
| `blocks` | Your own blocks: see [Blocks of your own](/docs/custom-blocks/). |
| `render` | What the preview is drawn with but the blocks: `country` (the code for WhatsApp's numbers), `base`, `footer`. |

## What it has

- **You.** The photo, made square and small (a JPEG of 400 pixels, as a data address), the name, what they do, a few words, where, what they are verified as.
- **The look.** The nine themes, the accent of the first, and how the page opens.
- **The page.** Each block a card: open it to change it, move it up and down, copy it, take it away. Below them, the blocks to add.
- **The preview.** The page itself, as `renderProfile` makes it, in a phone's width. It is loaded once and written into as you write; its entrance plays when what moves changes, or with *Play the animation*.
- **What it lacks**, as `problemsOf` finds it.

## Its parts

The editor is made of parts you may put where you like:

```tsx
import { ProfileForm, ProfilePreview, ProfileProblems, ThemePicker } from '@reboprofiles/react';

<ProfileForm profile={profile} onChange={setProfile} locale="en" />
<ProfilePreview profile={profile} locale="en" />
```
