/**
 * Encode/decode "visit" route picks in the URL hash, with no backend.
 *
 * URL shape: /visit#zhenfan,vacanza,nubra
 * Brand IDs are passed as a comma-separated list in the hash fragment.
 * Hash (not query string) so the URL doesn't trigger an Astro reload.
 */

export function encodeVisit(ids: string[]): string {
  const clean = ids
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .slice(0, 12);
  return clean.join(",");
}

export function decodeVisit(hash: string): string[] {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!trimmed) return [];
  return trimmed
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^[a-z0-9-]+$/i.test(id))
    .slice(0, 12);
}
