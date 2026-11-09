# Las cifras

`summarize(events, options)` cuenta a qué llegan los eventos en unos días; `ProfileStats` lo dibuja.

<demo name="stats" />

## Contar {#counting}

```ts
import { summarize } from '@reboprofiles/core';

const s = summarize(events, { from: '2026-10-01', to: '2026-10-30', timeZone: 'America/Mexico_City', profile, locale: 'es' });
```

| Opción | Qué es |
| --- | --- |
| `from` · `to` | Los días que se cuentan, los dos incluidos, como `YYYY-MM-DD`. Los últimos treinta si no se dan. |
| `timeZone` | La zona horaria de cada día: una visita a las 11 de la noche en Tijuana es de ese día. UTC si no se dice. |
| `profile` · `locale` | Lo que se tocó, con su nombre: una liga por sus palabras, una red por su nombre. |

## Lo que da {#what-it-gives}

| Campo | Qué es |
| --- | --- |
| `views` · `visitors` · `clicks` | Visitas; visitantes, cada uno una vez al día; clics. |
| `clickRate` | De los visitantes, cuántos tocaron algo: de 0 a 1. |
| `days` | Cada día, sus visitas, visitantes y clics, también los días sin ninguno. |
| `touched` | Lo que se tocó, lo más tocado primero: su bloque, su parte, su nombre, sus clics, y de los visitantes cuántos lo tocaron. |
| `scans` · `scanned` | Las visitas que llegaron por el código QR de la página, y esas por el impreso escaneado: un póster, tarjetas, etiquetas, un archivo. Cada día también dice sus `scans`. |
| `sources` · `devices` · `countries` · `campaigns` | Cada uno contado, el mayor primero. |

## Dibujarlo {#drawing-it}

```tsx
import { ProfileStats } from '@reboprofiles/react';

<ProfileStats summary={s} locale="es" />;
```

Se dibuja solo con el resumen: cuenta donde guardas los eventos, en el servidor o en la página.
