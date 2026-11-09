// What signs a profile's addresses: its visits' beacon, and each link of its
// page on its way to where it goes, with the block and the part it is in.
// Every token is the profile's id and a mark made with the secret; every link
// is marked with where it goes, so that no one can make up a visit of another
// profile, nor send a link of the page anywhere it was not sent to.

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { LinkPlace } from '@reboprofiles/core';

export interface TrackerOptions {
  /** Long, random, the same in every process: what the addresses are signed with. Sixteen characters at least. */
  secret: string;
  /** Where the server is seen from outside: `https://example.com`. */
  base: string;
  /** The path its routes are under; `/p` unless said. */
  prefix?: string;
}

export interface Tracker {
  /** The token of a profile: its id, and the mark that it is ours. */
  token(profile: string): string;
  /** Whose a token is; none if it is not one of ours. */
  read(token: string): string | null;
  /** Where a profile's visits are told: what `renderProfile` takes as `view`. */
  view(profile: string): string;
  /** A link of a profile's page through the server, counting its click, with where it is in the page. */
  click(profile: string, url: string, place: LinkPlace): string;
  /** What `renderProfile` takes as `link`, for a profile. */
  linkFor(profile: string): (url: string, place: LinkPlace) => string;
  /** Whether a click is as it was made: its token, where it goes, where it is, and its mark. */
  isClick(token: string, url: string, block: string, part: string, mark: string): boolean;
  readonly prefix: string;
}

const encode = (s: string) => Buffer.from(s, 'utf8').toString('base64url');
const decode = (s: string) => Buffer.from(s, 'base64url').toString('utf8');
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function createTracker({ secret, base, prefix = '/p' }: TrackerOptions): Tracker {
  if (secret.length < 16) throw new Error('The secret of the tracker has to be sixteen characters at least.');
  const mark = (value: string) => createHmac('sha256', secret).update(value).digest('base64url').slice(0, 22);
  const root = `${base.replace(/\/$/, '')}${prefix}`;
  const token = (profile: string) => `${encode(profile)}.${mark(`profile:${profile}`)}`;
  const tracker: Tracker = {
    prefix,
    token,
    read(t) {
      const [id, m] = t.split('.');
      if (!id || !m) return null;
      const profile = decode(id);
      return same(m, mark(`profile:${profile}`)) ? profile : null;
    },
    view: (profile) => `${root}/v/${token(profile)}`,
    click(profile, url, place) {
      const t = token(profile);
      const part = place.part ?? '';
      const query = new URLSearchParams({ u: url, b: place.block, ...(part ? { p: part } : {}), s: mark(`click:${t}|${url}|${place.block}|${part}`) });
      return `${root}/c/${t}?${query}`;
    },
    linkFor: (profile) => (url, place) => tracker.click(profile, url, place),
    isClick: (t, url, block, part, m) => same(m, mark(`click:${t}|${url}|${block}|${part}`)),
  };
  return tracker;
}
