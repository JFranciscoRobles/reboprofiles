import { sampleProfile } from '@reboprofiles/core';
import { describe, expect, it } from 'vitest';
import { createProfileHandler, createTracker, isRobot, profileResponse, type TrackedEvent, visitorOf } from '../src';

const SECRET = 'a-secret-long-enough-for-this';
const tracker = createTracker({ secret: SECRET, base: 'https://example.com' });
const PHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148';

function setUp() {
  const events: TrackedEvent[] = [];
  const handle = createProfileHandler({ tracker, secret: SECRET, onEvent: (e) => void events.push(e), fallback: 'https://example.com/' });
  return { events, handle };
}

describe('the tracker', () => {
  it('signs a profile’s token, and knows a made-up one', () => {
    const token = tracker.token('laura');
    expect(tracker.read(token)).toBe('laura');
    expect(tracker.read(token.replace(/^[^.]+/, Buffer.from('ana').toString('base64url')))).toBeNull();
    expect(tracker.view('laura')).toBe(`https://example.com/p/v/${token}`);
  });

  it('refuses a secret too short', () => {
    expect(() => createTracker({ secret: 'short', base: 'https://x.com' })).toThrow();
  });
});

describe('the routes', () => {
  it('tells a visit from the beacon: where they came from, the campaign, on what, from which country', async () => {
    const { events, handle } = setUp();
    const body = new URLSearchParams({ r: 'https://l.instagram.com/', utm_campaign: 'fall', w: '390' });
    const answer = await handle(new Request(tracker.view('laura'), { method: 'POST', body, headers: { 'user-agent': PHONE, 'cf-ipcountry': 'mx', 'x-forwarded-for': '1.2.3.4' } }));
    expect(answer.status).toBe(204);
    expect(events).toEqual([expect.objectContaining({ type: 'view', profile: 'laura', source: 'instagram', campaign: 'fall', device: 'mobile', country: 'MX' })]);
  });

  it('tells a visit that came by the QR code, and from which piece; never a mark made up', async () => {
    const { events, handle } = setUp();
    await handle(new Request(tracker.view('laura'), { method: 'POST', body: new URLSearchParams({ r: '', qr: 'cards' }), headers: { 'user-agent': PHONE } }));
    await handle(new Request(tracker.view('laura'), { method: 'POST', body: new URLSearchParams({ qr: '<script>' }), headers: { 'user-agent': PHONE } }));
    expect(events[0]).toMatchObject({ type: 'view', source: 'qr', qr: 'cards' });
    expect(events[1]).toMatchObject({ source: 'direct' });
    expect(events[1].qr).toBeUndefined();
  });

  it('tells a visit without scripts by its picture', async () => {
    const { events, handle } = setUp();
    const answer = await handle(new Request(tracker.view('laura'), { headers: { 'user-agent': PHONE } }));
    expect(answer.headers.get('content-type')).toBe('image/gif');
    expect(events[0]).toMatchObject({ type: 'view', source: 'direct' });
  });

  it('counts a click on its way, with its block and part, and goes where it was sent', async () => {
    const { events, handle } = setUp();
    const link = tracker.click('laura', 'https://wa.me/526641234567', { block: 'b1', type: 'contact', part: 'whatsapp' });
    const answer = await handle(new Request(link, { headers: { 'user-agent': PHONE } }));
    expect(answer.status).toBe(302);
    expect(answer.headers.get('location')).toBe('https://wa.me/526641234567');
    expect(events).toEqual([expect.objectContaining({ type: 'click', profile: 'laura', block: 'b1', part: 'whatsapp', url: 'https://wa.me/526641234567' })]);
  });

  it('never sends a link anywhere it was not sent to, nor counts it', async () => {
    const { events, handle } = setUp();
    const link = new URL(tracker.click('laura', 'https://x.com', { block: 'b1', type: 'link' }));
    link.searchParams.set('u', 'https://evil.com');
    const answer = await handle(new Request(link, { headers: { 'user-agent': PHONE } }));
    expect(answer.headers.get('location')).toBe('https://example.com/');
    const moved = new URL(tracker.click('laura', 'https://x.com', { block: 'b1', type: 'link' }));
    moved.searchParams.set('b', 'b2');
    expect((await handle(new Request(moved, { headers: { 'user-agent': PHONE } }))).headers.get('location')).toBe('https://example.com/');
    expect(events).toEqual([]);
  });

  it('counts no robot, nor a link’s preview', async () => {
    const { events, handle } = setUp();
    for (const agent of ['Googlebot/2.1', 'facebookexternalhit/1.1', 'WhatsApp/2.23', ''])
      await handle(new Request(tracker.view('laura'), { method: 'POST', body: '', headers: agent ? { 'user-agent': agent } : {} }));
    expect(events).toEqual([]);
    expect(isRobot(PHONE)).toBe(false);
  });

  it('makes the same visitor of the same connection the same day, another the next, and does not say who', () => {
    const a = visitorOf(SECRET, '2026-10-30', 'laura', '1.2.3.4', PHONE);
    expect(visitorOf(SECRET, '2026-10-30', 'laura', '1.2.3.4', PHONE)).toBe(a);
    expect(visitorOf(SECRET, '2026-10-31', 'laura', '1.2.3.4', PHONE)).not.toBe(a);
    expect(a).not.toContain('1.2.3.4');
  });
});

describe('the page', () => {
  it('answers with its HTML, its links through the tracker and its visit told', async () => {
    const answer = profileResponse(sampleProfile('es'), { id: 'laura', tracker, locale: 'es', country: '52' });
    const html = await answer.text();
    expect(answer.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('https://example.com/p/c/');
    expect(html).toContain(JSON.stringify(tracker.view('laura')));
    expect(html).not.toContain('href="https://example.com/visit"');
  });
});
