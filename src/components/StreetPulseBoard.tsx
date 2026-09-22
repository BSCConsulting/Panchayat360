"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Option = { id: string; label: string; sub?: string };

const DEFAULT_OPTIONS: Option[] = [
  { id: "A", label: "TDP–JSP–BJP", sub: "NDA coalition" },
  { id: "B", label: "YSRCP", sub: "Opposition" },
  { id: "C", label: "Independent", sub: "Local strongman" },
  { id: "D", label: "Undecided", sub: "Floating vote" },
];

type Props = {
  title?: string;
  location?: string;
  options?: Option[];
  onPick?: (id: string) => void;
};

/** Street vox-pop board (inspired by field A/B/C/D polling boards). */
export function StreetPulseBoard({
  title = "స్థానిక సెంటిమెంట్ బోర్డు",
  location = "NTR · Field Pulse",
  options = DEFAULT_OPTIONS,
  onPick,
}: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [tallies, setTallies] = useState<Record<string, number>>(() =>
    Object.fromEntries(options.map((o) => [o.id, 0])),
  );

  function choose(id: string) {
    setPicked(id);
    setTallies((t) => ({ ...t, [id]: (t[id] ?? 0) + 1 }));
    onPick?.(id);
  }

  const total = Object.values(tallies).reduce((a, b) => a + b, 0) || 1;

  return (
    <section className="overflow-hidden rounded-[32px] border border-black/[0.05] bg-[#0F172A] text-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#EF4444]" />
          {location}
        </span>
        <span className="text-[10px] font-semibold text-white/50">
          Live street board · {total - 1} taps
        </span>
      </div>
      <div className="px-5 pb-2 sm:px-6">
        <h3
          className="text-xl font-black tracking-tight sm:text-2xl"
          style={{ fontFamily: "var(--font-noto-te), sans-serif", lineHeight: 1.6 }}
        >
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">
        {options.map((o) => {
          const pct = Math.round(((tallies[o.id] ?? 0) / total) * 100);
          const active = picked === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className={cn(
                "relative min-h-[96px] rounded-[24px] border p-4 text-left transition-all",
                active
                  ? "border-[#F59E0B] bg-[#F59E0B]/15 ring-2 ring-[#F59E0B]/40"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              )}
            >
              <span className="text-2xl font-black text-[#F59E0B]">{o.id}</span>
              <p className="mt-1 text-xs font-bold leading-snug">{o.label}</p>
              {o.sub && (
                <p className="mt-0.5 text-[10px] text-white/50">{o.sub}</p>
              )}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#007AFF] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-white/60">
                {pct}%
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
