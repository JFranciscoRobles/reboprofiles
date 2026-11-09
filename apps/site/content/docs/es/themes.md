# Temas y movimiento

## Nueve temas {#nine-themes}

`accent` (el color propio del perfil), `light`, `dark`, `sand`, `forest`, y cuatro con degradado: `ocean`, `sunset`, `aurora`, `midnight`. Cada uno dice con qué se dibuja la página: lo que hay detrás, sus letras, sus botones, los recuadros del contacto y las redes, la marca junto al nombre.

```ts
import { themeOf, themes } from '@reboprofiles/core';

themes('#ea580c'); // los nueve, el primero en este color
themeOf('midnight'); // { background: 'linear-gradient(…)', button: …, … }
```

<demo name="page" />

## Cómo se abre la página {#how-the-page-opens}

`entrance` dice cómo entran los bloques, uno tras otro, al abrir la página: `rise`, `fade`, `zoom`, o `none`. Una página dibujada con `motion: false` llega quieta (la vista previa del editor, mientras se escribe).

## Una liga que llama la atención {#a-link-that-draws-the-eye}

El `highlight` de una liga la hace moverse una y otra vez, para que la vean primero: `pulse`, `shake`, `shine` o `bounce`; `none` la deja quieta. Entra con lo demás, y luego empieza. Con las cifras puedes ver si la tocan más.

## Menos movimiento {#less-motion}

Quien le pide a su sistema menos movimiento ve la página quieta: sin entrada, sin liga que se mueva.
