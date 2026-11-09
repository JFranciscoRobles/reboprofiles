// The words of the editor and of the numbers, in English and Spanish.

import type { BlockType, Entrance, Highlight, Layout, Locale, PrintFormat } from '@reboprofiles/core';

export interface Words {
  blocks: Record<Exclude<BlockType, 'custom'>, string>;
  layouts: Record<Layout, string>;
  entrance: string;
  entrances: Record<Entrance, string>;
  highlight: string;
  highlights: Record<Highlight, string>;
  replay: string;
  share: { title: string; copy: string; print: string; printIt: string; formats: Record<PrintFormat, string> };
  you: string;
  photo: string;
  upload: string;
  remove: string;
  name: string;
  headline: string;
  headlineHint: string;
  bio: string;
  location: string;
  badge: string;
  badgeHint: string;
  look: string;
  accent: string;
  page: string;
  add: string;
  up: string;
  down: string;
  duplicate: string;
  empty: string;
  fields: {
    label: string;
    url: string;
    note: string;
    icon: string;
    whatsapp: string;
    phone: string;
    email: string;
    message: string;
    text: string;
    src: string;
    alt: string;
    href: string;
    title: string;
    video: string;
    layout: string;
    pictures: string;
    addPicture: string;
  };
  problems: string;
  noProblems: string;
  preview: string;
  stats: {
    views: string;
    visitors: string;
    clicks: string;
    clickRate: string;
    byDay: string;
    touched: string;
    sources: string;
    devices: string;
    countries: string;
    campaigns: string;
    scans: string;
    scanned: string;
    pieces: Record<string, string>;
    nothing: string;
    direct: string;
    device: Record<'mobile' | 'tablet' | 'desktop', string>;
    ofVisitors: string;
  };
}

const en: Words = {
  blocks: { link: 'Link', contact: 'Contact buttons', socials: 'Networks', heading: 'Heading', text: 'Text', image: 'Image', gallery: 'Gallery', video: 'Video', divider: 'Divider' },
  layouts: { cards: '1 × 1', grid2: '2 × 2', grid3: '3 × 3', list: 'List', carousel: 'Carousel' },
  entrance: 'When the page opens',
  entrances: { rise: 'Rise', fade: 'Fade in', zoom: 'Zoom', none: 'None' },
  highlight: 'Draw the eye',
  highlights: { none: 'Still', pulse: 'Pulse', shake: 'Shake', shine: 'Shine', bounce: 'Bounce' },
  replay: 'Play the animation',
  share: { title: 'Share', copy: 'Copy the link', print: 'Print its QR code', printIt: 'Print', formats: { poster: 'Poster', cards: 'Cards', stickers: 'Stickers' } },
  you: 'You',
  photo: 'Photo',
  upload: 'Upload',
  remove: 'Remove',
  name: 'Name',
  headline: 'What you do',
  headlineHint: 'In a line.',
  bio: 'A few words',
  location: 'Where',
  badge: 'Verified as',
  badgeHint: 'A licence or a registration; shown as a mark beside your name.',
  look: 'Look',
  accent: 'Your colour',
  page: 'Your page',
  add: 'Add',
  up: 'Move up',
  down: 'Move down',
  duplicate: 'Duplicate',
  empty: 'Nothing yet: add a link.',
  fields: {
    label: 'Words',
    url: 'Address (https://, mailto:, tel:)',
    note: 'A second line (optional)',
    icon: 'Emoji (optional)',
    whatsapp: 'WhatsApp',
    phone: 'Phone',
    email: 'Email',
    message: 'What a WhatsApp starts with',
    text: 'Text',
    src: 'Picture (https://…)',
    alt: 'What it shows',
    href: 'Link when clicked (optional)',
    title: 'Title',
    video: 'Address of the video (YouTube, Vimeo)',
    layout: 'Layout',
    pictures: 'Pictures',
    addPicture: 'Add a picture',
  },
  problems: 'Before you share it',
  noProblems: 'Nothing missing.',
  preview: 'Preview',
  stats: {
    views: 'Visits',
    visitors: 'Visitors',
    clicks: 'Clicks',
    clickRate: 'Clicked something',
    byDay: 'By day',
    touched: 'What they touched',
    sources: 'Where they came from',
    devices: 'On what',
    countries: 'From where',
    campaigns: 'Campaigns',
    scans: 'QR scans',
    scanned: 'From the QR code',
    pieces: { poster: 'Poster', cards: 'Cards', stickers: 'Stickers', file: 'File (SVG or PNG)', qr: 'QR code' },
    nothing: 'Nothing yet.',
    direct: 'Direct',
    device: { mobile: 'Phone', tablet: 'Tablet', desktop: 'Computer' },
    ofVisitors: 'of visitors',
  },
};

const es: Words = {
  blocks: { link: 'Liga', contact: 'Botones de contacto', socials: 'Redes', heading: 'Título', text: 'Texto', image: 'Imagen', gallery: 'Galería', video: 'Video', divider: 'Separador' },
  layouts: { cards: '1 × 1', grid2: '2 × 2', grid3: '3 × 3', list: 'Lista', carousel: 'Carrusel' },
  entrance: 'Al abrir la página',
  entrances: { rise: 'Desde abajo', fade: 'Aparecer', zoom: 'Acercar', none: 'Ninguna' },
  highlight: 'Llamar la atención',
  highlights: { none: 'Quieta', pulse: 'Pulso', shake: 'Vibrar', shine: 'Brillo', bounce: 'Rebote' },
  replay: 'Ver la animación',
  share: { title: 'Compartir', copy: 'Copiar la liga', print: 'Imprimir su QR', printIt: 'Imprimir', formats: { poster: 'Póster', cards: 'Tarjetas', stickers: 'Etiquetas' } },
  you: 'Tú',
  photo: 'Foto',
  upload: 'Subir',
  remove: 'Quitar',
  name: 'Nombre',
  headline: 'Qué haces',
  headlineHint: 'En una línea.',
  bio: 'Unas palabras',
  location: 'Dónde',
  badge: 'Verificado como',
  badgeHint: 'Una cédula o un registro; se muestra como una marca junto a tu nombre.',
  look: 'Estilo',
  accent: 'Tu color',
  page: 'Tu página',
  add: 'Agregar',
  up: 'Subir',
  down: 'Bajar',
  duplicate: 'Duplicar',
  empty: 'Todavía nada: agrega una liga.',
  fields: {
    label: 'Texto',
    url: 'Dirección (https://, mailto:, tel:)',
    note: 'Una segunda línea (opcional)',
    icon: 'Emoji (opcional)',
    whatsapp: 'WhatsApp',
    phone: 'Teléfono',
    email: 'Correo',
    message: 'Con qué empieza un WhatsApp',
    text: 'Texto',
    src: 'Imagen (https://…)',
    alt: 'Qué muestra',
    href: 'Liga al darle clic (opcional)',
    title: 'Título',
    video: 'Dirección del video (YouTube, Vimeo)',
    layout: 'Formato',
    pictures: 'Imágenes',
    addPicture: 'Agregar una imagen',
  },
  problems: 'Antes de compartirla',
  noProblems: 'No falta nada.',
  preview: 'Vista previa',
  stats: {
    views: 'Visitas',
    visitors: 'Visitantes',
    clicks: 'Clics',
    clickRate: 'Tocaron algo',
    byDay: 'Por día',
    touched: 'Qué tocaron',
    sources: 'De dónde llegaron',
    devices: 'Desde qué',
    countries: 'Desde dónde',
    campaigns: 'Campañas',
    scans: 'Escaneos del QR',
    scanned: 'Desde el QR',
    pieces: { poster: 'Póster', cards: 'Tarjetas', stickers: 'Etiquetas', file: 'Archivo (SVG o PNG)', qr: 'Código QR' },
    nothing: 'Todavía nada.',
    direct: 'Directo',
    device: { mobile: 'Celular', tablet: 'Tableta', desktop: 'Computadora' },
    ofVisitors: 'de los visitantes',
  },
};

export const WORDS: Record<Locale, Words> = { en, es };
