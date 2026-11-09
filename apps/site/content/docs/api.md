# API

## @reboprofiles/core

### readProfile
`readProfile(given: unknown): Profile` — a profile as it was given: each text as long as it may be, its theme one of the nine, only what each block has, only addresses a browser may follow.

### renderProfile
`renderProfile(profile, options?): { html, css, body, title, description }` — the page. See [The page](/docs/page/).

### summarize
`summarize(events, { from?, to?, timeZone?, profile?, locale? }): Summary` — the numbers. See [The numbers](/docs/numbers/).

### problemsOf
`problemsOf(profile, { custom? }): Problem[]` and `describeProblem(problem, locale?)`.

### makeBlock
`makeBlock(type, custom?)`, and the list: `insertBlock`, `removeBlock`, `updateBlock`, `moveBlock`, `duplicateBlock`.

### qrSvg
`qrSvg(text, { correction?, margin?, color?, background?, title? })`, `qrCode(text, correction?)`, `qrUrl(url, piece)`, `renderQrSheet(profile, url, { format?, locale? })`, `shortUrl(url)`; `PRINT_FORMATS`.

### themes
`themes(accent?)`, `themeOf(id, accent?)`, `themeCss(theme)`.

### sourceOf
`sourceOf(referrer, utmSource?)`, `deviceOf(userAgent, width?)`, `labelOf(blocks, block, part?, locale?)`.

### Others
`blankProfile`, `sampleProfile(locale)`, `slugOf`, `safeUrl`, `videoPicture`, `whatsappOf`, `escapeHtml`; `THEME_IDS`, `NETWORKS`, `LAYOUTS`, `ENTRANCES`, `HIGHLIGHTS`, `BLOCK_TYPES`.

## @reboprofiles/server

### createTracker
`createTracker({ secret, base, prefix? }): Tracker` — `token`, `read`, `view(profile)`, `click(profile, url, place)`, `linkFor(profile)`, `isClick`.

### createProfileHandler
`createProfileHandler({ tracker, secret, onEvent, fallback?, ip? }): (request) => Promise<Response>`.

### profileResponse
`profileResponse(profile, { id, tracker?, …renderOptions }): Response`.

### Others
`nodeHandler(handle)`, `visitorOf(secret, day, profile, ip, userAgent)`, `isRobot(userAgent)`.

## @reboprofiles/react

### ProfileEditor
`<ProfileEditor profile onChange? locale? blocks? render? url? />` and its parts: `ProfileForm`, `ProfilePreview`, `ProfileProblems`, `ProfileShare`, `ThemePicker`, `LayoutPicker`.

### ProfileStats
`<ProfileStats summary locale? />`.
