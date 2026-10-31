/** Tiny class-name joiner (keeps bundle free of extra deps). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** "D7"-style grid reference for a point on the map canvas. */
export function gridRef(x: number, y: number, cols = 10, rows = 6): string {
  const col = Math.floor((x / 1200) * cols);
  const row = Math.floor((y / 780) * rows);
  if (col < 0 || row < 0 || col >= cols || row >= rows) return "—";
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}
