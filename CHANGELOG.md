# Changelog

Every package of ReboProfiles is released at the same version. Before 1.0, a
minor version (0.x.0) may change the API; such changes are listed under
**Changed** with what to do about them.

## Unreleased

### Added

- **The engine** (`@reboprofiles/core`): a profile (a name, a photo, what
  they do, a few words, where, what they are verified as) and its blocks:
  links, the buttons to reach them (WhatsApp, a call, an email), networks,
  headings, words, a picture, a gallery, a video, a line, and **custom**
  blocks of the application's own, drawn by what it gives. Many things are
  laid out in five ways: a card a row, two, a mosaic of three, a list, a row
  to slide.
- **Nine themes**, four of them gradients, the first in the profile's own
  colour; **motion**: how the blocks come in as the page opens (rising,
  fading in, growing, or still) and links that draw the eye again and again
  (a pulse, a shake, a light across, a bounce), all still for whoever asks
  their system for less motion.
- Reading a profile from what was kept or sent: only what each block has,
  as long as it may be; only addresses a browser may follow.
- **The page** (`renderProfile`): its HTML and CSS, every address through
  what counts its clicks with the block and the part it is in, and the visit
  told by a beacon with where it came from and the campaign, or by a picture
  without scripts.
- **The numbers** (`summarize`): visits, visitors each day, clicks, how many
  touched something, by day in a time zone, what was touched by its name,
  where they came from, on what, from where and by which campaign.
- What a profile lacks before it is shared, in English and Spanish.
- **The server** (`@reboprofiles/server`): a tracker that signs each
  profile's addresses (a link goes nowhere it was not sent to), the routes
  of visits and clicks as a `Request` → `Response` handler and for
  `node:http`, visitors without cookies, robots and previews left out, and
  the page ready to answer with.
- **The editor** (`@reboprofiles/react`): the form beside the page as it
  will be shared, the themes, each block as a card moved, copied and taken
  away, the application's own blocks with what they ask; and **the
  numbers** (`ProfileStats`). English and Spanish; light and dark.
- **The playground** (`npm run dev`): the editor, the page at `/u/demo`
  counted as it is visited, and its numbers, with two weeks of visits made
  up at a click.
- **The site** (`npm run site`): the home, with the editor working in it
  and the numbers of a month of made-up visits; the demo; and the
  documentation in English and Spanish, in the frame of the suite's
  (search, a grouped sidebar, the pages' indexes), with the page, the editor
  and the numbers running in it.
- **The page's QR code**, made by the engine with nothing else (`qrCode`,
  `qrSvg`): bytes in the smallest version that holds them, Reed–Solomon in
  blocks, the best of the eight masks; read back in its tests by another
  library's reader. **Sheets to print it** (`renderQrSheet`): a poster,
  ten cards and six stickers a letter page, in the profile's colours.
- **Share** in the editor (`url`): the code saved as SVG or PNG, the
  address to copy, the sheets to print.
- **QR scans counted**: each code says the piece it is on (`qrUrl`,
  `?qr=poster`); the visit it brings comes as a scan of it (`qr` on the
  event, `qr` its source), and the numbers say how many came by the code,
  by day and by piece (`scans`, `scanned`), shown in the dashboard.

### Changed

- **The editor looks as Spectrum 2** (Adobe's design language): its grays
  and its blue, fields with an edge of two pixels and the focus ringed
  outside, round buttons, choices in a track, themes as cards to tick,
  blocks as an accordion, icons in place of characters. The custom
  properties an application sets keep their names.

