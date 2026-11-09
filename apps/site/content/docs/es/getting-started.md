# Primeros pasos

El editor en una página de React, la página y sus rutas en un servidor, y las cifras: las tres formas de entrar, cada una en unas líneas.

## Pon el editor en tu aplicación {#put-the-editor-in-your-app}

```bash
npm install @reboprofiles/react
```

```tsx
'use client';
import '@reboprofiles/react/styles.css';
import { type Profile, sampleProfile } from '@reboprofiles/core';
import { ProfileEditor } from '@reboprofiles/react';

export function MiPagina({ guardado }: { guardado?: Profile }) {
  return <ProfileEditor profile={guardado ?? sampleProfile('es')} onChange={guardar} locale="es" />;
}
```

El perfil es un objeto simple: guárdalo como JSON y léelo de vuelta con `readProfile(json)`, que conserva solo lo que cada bloque puede tener.

## Entrega la página, y cuéntala {#give-the-page-and-count-it}

```bash
npm install @reboprofiles/server
```

```ts
import { readProfile } from '@reboprofiles/core';
import { createProfileHandler, createTracker, profileResponse } from '@reboprofiles/server';

const secret = process.env.PROFILES_SECRET!; // largo y aleatorio
const tracker = createTracker({ secret, base: 'https://example.com' });
const routes = createProfileHandler({ tracker, secret, onEvent: (event) => db.events.insert(event) });

// GET /u/:slug — la página, con sus ligas por el tracker
export const page = (row) => profileResponse(readProfile(row.profile), { id: row.id, tracker, locale: 'es', country: '52' });
// GET y POST /p/* — sus visitas y clics
export const track = (request: Request) => routes(request);
```

## Muestra las cifras {#show-the-numbers}

```tsx
import { summarize } from '@reboprofiles/core';
import { ProfileStats } from '@reboprofiles/react';

const summary = summarize(events, { profile, timeZone: 'America/Mexico_City', locale: 'es' });
<ProfileStats summary={summary} locale="es" />;
```

## Corre el repositorio {#run-the-repository}

```bash
git clone https://github.com/JFranciscoRobles/reboprofiles && cd reboprofiles
npm install
npm run dev    # el playground en :5310: el editor, /u/demo contado al visitarlo, sus cifras
npm test
```
