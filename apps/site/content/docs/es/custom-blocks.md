# Bloques propios

Lo que tu aplicación tiene y ReboProfiles no conoce (las casas que vende un asesor, los platillos de un cocinero, las fechas libres de una doctora) entra en un perfil como un bloque propio: un bloque `custom`, su `kind`, sus `data` (lo que diga un JSON) y su `layout`.

## Regístralo en el editor {#register-it-in-the-editor}

```tsx
import type { EditorBlock } from '@reboprofiles/react';

const casas: EditorBlock = {
  kind: 'homes',
  label: 'Casas',
  layout: 'grid2',
  data: () => ({ ids: [] }),
  render: {
    html: (block, ctx) =>
      ctx.items(
        misCasas(block.data.ids).map((c) => ({ title: c.titulo, subtitle: c.colonia, badge: c.precio, image: c.foto, href: c.url })),
        block.layout,
        { block: block.id, type: 'custom', part: 'home' },
      ),
    complete: (block) => (block.data.ids as string[]).length > 0,
  },
  Fields: ({ block, update }) => <SelectorDeCasas value={block.data.ids} onChange={(ids) => update({ ids })} />,
};

<ProfileEditor profile={profile} blocks={[casas]} locale="es" />;
```

Aparece en la lista de bloques para agregar, su formato se elige como el de una galería, sus `Fields` se muestran al abrir su tarjeta, y la vista previa lo dibuja con su `render`.

## Dibújalo en el servidor {#draw-it-on-the-server}

El mismo `render` va a la página:

```ts
profileResponse(profile, { id, tracker, custom: { homes: casas.render } });
```

## Sus elementos, y sus clics {#its-items-and-their-clicks}

`ctx.items(lista, layout, lugar)` dibuja muchas cosas como tarjetas (una imagen, un título, una línea debajo, una etiqueta) en cualquiera de los cinco formatos, cada una con su liga por el tracker con su `part` y su lugar en la lista (`home:0`, `home:1`…). Tu bloque se cuenta como cualquier otro.

<demo name="page" />
