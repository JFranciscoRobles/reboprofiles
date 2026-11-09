# Antes de compartirlo

`problemsOf(profile)` dice lo que le falta a un perfil, en el orden en que se lee; `describeProblem(problem, locale)` lo dice en palabras, en inglés o español.

```ts
import { describeProblem, problemsOf } from '@reboprofiles/core';

for (const p of problemsOf(profile, { custom })) console.log(describeProblem(p, 'es'));
// Falta tu nombre.
// Le falta algo al bloque «liga».
```

## Lo que encuentra {#what-it-finds}

| Código | Cuándo |
| --- | --- |
| `no-name` | El perfil no tiene nombre. |
| `no-blocks` | No tiene bloques. |
| `incomplete` | Un bloque sin lo que necesita para mostrar algo: una liga sin sus palabras o su dirección, un contacto sin forma de contactar. Un bloque propio lo dice él mismo, con su `complete`. |
| `bad-link` | Una dirección que ningún navegador debería seguir: `javascript:`, una página de otro sitio sin su `https:`. |

El editor los muestra junto a la página, en *Antes de compartirla*.
