// A profile to start from and to try things with: someone who sells homes,
// with the buttons to reach them, two links, their networks, a few words and
// a video, in English or Spanish.

import { blankProfile, newId } from './blocks';
import type { Profile } from './model';
import type { Locale } from './render';

export function sampleProfile(locale: Locale = 'en'): Profile {
  const es = locale === 'es';
  const id = newId;
  return {
    ...blankProfile({
      name: 'Laura Méndez',
      headline: es ? 'Asesora inmobiliaria · Playas de Tijuana' : 'Real estate agent · Playas de Tijuana',
      bio: es
        ? 'Te ayudo a comprar, vender o rentar tu casa desde 2015. Conozco cada colonia de la costa.'
        : 'I help you buy, sell or rent your home, since 2015. I know every neighbourhood of the coast.',
      location: 'Tijuana, B.C.',
      badge: 'AMPI 4821',
      theme: 'accent',
      accent: '#0e7490',
    }),
    blocks: [
      { id: id(), type: 'contact', whatsapp: '664 123 4567', phone: '664 123 4567', email: 'laura@example.com', message: es ? 'Hola Laura, vi tu página.' : 'Hi Laura, I saw your page.' },
      {
        id: id(),
        type: 'link',
        label: es ? 'Agenda una visita' : 'Book a visit',
        url: 'https://example.com/visit',
        note: es ? 'Elige día y hora' : 'Pick a day and a time',
        icon: '📅',
        highlight: 'pulse',
      },
      { id: id(), type: 'link', label: es ? 'Casas en venta' : 'Homes for sale', url: 'https://example.com/homes', note: '', icon: '🏡', highlight: 'none' },
      { id: id(), type: 'socials', links: { instagram: 'https://instagram.com/example', facebook: 'https://facebook.com/example', tiktok: 'https://tiktok.com/@example' } },
      { id: id(), type: 'heading', text: es ? 'Cómo trabajo' : 'How I work' },
      { id: id(), type: 'text', text: es ? 'Te acompaño desde la primera visita hasta la firma ante notario.' : 'I go with you from the first visit to the signing before the notary.' },
      { id: id(), type: 'video', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', title: es ? 'Un recorrido por la costa' : 'A tour of the coast' },
    ],
  };
}
