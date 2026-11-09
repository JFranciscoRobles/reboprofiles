# Bloques

Un `Profile` es quién es alguien, arriba, y sus bloques debajo, uno tras otro.

```ts
interface Profile {
  name: string;
  headline: string; // qué hace, en una línea
  bio: string;
  photo: string | null; // una dirección, o una dirección data:
  location: string;
  badge: string; // una cédula: una marca junto al nombre
  theme: ThemeId;
  accent: string; // #rrggbb, del tema `accent`
  entrance: Entrance;
  blocks: Block[];
}
```

## Los bloques {#the-blocks}

| Bloque | Qué es |
| --- | --- |
| `link` | Palabras y a dónde llevan, una segunda línea, un emoji, y un movimiento para llamar la atención (`highlight`). |
| `contact` | WhatsApp (con su primer mensaje escrito), una llamada y un correo, cada uno un botón cuando se da. |
| `socials` | Instagram, Facebook, TikTok, YouTube, LinkedIn, X, WhatsApp y un sitio web, como íconos. |
| `heading` · `text` | Palabras; un salto de línea donde se escribe. |
| `image` | Una imagen, con liga o sin ella. |
| `gallery` | Imágenes, en uno de los cinco formatos. |
| `video` | Una imagen y la liga al video: la de YouTube se encuentra sola. |
| `divider` | Una línea. |
| `custom` | Uno propio de tu aplicación: ve [Bloques propios](/docs/custom-blocks/). |

## Cinco formatos {#five-layouts}

Una galería, y cualquier bloque propio de muchas cosas, se acomoda como `cards` (una por renglón), `grid2` (dos), `grid3` (un mosaico de tres, la etiqueta sobre la imagen), `list` (una imagen chica y sus palabras al lado) o `carousel` (una fila para deslizar).

## Hacerlos, leerlos y moverlos {#made-read-and-moved}

```ts
import { insertBlock, makeBlock, moveBlock, readProfile, removeBlock, updateBlock } from '@reboprofiles/core';

let blocks = insertBlock(profile.blocks, makeBlock('link'));
blocks = updateBlock(blocks, id, { label: 'Agenda una visita', url: 'https://…' });
blocks = moveBlock(blocks, id, 0);
const profile = readProfile(JSON.parse(guardado)); // solo lo que cada bloque puede tener
```

Cada una da una lista nueva: nada se cambia en su lugar.
