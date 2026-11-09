# Qué es ReboProfiles

ReboProfiles hace la única página que alguien comparte (su foto, lo que hace, los botones para contactarle, sus ligas, sus redes y lo que ofrece) y cuenta qué pasa con ella: cada visita, de dónde vino, y cada clic, según el bloque en el que fue.

Son tres paquetes que se apoyan en un motor. El motor no usa DOM: el perfil es un objeto simple que tu aplicación guarda como JSON, y su página es HTML que cualquier servidor entrega. El editor escribe el perfil en un formulario junto a la página como se verá. El servidor firma las ligas de la página y recibe cada visita y cada clic.

<demo name="editor" />

## Para qué sirve {#what-it-is-for}

- **Una liga en la biografía.** La única dirección en un Instagram, un TikTok o el pie de un correo, con todo lo demás detrás.
- **La página de cada persona de un equipo.** Un asesor, una doctora, un maestro: cada quien su página, hecha en tu aplicación, con lo que tu aplicación tiene (las casas que vende, las fechas que tiene libres) como bloques propios.
- **Saber qué funciona.** Qué liga tocan, de qué red llegan las visitas, qué campaña las trajo, desde qué la leen.

## Lo que no es {#what-it-is-not}

No es un servicio: nada se guarda en otro lugar que donde lo guarda tu aplicación, y ninguna visita va a nadie más que a tu servidor. Tampoco es un constructor de sitios: un perfil es una página, una columna, hecha para leerse en un celular.

## A dónde seguir {#where-to-go-from-here}

- [Primeros pasos](/docs/getting-started/): el editor, la página y las cifras, en unas líneas cada uno.
- [Bloques](/docs/blocks/): lo que puede tener un perfil.
- [Visitas y clics](/docs/tracking/): qué se cuenta, y cómo.
