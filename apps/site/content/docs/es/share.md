# Compartir e imprimir

Un perfil se comparte con su dirección, y con su código QR: en una tarjeta, un póster en una ventana, una etiqueta en un letrero. El motor hace el código él mismo, sin nada más que instalar.

## El código QR {#the-qr-code}

```ts
import { qrCode, qrSvg } from '@reboprofiles/core';

qrSvg('https://example.com/u/laura', { correction: 'Q', margin: 4 }); // un SVG, nítido a cualquier tamaño
qrCode('https://example.com/u/laura'); // { version, size, modules: boolean[][] }, para dibujarlo como quieras
```

Sus palabras van como bytes (cualquier idioma), en la versión más chica que las contiene, con su corrección de errores (`L`, `M`, `Q` o `H`: se pueden perder 7, 15, 25 o 30 partes de cien) y la máscara con la que menos tropieza un lector, como dice la ISO/IEC 18004. Sus pruebas lo vuelven a leer con el lector de otra librería.

## Sus escaneos, contados {#its-scans-counted}

`qrUrl(url, piece)` marca la dirección con el impreso en el que va: `https://example.com/u/laura?qr=poster`. La página avisa su visita con esa marca, y el servidor la cuenta como un escaneo de ese impreso: [las cifras](/docs/numbers/) dicen cuántos llegaron por el código, y desde cuál. Las hojas marcan sus códigos con su formato; el SVG y el PNG del editor, como `file`.

## Para imprimir {#to-print}

```ts
import { renderQrSheet } from '@reboprofiles/core';

const html = renderQrSheet(profile, 'https://example.com/u/laura', { format: 'cards', locale: 'es' });
```

| Formato | Qué es |
| --- | --- |
| `poster` | Una hoja carta: *Escanéame*, la foto, el nombre, qué hace, el código grande y la dirección debajo. |
| `cards` | Diez tarjetas de presentación por hoja carta, cada una con su código, el nombre y la dirección, con líneas de corte. |
| `stickers` | Seis cuadros de tres pulgadas por hoja, cada uno con su código y el nombre. |

Cada uno es un documento completo, con los colores del perfil, listo para imprimirse desde el navegador (`@page` carta).

## En el editor {#in-the-editor}

Dale a `ProfileEditor` la dirección de la página y muestra *Compartir*: el código, para guardarlo como SVG (para una imprenta) o PNG (para una publicación), la dirección para copiar, y las hojas para imprimir.

```tsx
<ProfileEditor profile={profile} onChange={guardar} url={`https://example.com/u/${slug}`} locale="es" />
```

<demo name="editor" />
