"use client";

import { cn } from "@/lib/cn";
import type { Lang } from "@/types";

type Props = {
  lang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
};

export function LangToggle({ lang, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "flex h-11 items-center rounded-full border border-black/[0.04] bg-[#F5F5F7] p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange("te")}
        className={cn(
          "h-9 min-w-[56px] rounded-full px-3 text-xs font-bold transition-all",
          lang === "te"
            ? "bg-white text-[#007AFF] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            : "text-[#6E6E73] hover:text-[#1D1D1F]",
        )}
      >
        తెలుగు
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "h-9 min-w-[44px] rounded-full px-3 text-xs font-bold transition-all",
          lang === "en"
            ? "bg-white text-[#007AFF] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            : "text-[#6E6E73] hover:text-[#1D1D1F]",
        )}
      >
        EN
      </button>
    </div>
  );
}
