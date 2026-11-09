# El editor

`ProfileEditor` es el editor completo: el formulario y, a su lado, la página como se compartirá y lo que le falta.

<demo name="editor" />

## Sus props {#its-props}

| Prop | Qué es |
| --- | --- |
| `profile` | El perfil del que parte. El editor lo conserva desde ahí. |
| `onChange` | Recibe el perfil después de cada cambio: guárdalo. |
| `locale` | `'en'` o `'es'`: las palabras del editor y de la página. |
| `blocks` | Tus bloques propios: ve [Bloques propios](/docs/custom-blocks/). |
| `render` | Con qué se dibuja la vista previa, salvo los bloques: `country` (el código para los números de WhatsApp), `base`, `footer`. |

## Lo que tiene {#what-it-has}

- **Tú.** La foto, cuadrada y chica (un JPEG de 400 pixeles, como dirección data), el nombre, qué haces, unas palabras, dónde, como qué estás verificado.
- **El estilo.** Los nueve temas, el color del primero, y cómo se abre la página.
- **La página.** Cada bloque es una tarjeta: ábrela para cambiarla, súbela y bájala, cópiala, quítala. Debajo, los bloques para agregar.
- **La vista previa.** La página misma, como la hace `renderProfile`, al ancho de un celular. Se carga una vez y se escribe sobre ella mientras escribes; su entrada se repite cuando cambia lo que se mueve, o con *Ver la animación*.
- **Lo que le falta**, como lo encuentra `problemsOf`.

## Sus partes {#its-parts}

El editor está hecho de partes que puedes poner donde quieras:

```tsx
import { ProfileForm, ProfilePreview, ProfileProblems, ThemePicker } from '@reboprofiles/react';

<ProfileForm profile={profile} onChange={setProfile} locale="es" />
<ProfilePreview profile={profile} locale="es" />
```
