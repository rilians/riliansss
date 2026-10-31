import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { clamp } from "../lib/utils";

export interface Transform {
  x: number;
  y: number;
  k: number;
}

interface Options {
  /** viewBox dimensions of the SVG content */
  width: number;
  height: number;
  minK?: number;
  maxK?: number;
  initialK?: number;
}

interface Gesture {
  mode: "pan" | "pinch";
  startT: Transform;
  startClient: { x: number; y: number };
  startDist: number;
  startMid: { x: number; y: number };
}

const DRAG_THRESHOLD_PX = 5;

export function usePanZoom({ width, height, minK = 0.55, maxK = 3.2, initialK = 1 }: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState<Transform>({ x: 0, y: 0, k: initialK });
  const [animating, setAnimating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const animTimer = useRef<number | undefined>(undefined);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);
  const dragMoved = useRef(false);
  const tRef = useRef(t);
  tRef.current = t;

  /** viewBox units per CSS pixel for the current container size ("meet" fit). */
  const geometry = useCallback(() => {
    const el = containerRef.current;
    const rect = el
      ? el.getBoundingClientRect()
      : { width, height, left: 0, top: 0 };
    const scale = Math.min(rect.width / width, rect.height / height) || 1;
    return {
      scale,
      offX: (rect.width - width * scale) / 2,
      offY: (rect.height - height * scale) / 2,
      rect,
    };
  }, [width, height]);

  const clientToUnits = useCallback(
    (clientX: number, clientY: number) => {
      const { scale, offX, offY, rect } = geometry();
      return {
        x: (clientX - rect.left - offX) / scale,
        y: (clientY - rect.top - offY) / scale,
      };
    },
    [geometry],
  );

  const animateFor = useCallback((ms = 560) => {
    setAnimating(true);
    window.clearTimeout(animTimer.current);
    animTimer.current = window.setTimeout(() => setAnimating(false), ms);
  }, []);

  const zoomAt = useCallback(
    (cxUnits: number, cyUnits: number, factor: number, animate = false) => {
      setT((prev) => {
        const k = clamp(prev.k * factor, minK, maxK);
        const s = k / prev.k;
        return { k, x: cxUnits - (cxUnits - prev.x) * s, y: cyUnits - (cyUnits - prev.y) * s };
      });
      if (animate) animateFor();
    },
    [minK, maxK, animateFor],
  );

  // Non-passive wheel zoom (prevents page scroll while over the map).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = clientToUnits(e.clientX, e.clientY);
      zoomAt(c.x, c.y, Math.exp(-e.deltaY * 0.0016));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, clientToUnits]);

  // Release gestures that end outside the container (no capture engaged).
  useEffect(() => {
    const cleanup = (e: PointerEvent) => {
      if (pointers.current.delete(e.pointerId) && pointers.current.size === 0) {
        gesture.current = null;
        setDragging(false);
      }
    };
    window.addEventListener("pointerup", cleanup);
    window.addEventListener("pointercancel", cleanup);
    return () => {
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
    };
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // NOTE: pointer capture is NOT taken here — grabbing it this early would
    // retarget the later click event away from station nodes. Capture is
    // engaged lazily in onPointerMove once the drag threshold is crossed.
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      dragMoved.current = false;
      setDragging(true);
      gesture.current = {
        mode: "pan",
        startT: tRef.current,
        startClient: { x: e.clientX, y: e.clientY },
        startDist: 0,
        startMid: { x: e.clientX, y: e.clientY },
      };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      dragMoved.current = true;
      gesture.current = {
        mode: "pinch",
        startT: tRef.current,
        startClient: { x: 0, y: 0 },
        startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        startMid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      setAnimating(false);
    }
  }, []);

  const capturePointer = (e: ReactPointerEvent<HTMLElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* pointer capture is best-effort */
    }
  };

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const g = gesture.current;
      if (!g) return;

      if (g.mode === "pan" && pointers.current.size === 1) {
        const { scale } = geometry();
        const movedPastThreshold =
          Math.hypot(e.clientX - g.startClient.x, e.clientY - g.startClient.y) >
          DRAG_THRESHOLD_PX;
        if (movedPastThreshold && !dragMoved.current) {
          dragMoved.current = true;
          // Only now grab the pointer: the initial press still resolves as a
          // natural click on whatever station the user pressed.
          capturePointer(e);
        }
        if (movedPastThreshold) {
          setT((prev) => ({
            ...prev,
            x: g.startT.x + (e.clientX - g.startClient.x) / scale,
            y: g.startT.y + (e.clientY - g.startClient.y) / scale,
          }));
        }
      } else if (g.mode === "pinch" && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const midU = clientToUnits(mid.x, mid.y);
        const mid0U = clientToUnits(g.startMid.x, g.startMid.y);
        const f = clamp(g.startT.k * (dist / g.startDist), minK, maxK) / g.startT.k;
        setT({
          k: g.startT.k * f,
          x: midU.x - (mid0U.x - g.startT.x) * f,
          y: midU.y - (mid0U.y - g.startT.y) * f,
        });
      }
    },
    [geometry, clientToUnits, minK, maxK],
  );

  const endPointer = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
    } else if (pointers.current.size === 1) {
      const [p] = [...pointers.current.values()];
      gesture.current = {
        mode: "pan",
        startT: tRef.current,
        startClient: { x: p.x, y: p.y },
        startDist: 0,
        startMid: { x: p.x, y: p.y },
      };
    }
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const c = clientToUnits(rect.left + rect.width / 2, rect.top + rect.height / 2);
      zoomAt(c.x, c.y, factor, true);
    },
    [clientToUnits, zoomAt],
  );

  const reset = useCallback(() => {
    animateFor();
    setT({ x: 0, y: 0, k: initialK });
  }, [animateFor, initialK]);

  /** Centre the view on a point in map units. */
  const zoomToUnit = useCallback(
    (p: { x: number; y: number }, k = 1.6) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const c = clientToUnits(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const kk = clamp(k, minK, maxK);
      animateFor(650);
      setT({ k: kk, x: c.x - p.x * kk, y: c.y - p.y * kk });
    },
    [clientToUnits, animateFor, minK, maxK],
  );

  /** True if the last pointer gesture involved movement (suppress clicks). */
  const wasDrag = useCallback(() => dragMoved.current, []);

  return {
    containerRef,
    t,
    animating,
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: endPointer,
    onPointerCancel: endPointer,
    zoomBy,
    reset,
    zoomToUnit,
    wasDrag,
  };
}
