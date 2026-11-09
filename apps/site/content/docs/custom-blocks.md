# Blocks of your own

What your application has and ReboProfiles does not know of — the homes an agent sells, the dishes of a cook, the dates a doctor has free — goes in a profile as a block of your own: a `custom` block, its `kind`, its `data` (anything JSON says) and its `layout`.

## Register it in the editor

```tsx
import type { EditorBlock } from '@reboprofiles/react';

const homes: EditorBlock = {
  kind: 'homes',
  label: 'Homes',
  layout: 'grid2',
  data: () => ({ ids: [] }),
  render: {
    html: (block, ctx) =>
      ctx.items(
        myHomes(block.data.ids).map((h) => ({ title: h.title, subtitle: h.place, badge: h.price, image: h.photo, href: h.url })),
        block.layout,
        { block: block.id, type: 'custom', part: 'home' },
      ),
    complete: (block) => (block.data.ids as string[]).length > 0,
  },
  Fields: ({ block, update }) => <HomePicker value={block.data.ids} onChange={(ids) => update({ ids })} />,
};

<ProfileEditor profile={profile} blocks={[homes]} />;
```

It goes in the list of blocks to add, its layout is chosen as a gallery's, its `Fields` are shown when its card is open, and the preview draws it by its `render`.

## Draw it on the server

The same `render` goes to the page:

```ts
profileResponse(profile, { id, tracker, custom: { homes: homes.render } });
```

## Its items, and their clicks

`ctx.items(list, layout, place)` draws many things as cards — a picture, a title, a line under it, a badge — in any of the five layouts, each linking through the tracker with its `part` and its place in the list (`home:0`, `home:1`…). Your block is counted as any other.

<demo name="page" />
