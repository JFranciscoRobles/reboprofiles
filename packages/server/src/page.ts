// A profile's page as a server gives it: its HTML, its links through the
// tracker and its visit told to it, as a Response.

import { type Profile, type RenderOptions, renderProfile } from '@reboprofiles/core';
import type { Tracker } from './tracker';

export interface PageOptions extends Omit<RenderOptions, 'link' | 'view'> {
  /** Counts its visits and its clicks; none: neither. */
  tracker?: Tracker;
  /** The profile's id, as the events will say it. */
  id: string;
}

/** The page whole, ready to answer with, counted when a tracker is given. */
export function profileResponse(profile: Profile, { tracker, id, ...options }: PageOptions): Response {
  const { html } = renderProfile(profile, { ...options, ...(tracker ? { link: tracker.linkFor(id), view: tracker.view(id) } : {}) });
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}
