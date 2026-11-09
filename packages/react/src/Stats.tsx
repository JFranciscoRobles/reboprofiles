// What became of a profile, as `summarize` counts it: the visits, the
// visitors, the clicks and how many touched something, on top; the days, as
// bars of the visits with the clicks over them; and what they touched, where
// they came from, on what, from where and by which campaign, each as a list
// of bars, the most first. Drawn from the summary alone: where the events are
// kept and counted is the application's.

import type { Count, Locale, Summary } from '@reboprofiles/core';
import { WORDS } from './i18n';

export function ProfileStats({ summary: s, locale = 'en', className }: { summary: Summary; locale?: Locale; className?: string }) {
  const w = WORDS[locale].stats;
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
  // The sources by their own names; a site, as it is.
  const names: Record<string, string> = { ...SOURCES, direct: w.direct, ...w.device, qr: w.pieces.qr };
  return (
    <div className={`rps${className ? ` ${className}` : ''}`}>
      <div className="rps-numbers">
        <Figure label={w.views} value={number.format(s.views)} />
        <Figure label={w.visitors} value={number.format(s.visitors)} />
        <Figure label={w.clicks} value={number.format(s.clicks)} />
        <Figure label={w.clickRate} value={percent.format(s.clickRate)} hint={w.ofVisitors} />
        <Figure label={w.scans} value={number.format(s.scans)} />
      </div>

      <section className="rps-part rps-wide">
        <h3>{w.byDay}</h3>
        <Days days={s.days} locale={locale} labels={{ views: w.views, clicks: w.clicks }} />
      </section>

      <section className="rps-part rps-wide">
        <h3>{w.touched}</h3>
        {s.touched.length ? (
          <Bars rows={s.touched.map((t) => ({ key: `${t.block}|${t.part ?? ''}`, label: t.label, count: t.clicks, note: percent.format(t.rate) }))} />
        ) : (
          <p className="rps-empty">{w.nothing}</p>
        )}
      </section>

      {(
        [
          [w.sources, s.sources],
          [w.devices, s.devices],
          [w.countries, s.countries],
          [w.campaigns, s.campaigns],
          [w.scanned, s.scanned.map((c) => ({ ...c, key: w.pieces[c.key] ?? c.key }))],
        ] as [string, Count[]][]
      ).map(([title, rows]) => (
        <section key={title} className="rps-part">
          <h3>{title}</h3>
          {rows.length ? <Bars rows={rows.slice(0, 8).map((r) => ({ key: r.key, label: names[r.key] ?? r.key, count: r.count }))} /> : <p className="rps-empty">{w.nothing}</p>}
        </section>
      ))}
    </div>
  );
}

const SOURCES: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  x: 'X',
  whatsapp: 'WhatsApp',
  google: 'Google',
  bing: 'Bing',
};

const Figure = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rps-number">
    <span>{label}</span>
    <b>{value}</b>
    {hint && <small>{hint}</small>}
  </div>
);

/** Each a row: its name, a bar as long as its share of the first, its count, and a note after it. */
function Bars({ rows }: { rows: { key: string; label: string; count: number; note?: string }[] }) {
  const most = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ul className="rps-bars">
      {rows.map((r) => (
        <li key={r.key}>
          <span className="rps-bar" style={{ width: `${(100 * r.count) / most}%` }} />
          <span className="rps-bar-label">{r.label}</span>
          <b>{r.count}</b>
          {r.note && <small>{r.note}</small>}
        </li>
      ))}
    </ul>
  );
}

/** The days as bars of their visits, with their clicks as a line over them; each day says its numbers when pointed at. */
function Days({ days, locale, labels }: { days: Summary['days']; locale: Locale; labels: { views: string; clicks: string } }) {
  const width = 640;
  const height = 160;
  const most = Math.max(1, ...days.map((d) => Math.max(d.views, d.clicks)));
  const step = width / Math.max(1, days.length);
  const y = (n: number) => height - (height * n) / most;
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const line = days.map((d, i) => `${i ? 'L' : 'M'}${(i + 0.5) * step},${y(d.clicks)}`).join(' ');
  const every = Math.ceil(days.length / 6);
  return (
    <svg className="rps-days" viewBox={`0 0 ${width} ${height + 22}`} role="img" aria-label={labels.views}>
      {days.map((d, i) => (
        <g key={d.day}>
          <title>{`${day.format(new Date(`${d.day}T12:00:00Z`))}: ${d.views} ${labels.views.toLowerCase()}, ${d.clicks} ${labels.clicks.toLowerCase()}`}</title>
          <rect x={i * step + step * 0.15} y={y(d.views)} width={step * 0.7} height={height - y(d.views)} rx={3} className="rps-day" />
          {i % every === 0 && (
            <text x={(i + 0.5) * step} y={height + 16} textAnchor="middle" className="rps-axis">
              {day.format(new Date(`${d.day}T12:00:00Z`))}
            </text>
          )}
        </g>
      ))}
      <path d={line} className="rps-clicks" />
    </svg>
  );
}
