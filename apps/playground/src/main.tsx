// The playground: the editor of a profile, its page as it is shared (/u/demo,
// counted as it is visited and touched), and its numbers.

import '@reboprofiles/react/styles.css';
import type { Profile, Summary } from '@reboprofiles/core';
import { ProfileEditor, ProfileStats } from '@reboprofiles/react';
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

function Playground() {
  const [tab, setTab] = useState<'edit' | 'stats'>('edit');
  const [profile, setProfile] = useState<Profile>();
  const [stats, setStats] = useState<{ summary: Summary; events: number }>();
  const [days, setDays] = useState(14);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => void fetch('/api/profile').then(async (r) => setProfile(await r.json())), []);
  const load = () => fetch(`/api/stats?days=${days}`).then(async (r) => setStats(await r.json()));
  // biome-ignore lint/correctness/useExhaustiveDependencies: asked again when the tab or the days change, and every few seconds while seen.
  useEffect(() => {
    if (tab !== 'stats') return;
    void load();
    const again = setInterval(load, 3000);
    return () => clearInterval(again);
  }, [tab, days]);
  // Kept as it is written, once the writing stops.
  const save = (p: Profile) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void fetch('/api/profile', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(p) }), 400);
  };
  const tabButton = (id: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        border: 0,
        font: 'inherit',
        fontWeight: 700,
        cursor: 'pointer',
        background: tab === id ? '#18181b' : 'transparent',
        color: tab === id ? '#fff' : 'inherit',
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: 20 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <b style={{ fontSize: 20, marginRight: 'auto' }}>ReboProfiles</b>
        {tabButton('edit', 'Editar')}
        {tabButton('stats', 'Estadísticas')}
        <a href="/u/demo" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#3b63fb' }}>
          Abrir la página ↗
        </a>
      </header>
      {tab === 'edit' && profile && <ProfileEditor profile={profile} onChange={save} locale="es" render={{ country: '52' }} url={`${location.origin}/u/demo`} />}
      {tab === 'stats' && (
        <>
          <p style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '0 0 14px' }}>
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                style={{ padding: '6px 12px', borderRadius: 999, border: '1.5px solid #d4d4d8', background: days === d ? '#eef2ff' : 'transparent', font: 'inherit', cursor: 'pointer' }}
              >
                {d} días
              </button>
            ))}
            <span style={{ marginLeft: 'auto', color: '#71717a' }}>{stats?.events ?? 0} eventos</span>
            <button
              type="button"
              onClick={() => void fetch('/api/simulate', { method: 'POST' }).then(load)}
              style={{ padding: '6px 12px', borderRadius: 999, border: 0, background: '#18181b', color: '#fff', font: 'inherit', cursor: 'pointer' }}
            >
              Simular 2 semanas de visitas
            </button>
          </p>
          {stats && <ProfileStats summary={stats.summary} locale="es" />}
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
);
