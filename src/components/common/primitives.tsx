import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTE_MAP } from "../../data/routes";
import type { RouteId } from "../../types";
import { cn } from "../../lib/utils";

/* ---------------------------------------------------------------- */
/* Reveal — scroll-into-view fade/slide wrapper                      */
/* ---------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/* SectionHead — numbered editorial section header                   */
/* ---------------------------------------------------------------- */
export function SectionHead({
  index,
  eyebrow,
  title,
  action,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      {(eyebrow || index) && (
        <Reveal>
          <p className="eyebrow">
            {index && <span className="text-signal">{index}</span>}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        </Reveal>
      )}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <Reveal delay={0.05}>
          <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            {title}
          </h2>
        </Reveal>
        {action && <Reveal delay={0.1}>{action}</Reveal>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Container                                                         */
/* ---------------------------------------------------------------- */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-10", className)}>{children}</div>
  );
}

/* ---------------------------------------------------------------- */
/* RouteChip — colored line identifier                               */
/* ---------------------------------------------------------------- */
export function RouteChip({
  routeId,
  showColor = true,
  className,
}: {
  routeId: RouteId;
  showColor?: boolean;
  className?: string;
}) {
  const route = ROUTE_MAP[routeId];
  if (!route) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {showColor && (
        <span
          aria-hidden
          className="inline-block h-2.5 w-2.5"
          style={{ backgroundColor: route.color }}
        />
      )}
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em]">
        {route.code} {route.name}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* ArrowLink — editorial text link                                   */
/* ---------------------------------------------------------------- */
export function ArrowLink({
  to,
  children,
  className,
  onClick,
  dir = "r",
}: {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dir?: "r" | "d";
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink",
        className,
      )}
    >
      <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-signal">
        {children}
      </span>
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        {dir === "r" ? "→" : "↓"}
      </span>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* SampleTag — visible "replace me" annotation                       */
/* ---------------------------------------------------------------- */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block border border-dashed border-muted/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted",
        className,
      )}
    >
      Sample content — edit src/data
    </span>
  );
}
