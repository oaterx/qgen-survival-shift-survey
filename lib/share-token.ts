// Packs the three axis scores into a single opaque, URL-safe token instead
// of plain "?f=25&c=55&w=80" query params, so a shared result link doesn't
// visibly expose the score breakdown in its URL. Not meant as security —
// just avoids the obvious readable pattern.
export function encodeScoreToken(f: number, c: number, w: number): string {
  const raw = `${f.toFixed(4)},${c.toFixed(4)},${w.toFixed(4)}`;
  const b64 = btoa(raw);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeScoreToken(token: string): { f: number; c: number; w: number } | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const raw = atob(padded);
    const [fStr, cStr, wStr] = raw.split(",");
    const f = parseFloat(fStr);
    const c = parseFloat(cStr);
    const w = parseFloat(wStr);
    if ([f, c, w].some((n) => Number.isNaN(n))) return null;
    return { f, c, w };
  } catch {
    return null;
  }
}
