import type { RefObject } from "react";

/**
 * Converts a client (browser) position into map units for a "meet"-fitted
 * SVG with the given viewBox size.
 */
export function clientToGrid(
  clientX: number,
  clientY: number,
  container: RefObject<HTMLElement | null> | HTMLElement | null,
  mapW: number,
  mapH: number,
): { x: number; y: number } | null {
  const el = container && "current" in container ? container.current : container;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const scale = Math.min(rect.width / mapW, rect.height / mapH) || 1;
  const offX = (rect.width - mapW * scale) / 2;
  const offY = (rect.height - mapH * scale) / 2;
  return {
    x: (clientX - rect.left - offX) / scale,
    y: (clientY - rect.top - offY) / scale,
  };
}
