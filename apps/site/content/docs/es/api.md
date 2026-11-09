# API

## @reboprofiles/core

### readProfile
`readProfile(given: unknown): Profile` — un perfil como llegó: cada texto con el largo que puede tener, su tema uno de los nueve, solo lo que tiene cada bloque, solo direcciones que un navegador puede seguir.

### renderProfile
`renderProfile(profile, options?): { html, css, body, title, description }` — la página. Ve [La página](/docs/page/).

### summarize
`summarize(events, { from?, to?, timeZone?, profile?, locale? }): Summary` — las cifras. Ve [Las cifras](/docs/numbers/).

### problemsOf
`problemsOf(profile, { custom? }): Problem[]` and `describeProblem(problem, locale?)`.

### makeBlock
`makeBlock(type, custom?)`, y la lista: `insertBlock`, `removeBlock`, `updateBlock`, `moveBlock`, `duplicateBlock`.

### qrSvg
`qrSvg(text, { correction?, margin?, color?, background?, title? })`, `qrCode(text, correction?)`, `qrUrl(url, piece)`, `renderQrSheet(profile, url, { format?, locale? })`, `shortUrl(url)`; `PRINT_FORMATS`.

### themes
`themes(accent?)`, `themeOf(id, accent?)`, `themeCss(theme)`.

### sourceOf
`sourceOf(referrer, utmSource?)`, `deviceOf(userAgent, width?)`, `labelOf(blocks, block, part?, locale?)`.

### Otras {#others}
`blankProfile`, `sampleProfile(locale)`, `slugOf`, `safeUrl`, `videoPicture`, `whatsappOf`, `escapeHtml`; `THEME_IDS`, `NETWORKS`, `LAYOUTS`, `ENTRANCES`, `HIGHLIGHTS`, `BLOCK_TYPES`.

## @reboprofiles/server

### createTracker
`createTracker({ secret, base, prefix? }): Tracker` — `token`, `read`, `view(profile)`, `click(profile, url, place)`, `linkFor(profile)`, `isClick`.

### createProfileHandler
`createProfileHandler({ tracker, secret, onEvent, fallback?, ip? }): (request) => Promise<Response>`.

### profileResponse
`profileResponse(profile, { id, tracker?, …renderOptions }): Response`.

### Otras {#others}
`nodeHandler(handle)`, `visitorOf(secret, day, profile, ip, userAgent)`, `isRobot(userAgent)`.

## @reboprofiles/react

### ProfileEditor
`<ProfileEditor profile onChange? locale? blocks? render? url? />` y sus partes: `ProfileForm`, `ProfilePreview`, `ProfileProblems`, `ProfileShare`, `ThemePicker`, `LayoutPicker`.

### ProfileStats
`<ProfileStats summary locale? />`.
