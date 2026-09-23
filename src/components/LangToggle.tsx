"use client";

import { cn } from "@/lib/cn";
import type { Lang } from "@/types";

type Props = {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
  /** dark = over photo / war board */
  tone?: "light" | "dark";
};

export function LangToggle({
  lang,
  onChange,
  className,
  tone = "light",
}: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-full p-1",
        dark
          ? "border border-white/15 bg-black/35 backdrop-blur-md"
          : "border border-[var(--pp-ink)]/10 bg-[var(--pp-dust-deep)]/80",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("te")}
        className={cn(
          "h-8 min-w-[52px] rounded-full px-3 text-xs font-bold transition-all",
          lang === "te"
            ? dark
              ? "bg-[var(--pp-amber)] text-[var(--pp-midnight)]"
              : "bg-white text-[var(--pp-ink)] shadow-sm"
            : dark
              ? "text-white/60 hover:text-white"
              : "text-[var(--pp-muted)] hover:text-[var(--pp-ink)]",
        )}
      >
        తెలుగు
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "h-8 min-w-[40px] rounded-full px-3 text-xs font-bold transition-all",
          lang === "en"
            ? dark
              ? "bg-[var(--pp-amber)] text-[var(--pp-midnight)]"
              : "bg-white text-[var(--pp-ink)] shadow-sm"
            : dark
              ? "text-white/60 hover:text-white"
              : "text-[var(--pp-muted)] hover:text-[var(--pp-ink)]",
        )}
      >
        EN
      </button>
    </div>
  );
}
