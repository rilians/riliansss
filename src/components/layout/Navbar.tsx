import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Download, Menu, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useUiStore } from "../../store/ui";

const LINKS = [
  { to: "/journey", label: "Journey Map", n: "01" },
  { to: "/work", label: "Selected Works", n: "02" },
  { to: "/about", label: "About", n: "03" },
  { to: "/contact", label: "Contact", n: "04" },
];

export function Roundel({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="1" y="16.75" width="38" height="6.5" fill="#F06442" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const togglePalette = useUiStore((s) => s.togglePalette);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "border-b border-ink/10 bg-paper/92 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3"
            aria-label="LIFE IN ROUTES — home"
          >
            <Roundel />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-bold tracking-[0.02em]">
                LIFE IN ROUTES
              </span>
              <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.3em] text-muted">
                EST. 2026 · MMXXVI
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "group relative font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="mr-1.5 text-[9px] text-signal">{link.n}</span>
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-2 left-0 h-[2px] bg-signal transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={togglePalette}
              className="hidden h-9 items-center gap-2 border border-ink/20 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:border-ink hover:text-ink md:flex"
              aria-label="Open search palette (Command K)"
            >
              <Search size={13} aria-hidden />
              <span>Search</span>
              <kbd className="border border-ink/20 px-1 py-0.5 text-[9px]">⌘K</kbd>
            </button>
            <a
              href="/cv.pdf"
              download
              className="btn btn--primary hidden !px-4 !py-2 md:inline-flex"
            >
              <Download size={13} aria-hidden />
              CV
            </a>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center border border-ink/20 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-24 lg:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center px-6" aria-label="Mobile">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-baseline gap-4 border-b border-line py-5",
                        isActive ? "text-signal" : "text-ink",
                      )
                    }
                  >
                    <span className="font-mono text-xs text-muted">{link.n}</span>
                    <span className="font-display text-3xl font-bold tracking-tight">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="ml-auto self-center text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between border-t border-line px-6 py-5"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  togglePalette();
                }}
                className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
              >
                <Search size={14} aria-hidden /> Search the network
              </button>
              <a href="/cv.pdf" download className="btn btn--primary !px-4 !py-2.5">
                <Download size={13} aria-hidden /> CV
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
