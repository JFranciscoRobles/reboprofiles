# Paquetes

Todos los paquetes salen en la misma versión, y cada uno se apoya en el motor y en nada más.

| Paquete | Qué es | Lo que necesita |
| --- | --- | --- |
| `@reboprofiles/core` | El motor: el perfil y sus bloques, sus temas, leer lo que llega, el HTML de la página, lo que le falta, las cifras. Sin DOM: el navegador, Node, Deno, Bun, un Worker. | Nada. |
| `@reboprofiles/server` | La página con sus ligas firmadas, y las rutas de sus visitas y clics. | El `crypto` de Node, o un entorno que lo tenga. |
| `@reboprofiles/react` | El editor y las cifras, como componentes y partes; su hoja de estilos. | React 19. |

```bash
npm install @reboprofiles/core            # solo el motor
npm install @reboprofiles/server          # un servidor que entrega las páginas y las cuenta
npm install @reboprofiles/react           # el editor y las cifras en una aplicación de React
```
