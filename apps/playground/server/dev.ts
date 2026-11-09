// What a server of profiles does, in the playground: the profile kept as it
// is written, its page given as it is shared, its visits and clicks counted by
// `@reboprofiles/server`, and its numbers as `summarize` makes them. In
// memory: gone when the playground stops.

import type { IncomingMessage, ServerResponse } from 'node:http';
import { type ProfileEvent, readProfile, sampleProfile, summarize } from '@reboprofiles/core';
import { createProfileHandler, createTracker, nodeHandler, profileResponse } from '@reboprofiles/server';

const BASE = 'http://localhost:5310';
const SECRET = 'the-playground-secret-not-for-production';
const tracker = createTracker({ secret: SECRET, base: BASE });

let profile = sampleProfile('es');
const events: ProfileEvent[] = [];
const routes = createProfileHandler({ tracker, secret: SECRET, fallback: BASE, onEvent: (e) => void events.push(e) });

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

/** Visits and clicks made up over the last fourteen days, as many visitors would: to see the numbers before there are real ones. */
function simulate() {
  const sources = ['instagram', 'instagram', 'instagram', 'whatsapp', 'tiktok', 'google', 'direct', 'facebook'];
  const devices = ['mobile', 'mobile', 'mobile', 'mobile', 'desktop', 'tablet'] as const;
  const countries = ['MX', 'MX', 'MX', 'MX', 'US', 'US', 'CA'];
  const clickable = profile.blocks.filter((b) => b.type !== 'heading' && b.type !== 'text' && b.type !== 'divider');
  const pick = <T>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
  for (let d = 13; d >= 0; d--) {
    const visitors = 8 + Math.floor(Math.random() * 25) + (d < 4 ? 15 : 0);
    for (let v = 0; v < visitors; v++) {
      const at = new Date(Date.now() - d * 86_400_000 - Math.random() * 40_000_000);
      const visitor = `sim-${d}-${v}`;
      // One in eight comes by the QR code printed: a poster in the office, the cards handed out.
      const qr = Math.random() < 0.13 ? pick(['poster', 'poster', 'cards', 'cards', 'cards', 'stickers', 'file']) : undefined;
      events.push({ type: 'view', at, visitor, source: qr ? 'qr' : pick(sources), qr, device: pick(devices), country: pick(countries), campaign: Math.random() < 0.15 ? 'otono' : undefined });
      if (clickable.length && Math.random() < 0.55) {
        const b = pick(clickable);
        const part = b.type === 'contact' ? pick(['whatsapp', 'whatsapp', 'phone', 'email']) : b.type === 'socials' ? pick(['instagram', 'tiktok', 'facebook']) : undefined;
        events.push({ type: 'click', at, visitor, block: b.id, part });
      }
    }
  }
}

export async function handle(req: IncomingMessage, res: ServerResponse) {
  return nodeHandler(async (request) => {
    const url = new URL(request.url);
    if (url.pathname === '/api/profile' && request.method === 'GET') return json(profile);
    if (url.pathname === '/api/profile' && request.method === 'PUT') {
      profile = readProfile(await request.json());
      return json({ ok: true });
    }
    if (url.pathname === '/api/stats') {
      const days = Number(url.searchParams.get('days')) || 14;
      const to = new Date().toISOString().slice(0, 10);
      const from = new Date(Date.now() - (days - 1) * 86_400_000).toISOString().slice(0, 10);
      return json({ summary: summarize(events, { from, to, profile, locale: 'es' }), events: events.length });
    }
    if (url.pathname === '/api/simulate' && request.method === 'POST') {
      simulate();
      return json({ events: events.length });
    }
    if (url.pathname === '/u/demo') return profileResponse(profile, { id: 'demo', tracker, locale: 'es', country: '52', footer: { label: 'Hecho con ReboProfiles', url: BASE } });
    if (url.pathname.startsWith('/p/')) return routes(request);
    return new Response('Not found', { status: 404 });
  })(req, res);
}
