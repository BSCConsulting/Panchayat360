"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Lang } from "@/types";

const DEMO_WARDS = [
  { id: 3, status: "red" as const, delta: "-28", note: "Opposition" },
  { id: 4, status: "yellow" as const, delta: "+4", note: "Swing" },
  { id: 8, status: "red" as const, delta: "-34", note: "Anger" },
  { id: 6, status: "green" as const, delta: "+55", note: "Base" },
  { id: 11, status: "red" as const, delta: "-40", note: "Anti-inc" },
  { id: 10, status: "green" as const, delta: "+24", note: "Women" },
  { id: 1, status: "green" as const, delta: "+42", note: "Core" },
  { id: 7, status: "yellow" as const, delta: "+6", note: "Youth" },
  { id: 9, status: "yellow" as const, delta: "-8", note: "Wage" },
  { id: 2, status: "green" as const, delta: "+38", note: "Retain" },
  { id: 5, status: "yellow" as const, delta: "-2", note: "Alliance" },
  { id: 12, status: "green" as const, delta: "+18", note: "Stable" },
];

const SPEECH = [
  { te: "డ్రైనేజీ శాంక్షన్ వాగ్దానం", en: "Drainage sanction pledge" },
  { te: "మహిళా సంక్షేమ డెలివరీ", en: "Women welfare delivery" },
  { te: "యువత ఉపాధి పాయింట్", en: "Youth livelihood point" },
];

type Props = { lang: Lang };

/** Blurred war-board proof reel — FOMO for locked client portal. */
export function WarBoardProofReel({ lang }: Props) {
  const [step, setStep] = useState(0);
  const active = DEMO_WARDS[step % DEMO_WARDS.length];
  const speech = SPEECH[step % SPEECH.length];
  const winPct = (52.4 + (step % 5) * 0.6).toFixed(1);

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => s + 1), 1600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="proof-reel" className="space-y-5">
      <div className="max-w-2xl space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--pp-amber)]">
          Candidate proof reel
        </p>
        <h2
          className="text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl"
          style={{
            letterSpacing: "-0.03em",
            fontFamily:
              lang === "te"
                ? "var(--font-noto-te), sans-serif"
                : "var(--font-outfit), sans-serif",
            lineHeight: lang === "te" ? 1.45 : undefined,
          }}
        >
          {lang === "te"
            ? "మీ ఎదురు అభ్యర్థి ఇప్పటికే ఏం చూస్తున్నాడో మీకు తెలుసా?"
            : "Do you know what your rival already sees?"}
        </h2>
        <p className="text-sm text-white/55">
          {lang === "te"
            ? "RAG వార్డు మ్యాప్ · విజయ % · ఆడియో వాల్ట్ — లాక్ చేయబడింది."
            : "RAG ward map · win % · audio vault — sealed until verified."}
        </p>
      </div>

      <div className="relative overflow-hidden border border-[var(--pp-amber)]/30 bg-[var(--wb-panel)] shadow-[0_0_60px_rgba(232,163,23,0.12)]">
        {/* LIVE AUDIT stamp */}
        <div className="absolute right-4 top-4 z-20 rotate-[-12deg] border-2 border-[var(--wb-stamp)] px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[var(--wb-stamp)]">
          LIVE AUDIT
        </div>

        {/* Demo board (slightly blurred under lock) */}
        <div className="relative p-4 sm:p-6">
          <div className="pointer-events-none select-none blur-[2.5px] sm:blur-[3px]">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--wb-muted)]">
                  Win probability
                </p>
                <p className="font-mono text-4xl font-bold text-white sm:text-5xl">
                  {winPct}%
                </p>
              </div>
              <div className="h-16 w-28">
                <svg viewBox="0 0 120 70" className="h-full w-full">
                  <path
                    d="M10 60 A50 50 0 0 1 110 60"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 60 A50 50 0 0 1 110 60"
                    fill="none"
                    stroke="var(--pp-amber)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="120"
                    strokeDashoffset={48 - (step % 5) * 4}
                    className="transition-all duration-700"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 sm:gap-2">
              {DEMO_WARDS.map((w) => {
                const color =
                  w.status === "green"
                    ? "bg-[var(--pp-safe)]"
                    : w.status === "yellow"
                      ? "bg-[var(--pp-battleground)]"
                      : "bg-[var(--pp-danger)]";
                return (
                  <div
                    key={w.id}
                    className={cn(
                      "relative min-h-[64px] border border-white/10 bg-black/40 p-2 transition-all duration-500",
                      active.id === w.id && "ring-2 ring-[var(--pp-amber)]",
                    )}
                  >
                    <span className={cn("absolute left-0 top-0 h-full w-1", color)} />
                    <div className="flex justify-between text-[10px] font-bold text-white/80">
                      <span>W{w.id}</span>
                      <span className="font-mono">{w.delta}</span>
                    </div>
                    <p className="mt-1 text-[9px] text-white/45">{w.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="border border-white/10 bg-black/35 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--pp-amber)]">
                  Speech · Ward {active.id}
                </p>
                <p
                  className="mt-1 text-sm font-bold text-white"
                  style={
                    lang === "te"
                      ? { fontFamily: "var(--font-noto-te), sans-serif" }
                      : undefined
                  }
                >
                  {lang === "te" ? speech.te : speech.en}
                </p>
              </div>
              <div className="border border-white/10 bg-black/35 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--wb-muted)]">
                  Audio vault
                </p>
                <div className="mt-2 flex h-8 items-end gap-0.5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-[var(--pp-amber)]/70 transition-all duration-300"
                      style={{
                        height: `${20 + ((i * 7 + step * 11) % 70)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scan line */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="pp-scan-line absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[var(--pp-amber)]/20 to-transparent" />
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--wb-bg)]/55 backdrop-blur-[1px]">
            <div className="mx-4 max-w-sm border border-[var(--pp-amber)]/40 bg-[var(--wb-bg)]/90 px-6 py-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              <Lock className="mx-auto h-6 w-6 text-[var(--pp-amber)]" />
              <p
                className="mt-3 text-sm font-extrabold text-white"
                style={
                  lang === "te"
                    ? {
                        fontFamily: "var(--font-noto-te), sans-serif",
                        lineHeight: 1.5,
                      }
                    : undefined
                }
              >
                {lang === "te"
                  ? "వార్ బోర్డు లాక్ — చెల్లింపు తర్వాత మాత్రమే"
                  : "War board locked — after payment only"}
              </p>
              <Link
                href="/dashboard"
                className="pp-cta-pulse mt-4 inline-flex h-11 items-center gap-2 bg-[var(--pp-amber)] px-5 text-sm font-bold text-[var(--pp-midnight)]"
              >
                {lang === "te" ? "డెమో వార్ బోర్డు చూడండి" : "Open demo war board"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
