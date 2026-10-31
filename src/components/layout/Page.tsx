import { motion } from "motion/react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Page shell: route transition + scroll reset + top padding for the fixed navbar.
 */
export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn("min-h-screen pt-20 md:pt-24", className)}
    >
      {children}
    </motion.main>
  );
}
