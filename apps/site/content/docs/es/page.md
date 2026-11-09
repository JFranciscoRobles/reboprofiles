# La página

`renderProfile(profile, options)` convierte un perfil en su página: `html`, un documento completo, para responder con él tal cual; y `css` y `body`, para ponerlos en una página propia.

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

## Sus opciones {#its-options}

| Opción | Qué es |
| --- | --- |
| `locale` | `'en'` o `'es'`: las palabras de sus botones. |
| `link` | Por dónde pasa cada dirección, con dónde está: `(url, { block, type, part })`. Tal cual, si no se da. |
| `view` | A dónde se avisa la visita. Sin ella: no se avisa. |
| `country` | El código que se le pone a un teléfono de diez dígitos para WhatsApp: `52`. |
| `base` | Dónde está una dirección que empieza con `/`. |
| `custom` | Cómo dibujar tus bloques, según su tipo. |
| `canonical` · `footer` | La dirección propia de la página; una línea al pie con su liga. |
| `motion` | Si se mueve al abrir; sí, salvo que se diga. |

## De qué está hecha {#what-it-is-made-of}

HTML simple y una hoja de estilos: sin framework, sin más script que el aviso de la visita. Sus palabras se escapan, sus direcciones son solo las que un navegador puede seguir (`https:`, `mailto:`, `tel:`, las de la propia página), y un bloque sin lo que necesita se omite.

En un servidor, `profileResponse(profile, { id, tracker, … })` la entrega como un `Response`, con sus ligas y su visita ya contadas: ve [Visitas y clics](/docs/tracking/).
