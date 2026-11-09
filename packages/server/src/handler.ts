// The routes a profile's page comes back to, as a function from a Request to
// a Response (a route of Next.js, a Worker, Bun, or `node:http` by
// `nodeHandler`): the visit, told by the page's beacon or its picture, and
// each link on its way to where it goes. Each told to the application as an
// event, with what was touched, where the visitor came from, on what and from
// which country; never a robot's (a preview of the link, a search engine).
// Nothing is kept here, and no cookie is set: the visitor is a mark of their
// connection made anew each day (`visitorOf`), which says who came back today
// and not who they are.

import { createHash } from 'node:crypto';
import { deviceOf, type ProfileEvent, QR_PIECE, sourceOf } from '@reboprofiles/core';
import type { Tracker } from './tracker';

/** A visit or a click, as the application is told it: its profile's id, and what `summarize` counts. */
export type TrackedEvent = ProfileEvent & { profile: string };

export interface ProfileHandlerOptions {
  tracker: Tracker;
  /** Told of each event, as it comes: kept, to be counted. */
  onEvent: (event: TrackedEvent) => void | Promise<void>;
  /** What the visitors' marks are made with: the tracker's secret will do. Long and random. */
  secret: string;
  /** Where a link that was not made here goes: the site. */
  fallback?: string;
  /** Who is asking, when the server knows it better than its headers (`x-forwarded-for`, `x-real-ip`) say. */
  ip?: (request: Request) => string | null | undefined;
}

/** A picture of one transparent pixel: the visit without scripts. */
const PIXEL = Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), (c) => c.charCodeAt(0));

/** Robots, and the previews of a link that apps make: none of them is a visitor. */
export const isRobot = (userAgent: string | null | undefined) =>
  !userAgent || /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|embedly|headless|lighthouse|curl|wget|python|okhttp/i.test(userAgent);

/** A visitor's mark for a day: the same connection and browser are the same visitor that day, another the next. Who they are, it does not say. */
export const visitorOf = (secret: string, day: string, profile: string, ip: string, userAgent: string) =>
  createHash('sha256').update(`${secret}|${day}|${profile}|${ip}|${userAgent}`).digest('base64url').slice(0, 16);

/** The country the CDN in front says the visitor is in, when there is one: Cloudflare's, Vercel's, Fastly's, or a header of one's own. */
const countryOf = (headers: Headers) => {
  const c = headers.get('cf-ipcountry') ?? headers.get('x-vercel-ip-country') ?? headers.get('fastly-geo-country-code') ?? headers.get('x-country');
  return c && /^[A-Z]{2}$/i.test(c) && c.toUpperCase() !== 'XX' ? c.toUpperCase() : undefined;
};

export function createProfileHandler(options: ProfileHandlerOptions) {
  const { tracker } = options;
  const fallback = options.fallback ?? '/';
  const who = (request: Request) =>
    options.ip?.(request) ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? request.headers.get('cf-connecting-ip') ?? '';
  const today = () => new Date().toISOString().slice(0, 10);

  return async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const at = url.pathname.indexOf(`${tracker.prefix}/`);
    const [, kind, raw] = (at >= 0 ? url.pathname.slice(at + tracker.prefix.length) : url.pathname).split('/');
    const token = (raw ?? '').replace(/\.gif$/, '');
    const profile = tracker.read(token);
    const agent = request.headers.get('user-agent');
    const visitor = (id: string) => visitorOf(options.secret, today(), id, who(request), agent ?? '');
    const tell = async (event: TrackedEvent) => {
      if (!isRobot(agent)) await options.onEvent(event);
    };

    if (kind === 'v' && (request.method === 'POST' || request.method === 'GET')) {
      if (profile) {
        // The beacon says what the page knew: where the visitor came from, the campaign of the address, the QR code it was scanned from, how wide the screen is.
        const said = request.method === 'POST' ? new URLSearchParams(await request.text().catch(() => '')) : url.searchParams;
        const qr = said.get('qr');
        const scanned = qr && QR_PIECE.test(qr) ? qr : undefined;
        await tell({
          type: 'view',
          profile,
          at: new Date(),
          visitor: visitor(profile),
          source: scanned ? 'qr' : sourceOf(said.get('r'), said.get('utm_source')),
          qr: scanned,
          campaign: said.get('utm_campaign')?.slice(0, 80) || undefined,
          device: deviceOf(agent, Number(said.get('w')) || undefined),
          country: countryOf(request.headers),
        });
      }
      return request.method === 'GET'
        ? new Response(PIXEL, { headers: { 'content-type': 'image/gif', 'cache-control': 'no-store, max-age=0' } })
        : new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
    }

    if (kind === 'c' && request.method === 'GET') {
      const to = url.searchParams.get('u') ?? '';
      const block = url.searchParams.get('b') ?? '';
      const part = url.searchParams.get('p') ?? '';
      // Only a link made here, as it was made: never anywhere else.
      if (!profile || !to || !tracker.isClick(token, to, block, part, url.searchParams.get('s') ?? '')) return Response.redirect(new URL(fallback, url).toString(), 302);
      await tell({ type: 'click', profile, at: new Date(), visitor: visitor(profile), block, part: part || undefined, url: to, device: deviceOf(agent), country: countryOf(request.headers) });
      return new Response(null, { status: 302, headers: { location: to, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer-when-downgrade' } });
    }

    return new Response('Not found', { status: 404 });
  };
}
