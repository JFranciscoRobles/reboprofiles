# Visitas y clics

`@reboprofiles/server` cuenta qué pasa con una página: cada visita, y cada clic en su camino a donde va. No guarda nada: cada uno es un evento que se le avisa a tu aplicación, y ella lo guarda.

## El tracker {#the-tracker}

```ts
import { createTracker } from '@reboprofiles/server';

const tracker = createTracker({ secret: process.env.PROFILES_SECRET!, base: 'https://example.com', prefix: '/p' });
```

Firma las direcciones de cada perfil. Una liga lleva marcado a dónde va y dónde está en la página: nadie puede inventar una visita a otro perfil, ni mandar una liga a donde no se mandó.

## Las rutas {#the-routes}

```ts
import { createProfileHandler } from '@reboprofiles/server';

const routes = createProfileHandler({
  tracker,
  secret: process.env.PROFILES_SECRET!,
  onEvent: (event) => db.events.insert(event),
  fallback: 'https://example.com',
});
```

| Ruta | Qué hace |
| --- | --- |
| `POST /p/v/:token` | La visita, avisada por el beacon de la página: de dónde vino, la campaña de su dirección, qué tan ancha es la pantalla. |
| `GET /p/v/:token` | La visita sin scripts, con una imagen. |
| `GET /p/c/:token?u=…&b=…&p=…&s=…` | Un clic, contado en el camino: luego a donde va. Una liga que no se hizo aquí va a `fallback`. |

Es una función de un `Request` a un `Response`: una ruta de Next.js, un Worker, Bun, o `node:http` con `nodeHandler`.

## Los eventos {#the-events}

```ts
{ type: 'view' | 'click', profile, at, visitor, block?, part?, url?, source?, campaign?, qr?, device?, country? }
```

| Campo | Qué es |
| --- | --- |
| `visitor` | Una marca de la conexión y del navegador, hecha de nuevo cada día: quién regresó hoy, no quién es. No se pone ninguna cookie. |
| `block` · `part` | De un clic: el bloque, y cuál de sus partes (`whatsapp`, `instagram`, `home:2`). |
| `source` | El origen de la campaña si la dirección lo dice; si no, el sitio de donde vino, por su nombre: `instagram`, `tiktok`, `whatsapp`, `google`; si no, `direct`. |
| `qr` | De una visita por el código QR de la página: el impreso desde el que se escaneó (`poster`, `cards`, `stickers`, `file`), como lo dice la dirección del código (`?qr=cards`); su `source` es entonces `qr`. |
| `device` | `mobile`, `tablet` o `desktop`. |
| `country` | Dos letras, cuando lo dice la CDN de enfrente: la de Cloudflare, Vercel, Fastly. |

Los robots y las previsualizaciones que hacen las apps de una liga (la de WhatsApp, la de Facebook) nunca se cuentan.
