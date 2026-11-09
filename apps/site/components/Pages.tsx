// The pages of the site, each in the language it is given: the home (what
// ReboProfiles is, the editor working, its numbers, what it does, how it is
// put in an app) and the demo (the editor and the numbers alone). The
// documentation has a frame of its own.

import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/Chrome';
import { Demo } from '@/components/docs/Demos';
import { LocaleProvider } from '@/components/i18n';
import { LiveEditor } from '@/components/LiveEditor';
import { type L, type Locale, localize, translator } from '@/lib/i18n';
import { hrefOf, VERSION } from '@/lib/site';

const primary = 'inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark';
const secondary = 'inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 font-semibold text-ink transition-colors hover:bg-hover';

// ——— Home ———

const HOME: { title: L; description: L } = {
  title: { en: 'ReboProfiles: profile pages with their numbers', es: 'ReboProfiles: páginas de perfil con sus cifras' },
  description: {
    en: 'The one page someone shares — who they are, how to reach them, their links and what they offer — written beside it as it will look, in your app; and what every visitor touched, counted by your server.',
    es: 'La única página que alguien comparte (quién es, cómo contactarle, sus ligas y lo que ofrece), escrita junto a cómo se verá, dentro de tu aplicación; y lo que tocó cada visitante, contado por tu servidor.',
  },
};

export const homeMetadata = (locale: Locale): Metadata => ({ title: { absolute: translator(locale)(HOME.title) }, description: translator(locale)(HOME.description) });

const FEATURES: { title: L; text: L; color: string }[] = [
  {
    title: { en: 'Every click, by block', es: 'Cada clic, por bloque' },
    text: {
      en: 'Each link, button, network and item goes through your server with the block it is in. You know what was touched, and by how many of those who came.',
      es: 'Cada liga, botón, red y elemento pasa por tu servidor con el bloque en el que está. Sabes qué tocaron, y cuántos de los que llegaron.',
    },
    color: 'bg-pastel-orange text-pastel-orange-fg',
  },
  {
    title: { en: 'Where they came from', es: 'De dónde llegaron' },
    text: {
      en: 'Instagram, TikTok, WhatsApp, Google, a campaign of yours: the source of every visit, on what and from which country, by day.',
      es: 'Instagram, TikTok, WhatsApp, Google, una campaña tuya: el origen de cada visita, desde qué y desde qué país, por día.',
    },
    color: 'bg-pastel-blue text-pastel-blue-fg',
  },
  {
    title: { en: 'No cookies, no one else', es: 'Sin cookies, sin terceros' },
    text: {
      en: 'Visitors are counted by a mark of their connection made anew each day. No banner to ask for, no service of someone else’s to send them to.',
      es: 'Los visitantes se cuentan con una marca de su conexión que se hace de nuevo cada día. Sin aviso que pedir, sin el servicio de nadie más.',
    },
    color: 'bg-pastel-green text-pastel-green-fg',
  },
  {
    title: { en: 'Nine themes, and motion', es: 'Nueve temas, y movimiento' },
    text: {
      en: 'Four of them gradients, the first in your colour. Blocks that come in as the page opens, a link that pulses to be seen first.',
      es: 'Cuatro con degradado, el primero en tu color. Bloques que entran al abrir la página, una liga que late para que la vean primero.',
    },
    color: 'bg-pastel-pink text-pastel-pink-fg',
  },
  {
    title: { en: 'Blocks of your own', es: 'Bloques propios' },
    text: {
      en: 'The homes an agent sells, the dishes of a cook: register a block with what it asks and its HTML, laid out in five ways. ReboProfiles knows nothing of what you sell.',
      es: 'Las casas de un asesor, los platillos de un cocinero: registras un bloque con lo que pide y su HTML, en cinco formatos. ReboProfiles no sabe nada de lo que vendes.',
    },
    color: 'bg-pastel-purple text-pastel-purple-fg',
  },
  {
    title: { en: 'Yours, piece by piece', es: 'Tuyo, pieza por pieza' },
    text: {
      en: 'The page is plain HTML any server gives; the profile is JSON your app keeps; the events are yours. English and Spanish, MIT.',
      es: 'La página es HTML que cualquier servidor entrega; el perfil es JSON que guarda tu aplicación; los eventos son tuyos. Inglés y español, MIT.',
    },
    color: 'bg-pastel-yellow text-pastel-yellow-fg',
  },
];

const CODE: { title: string; page: string; code: string }[] = [
  {
    title: '@reboprofiles/react',
    page: 'editor',
    code: `import '@reboprofiles/react/styles.css';
import { ProfileEditor } from '@reboprofiles/react';

<ProfileEditor profile={profile} onChange={save} locale="es" />`,
  },
  {
    title: '@reboprofiles/server',
    page: 'tracking',
    code: `import { createProfileHandler, createTracker,
  profileResponse } from '@reboprofiles/server';

const tracker = createTracker({ secret, base });
profileResponse(profile, { id, tracker });
createProfileHandler({ tracker, secret, onEvent: keep });`,
  },
  {
    title: '@reboprofiles/core',
    page: 'numbers',
    code: `import { summarize } from '@reboprofiles/core';

const { views, visitors, clicks, touched,
  sources } = summarize(events, { profile });`,
  },
];

export function HomePage({ locale }: { locale: Locale }) {
  const t = translator(locale);
  return (
    <>
      <SiteHeader locale={locale} path="/" />
      <main>
        <section className="mx-auto max-w-[920px] px-6 pb-12 pt-20 text-center">
          <span className="rounded-full bg-brand-light px-3 py-1 text-[13px] font-semibold text-brand-dark">
            v{VERSION} · {t({ en: 'the profiles of the Rebo suite', es: 'los perfiles de la suite Rebo' })}
          </span>
          <h1 className="mt-6 font-display text-[clamp(38px,6vw,68px)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            {t({ en: 'One page. Every click counted.', es: 'Una página. Cada clic contado.' })}
          </h1>
          <p className="mx-auto mt-5 max-w-[660px] text-[clamp(17px,2vw,20px)] leading-relaxed text-ink-soft">{t(HOME.description)}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#try" className={primary}>
              {t({ en: 'Try it here', es: 'Pruébalo aquí' })}
            </a>
            <Link href={localize('/docs/', locale)} className={secondary}>
              {t({ en: 'Read the docs', es: 'Leer la documentación' })}
            </Link>
          </div>
        </section>

        <section id="try" className="mx-auto max-w-[1280px] scroll-mt-20 px-4">
          <div className="rounded-[28px] border border-line bg-surface p-[clamp(10px,2vw,22px)] shadow-editor">
            <LiveEditor locale={locale} />
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            {t({
              en: 'This is the editor, working. Write your name, choose a theme, open a block, add one: the page beside it is the one that is shared.',
              es: 'Este es el editor, funcionando. Escribe tu nombre, elige un tema, abre un bloque, agrega otro: la página de al lado es la que se comparte.',
            })}
          </p>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <h2 className="text-center font-display text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.03em]">{t({ en: 'And what became of it', es: 'Y qué pasó con ella' })}</h2>
          <p className="mx-auto mt-3 max-w-[640px] text-center text-ink-soft">
            {t({
              en: 'How many came, how many touched something and what, from where and on what, by day. The numbers of a month of made-up visits:',
              es: 'Cuántos llegaron, cuántos tocaron algo y qué, desde dónde y desde qué, por día. Las cifras de un mes de visitas inventadas:',
            })}
          </p>
          {/* The demos say their words in the page's language, as in the documentation. */}
          <LocaleProvider locale={locale}>
            <Demo name="stats" />
          </LocaleProvider>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <h2 className="text-center font-display text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.03em]">{t({ en: 'What it does', es: 'Qué hace' })}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title.en} className="rounded-2xl border border-line p-6">
                <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-semibold ${f.color}`}>{t(f.title)}</span>
                <p className="mt-4 leading-relaxed text-ink-soft">{t(f.text)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <h2 className="text-center font-display text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.03em]">{t({ en: 'Three packages, one at a time', es: 'Tres paquetes, uno a la vez' })}</h2>
          <p className="mx-auto mt-3 max-w-[620px] text-center text-ink-soft">
            {t({
              en: 'Take the editor, the server or the engine alone: each one stands on the engine, nothing more.',
              es: 'Toma el editor, el servidor o el motor por separado: cada uno se apoya en el motor y en nada más.',
            })}
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {CODE.map((c) => (
              <div key={c.title} className="flex flex-col overflow-hidden rounded-2xl border border-line">
                <Link href={localize(hrefOf(c.page), locale)} className="border-b border-line bg-surface px-5 py-3 font-code text-sm font-semibold hover:text-brand-dark">
                  {c.title}
                </Link>
                <pre className="flex-1 overflow-x-auto bg-[#16181d] p-5 font-code text-[13px] leading-relaxed text-[#e7e7ea]">{c.code}</pre>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

// ——— Demo ———

export const demoMetadata = (locale: Locale): Metadata => ({
  title: 'Demo',
  description: translator(locale)({ en: 'The ReboProfiles editor and its numbers, working.', es: 'El editor de ReboProfiles y sus cifras, funcionando.' }),
});

export function DemoPage({ locale }: { locale: Locale }) {
  return (
    <>
      <SiteHeader locale={locale} path="/demo/" />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <LiveEditor locale={locale} />
        <LocaleProvider locale={locale}>
          <Demo name="stats" />
        </LocaleProvider>
      </main>
    </>
  );
}
