import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ROUTES } from "../../data/routes";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";

function KeyRegular() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="4.5" fill="var(--color-card)" stroke="#F06442" strokeWidth="2" />
      <circle cx="8" cy="8" r="1.4" fill="#F06442" />
    </svg>
  );
}
function KeyInterchange() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth="1.8" />
      <circle cx="8" cy="8" r="2.4" fill="var(--color-ink)" />
    </svg>
  );
}
function KeyTerminal() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="3.5" y="3.5" width="9" height="9" rx="1" fill="#F06442" stroke="var(--color-ink)" strokeWidth="1.8" />
    </svg>
  );
}
function KeyTransfer() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="4.2" y="4.2" width="7.6" height="7.6" fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth="1.8" transform="rotate(45 8 8)" />
      <circle cx="8" cy="8" r="1.3" fill="var(--color-ink)" />
    </svg>
  );
}

export default function MapLegend() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = open === null ? isDesktop : open;

  return (
    <div className="no-print absolute bottom-3 left-3 z-10">
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        className="mb-1.5 flex items-center gap-2 border border-ink/20 bg-card/95 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink"
      >
        Legend
        <ChevronDown
          size={13}
          aria-hidden
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="w-[215px] border border-ink/15 bg-card/95 p-4">
          <p className="meta-label">Lines</p>
          <ul className="mt-3 space-y-2.5">
            {ROUTES.map((r) => (
              <li key={r.id} className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-7" style={{ backgroundColor: r.color }} aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                  {r.code} {r.name}
                </span>
              </li>
            ))}
          </ul>
          <div className="my-3.5 h-px bg-line" />
          <p className="meta-label">Stations</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2.5">
            <li className="flex items-center gap-2">
              <KeyRegular />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Regular</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyInterchange />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Interchange</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyTerminal />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Terminal</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyTransfer />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">Transfer</span>
            </li>
          </ul>
          <p className="mt-3.5 border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Schematic map — not to scale
          </p>
        </div>
      )}
    </div>
  );
}
