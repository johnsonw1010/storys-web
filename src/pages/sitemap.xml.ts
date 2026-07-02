import type { APIRoute } from "astro";
import { BRANDS } from "../data/brands";
import { getAllEpisodes } from "../lib/episodes";

// Prerender to a static sitemap.xml at build time (hybrid output defaults to on-demand).
export const prerender = true;

// Stable, indexable top-level pages (excludes 404 and any param-driven routes).
const STATIC_PATHS = ["", "about", "team", "map", "episodes", "visit", "apply", "contact"];

const xmlEscape = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = ({ site }) => {
  // Origin comes from astro.config's `site` (single source of truth); strip trailing slash.
  const origin = (site ?? new URL("https://storys.fm")).href.replace(/\/$/, "");
  const url = (path: string): string => (path ? `${origin}/${path}` : `${origin}/`);

  const locs = new Set<string>();
  for (const p of STATIC_PATHS) locs.add(url(p));
  for (const b of BRANDS) locs.add(url(`brands/${b.id}`));
  for (const e of getAllEpisodes()) {
    if (e.num != null) locs.add(url(`episodes/${e.num}`));
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...locs]
      .map((loc) => `  <url><loc>${xmlEscape(loc)}</loc></url>`)
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
