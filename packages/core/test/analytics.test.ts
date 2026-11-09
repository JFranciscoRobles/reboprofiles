import { describe, expect, it } from 'vitest';
import { deviceOf, type ProfileEvent, sampleProfile, sourceOf, summarize } from '../src';

describe('where a visit came from, and on what', () => {
  it('names the site it came from, the campaign’s source first', () => {
    expect(sourceOf('https://l.instagram.com/?u=x')).toBe('instagram');
    expect(sourceOf('https://www.google.com.mx/')).toBe('google');
    expect(sourceOf('https://blog.example.com/post')).toBe('blog.example.com');
    expect(sourceOf('', 'Newsletter')).toBe('newsletter');
    expect(sourceOf(null)).toBe('direct');
  });

  it('tells a phone, a tablet and a computer', () => {
    expect(deviceOf('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148')).toBe('mobile');
    expect(deviceOf('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe('tablet');
    expect(deviceOf('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('desktop');
  });
});

describe('what the events come to', () => {
  const profile = sampleProfile('en');
  const [, visit, homes] = profile.blocks;
  const at = (day: number, hour = 12) => `2026-10-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`;
  const events: ProfileEvent[] = [
    { type: 'view', at: at(28), visitor: 'a', source: 'instagram', device: 'mobile', country: 'MX' },
    { type: 'view', at: at(28, 13), visitor: 'a', source: 'instagram', device: 'mobile', country: 'MX' },
    { type: 'view', at: at(28), visitor: 'b', source: 'direct', device: 'desktop', country: 'US', campaign: 'fall' },
    { type: 'click', at: at(28), visitor: 'a', block: visit.id },
    { type: 'click', at: at(28, 14), visitor: 'a', block: visit.id },
    { type: 'view', at: at(30), visitor: 'a', source: 'google', device: 'mobile', country: 'MX' },
    { type: 'click', at: at(30), visitor: 'a', block: homes.id },
    { type: 'click', at: at(30), visitor: 'a', block: profile.blocks[3].id, part: 'instagram' },
    // Out of the days asked.
    { type: 'view', at: at(1), visitor: 'z' },
  ];

  it('counts visits, visitors each day, clicks, and of the visitors how many clicked', () => {
    const s = summarize(events, { from: '2026-10-28', to: '2026-10-30', profile });
    expect(s).toMatchObject({ views: 4, visitors: 3, clicks: 4 });
    // a on the 28th, a on the 30th; b clicked nothing.
    expect(s.clickRate).toBeCloseTo(2 / 3);
    expect(s.days).toEqual([
      { day: '2026-10-28', views: 3, visitors: 2, clicks: 2, scans: 0 },
      { day: '2026-10-29', views: 0, visitors: 0, clicks: 0, scans: 0 },
      { day: '2026-10-30', views: 1, visitors: 1, clicks: 2, scans: 0 },
    ]);
  });

  it('says what was touched, by its name, the most first', () => {
    const s = summarize(events, { from: '2026-10-28', to: '2026-10-30', profile });
    expect(s.touched.map((t) => [t.label, t.clicks])).toEqual([
      ['Book a visit', 2],
      ['Homes for sale', 1],
      ['Instagram', 1],
    ]);
    expect(s.touched[0].rate).toBeCloseTo(1 / 3);
  });

  it('counts where they came from, on what, from where and by which campaign', () => {
    const s = summarize(events, { from: '2026-10-28', to: '2026-10-30' });
    expect(s.sources).toEqual([
      { key: 'instagram', count: 2 },
      { key: 'direct', count: 1 },
      { key: 'google', count: 1 },
    ]);
    expect(s.devices[0]).toEqual({ key: 'mobile', count: 3 });
    expect(s.countries).toEqual([
      { key: 'MX', count: 3 },
      { key: 'US', count: 1 },
    ]);
    expect(s.campaigns).toEqual([{ key: 'fall', count: 1 }]);
  });

  it('counts the visits that came by the QR code, by day and by the piece scanned', () => {
    const scans: ProfileEvent[] = [
      { type: 'view', at: at(29), visitor: 'q1', source: 'qr', qr: 'poster' },
      { type: 'view', at: at(29), visitor: 'q2', source: 'qr', qr: 'poster' },
      { type: 'view', at: at(30), visitor: 'q3', source: 'qr', qr: 'cards' },
    ];
    const s = summarize([...events, ...scans], { from: '2026-10-28', to: '2026-10-30' });
    expect(s.scans).toBe(3);
    expect(s.scanned).toEqual([
      { key: 'poster', count: 2 },
      { key: 'cards', count: 1 },
    ]);
    expect(s.days.map((d) => d.scans)).toEqual([0, 2, 1]);
    expect(s.sources[0]).toEqual({ key: 'qr', count: 3 });
  });

  it('counts each day as the time zone has it', () => {
    const late = [{ type: 'view' as const, at: '2026-10-29T03:00:00Z', visitor: 'a' }];
    expect(summarize(late, { from: '2026-10-28', to: '2026-10-29', timeZone: 'America/Tijuana' }).days[0].views).toBe(1);
    expect(summarize(late, { from: '2026-10-28', to: '2026-10-29' }).days[1].views).toBe(1);
  });
});
