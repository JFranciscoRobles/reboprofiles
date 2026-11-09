# Estilos

El editor y las cifras se dibujan con una sola hoja de estilos, `@reboprofiles/react/styles.css`, con clases que empiezan con `rpe-` (el editor) y `rps-` (las cifras), en el lenguaje de Spectrum 2 de Adobe: sus grises y su azul, campos con un borde de dos pixeles y el anillo del foco por fuera, botones redondos, opciones en una pista, tarjetas que se elevan un poco. Claro y oscuro según el sistema salvo que `data-theme="light"` diga otra cosa. Usa Adobe Clean cuando la página la tiene; si no, Source Sans 3 o la del sistema.

## Sus colores {#its-colours}

Son propiedades CSS en `.rpe` y `.rps`: pon las tuyas encima.

```css
.rpe,
.rps {
  --rp-brand: #ea580c;
  --rp-brand-light: #fff1e8;
  --rp-panel: #ffffff;
  --rp-line: #e7e7ea;
}
```

| Propiedad | Qué colorea |
| --- | --- |
| `--rp-ink` · `--rp-soft` · `--rp-muted` | Las letras, de fuertes a tenues. |
| `--rp-line` | Los bordes. |
| `--rp-surface` · `--rp-panel` | Lo de atrás, y las tarjetas. |
| `--rp-brand` · `--rp-brand-light` | Lo elegido, las barras de las cifras. |

## La página no se estiliza aquí {#the-page-is-not-styled-here}

La página con la que se comparte un perfil tiene su propio estilo, en su HTML (`PROFILE_CSS`, clases que empiezan con `rp-`), con los colores de su tema: ve [Temas y movimiento](/docs/themes/).
