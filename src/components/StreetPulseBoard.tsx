"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Option = { id: string; label: string; labelTe?: string; sub?: string };

const DEFAULT_OPTIONS: Option[] = [
  {
    id: "A",
    label: "TDP–JSP–BJP",
    labelTe: "టీడీపీ–జేఎస్‌పీ–బీజేపీ",
    sub: "NDA",
  },
  { id: "B", label: "YSRCP", labelTe: "వైఎస్ఆర్‌సీపీ", sub: "Opposition" },
  {
    id: "C",
    label: "Independent",
    labelTe: "స్వతంత్ర",
    sub: "Local",
  },
  { id: "D", label: "Undecided", labelTe: "నిర్ణయం లేదు", sub: "Float" },
];

type Props = {
  id?: string;
  title?: string;
  location?: string;
  options?: Option[];
  onPick?: (id: string) => void;
  teLabels?: boolean;
};

/** Painted tin election street board — chalk tallies that jump on tap. */
export function StreetPulseBoard({
  id,
  title = "స్థానిక సెంటిమెంట్ బోర్డు",
  location = "NTR · Field Pulse",
  options = DEFAULT_OPTIONS,
  onPick,
  teLabels = true,
}: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const [tallies, setTallies] = useState<Record<string, number>>(() =>
    Object.fromEntries(options.map((o) => [o.id, 0])),
  );
  const [pop, setPop] = useState<string | null>(null);

  function choose(optId: string) {
    setPicked(optId);
    setPop(optId);
    setTallies((t) => ({ ...t, [optId]: (t[optId] ?? 0) + 1 }));
    onPick?.(optId);
    window.setTimeout(() => setPop(null), 450);
  }

  const total = Object.values(tallies).reduce((a, b) => a + b, 0) || 1;

  return (
    <section id={id} className="relative">
      {/* Bolt corners */}
      <div
        className="relative overflow-hidden border-[5px] border-[#1a1510] shadow-[0_28px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,220,160,0.15)]"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, #5a4a35 0%, transparent 50%), linear-gradient(160deg, #4a3c2a 0%, #2e2418 45%, #1c1610 100%)",
        }}
      >
        {/* Scratched tin texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(95deg, transparent, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 3px), repeating-linear-gradient(-12deg, transparent, transparent 6px, rgba(255,220,160,0.08) 6px, rgba(255,220,160,0.08) 7px)",
          }}
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-3 border-b-2 border-[#8b6914]/50 bg-[#c9a227]/20 px-4 py-3 sm:px-5">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffe9a8]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ff2d2d] shadow-[0_0_8px_#ff2d2d]" />
            {location}
          </span>
          <span className="rounded-sm bg-black/40 px-2 py-0.5 font-mono text-[10px] font-bold text-[#ffe9a8]">
            చాక్ టాలీ · {Object.values(tallies).reduce((a, b) => a + b, 0)}
          </span>
        </div>

        <div className="relative px-4 pb-2 pt-5 sm:px-6">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9a227]">
            Street board · A / B / C / D
          </p>
          <h3
            className="text-2xl font-black leading-snug text-[#fff6e0] sm:text-3xl md:text-[2.15rem]"
            style={{
              fontFamily: "var(--font-noto-te), sans-serif",
              lineHeight: 1.4,
              textShadow: "0 2px 0 rgba(0,0,0,0.45)",
            }}
          >
            {title}
          </h3>
          <p className="mt-1.5 text-xs font-semibold text-[#d4b978]">
            ప్యానెల్ నొక్కండి — గ్రామ బోర్డు లాగా
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-3 sm:p-5">
          {options.map((o) => {
            const count = tallies[o.id] ?? 0;
            const pct = Math.round((count / total) * 100);
            const active = picked === o.id;
            const popping = pop === o.id;
            const label = teLabels && o.labelTe ? o.labelTe : o.label;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.id)}
                className={cn(
                  "relative min-h-[140px] border-[3px] p-3 text-left transition-all duration-200 sm:min-h-[160px] sm:p-4",
                  active
                    ? "border-[#ffd45a] bg-[#ffd45a]/20 shadow-[inset_0_0_30px_rgba(255,212,90,0.25)]"
                    : "border-[#6b542e] bg-[#3a2e1f]/90 hover:border-[#c9a227]",
                )}
                style={{
                  boxShadow: active
                    ? "inset 0 0 0 1px rgba(255,212,90,0.4)"
                    : "inset 0 1px 0 rgba(255,220,160,0.12)",
                }}
              >
                {/* Rivet dots */}
                <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#8a7348]" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#8a7348]" />

                <span
                  className={cn(
                    "block font-mono text-5xl font-black leading-none text-[#ffe9a8] sm:text-6xl",
                    popping && "pp-chalk-pop",
                  )}
                  style={{
                    textShadow: "0 2px 0 rgba(0,0,0,0.5), 0 0 12px rgba(255,212,90,0.25)",
                  }}
                >
                  {o.id}
                </span>
                <p
                  className="mt-2 text-xs font-black leading-snug text-[#fff6e0] sm:text-sm"
                  style={{
                    fontFamily: teLabels
                      ? "var(--font-noto-te), sans-serif"
                      : undefined,
                    lineHeight: 1.35,
                  }}
                >
                  {label}
                </p>
                {o.sub && (
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c9a227]/80">
                    {o.sub}
                  </p>
                )}

                {/* Chalk tally marks */}
                <div className="mt-3 flex min-h-[22px] flex-wrap items-end gap-1">
                  {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-block w-[3px] bg-[#fff6e0]/85",
                        popping && i === count - 1 && "pp-chalk-pop",
                      )}
                      style={{
                        height: 10 + (i % 3) * 3,
                        transform: `rotate(${(i % 5) - 2}deg)`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span
                    className={cn(
                      "font-mono text-lg font-black text-[#ffd45a]",
                      popping && "pp-chalk-pop",
                    )}
                  >
                    {pct}%
                  </span>
                  <span className="font-mono text-[10px] text-[#c9a227]">
                    ×{count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
