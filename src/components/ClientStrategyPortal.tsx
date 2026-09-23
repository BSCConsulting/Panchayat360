"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Download,
  Pause,
  Play,
  Sliders,
  Volume2,
} from "lucide-react";
import { ConfidentialWatermark } from "@/components/ConfidentialWatermark";
import { LangToggle } from "@/components/LangToggle";
import { Panchayat360Logo } from "@/components/Panchayat360Logo";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { Lang, WardCard } from "@/types";

const WARDS: WardCard[] = [
  { id: 1, status: "green", label: "Ward 1", delta: "+42", note: "Core Base Solid" },
  { id: 2, status: "green", label: "Ward 2", delta: "+38", note: "Favorable Retention" },
  { id: 3, status: "red", label: "Ward 3", delta: "-28", note: "Opposition Stronghold" },
  { id: 4, status: "yellow", label: "Ward 4", delta: "+4", note: "Decisive Swing Ward" },
  { id: 5, status: "yellow", label: "Ward 5", delta: "-2", note: "Alliance Discord" },
  { id: 6, status: "green", label: "Ward 6", delta: "+55", note: "Welfare Sentiment High" },
  { id: 7, status: "yellow", label: "Ward 7", delta: "+6", note: "Floating Youth Vote" },
  { id: 8, status: "red", label: "Ward 8", delta: "-34", note: "Civic Anger Severe" },
  { id: 9, status: "yellow", label: "Ward 9", delta: "-8", note: "Wage-Labor Shift Risk" },
  { id: 10, status: "green", label: "Ward 10", delta: "+24", note: "Women Voters Unified" },
  { id: 11, status: "red", label: "Ward 11", delta: "-40", note: "Heavy Anti-Incumbency" },
  { id: 12, status: "green", label: "Ward 12", delta: "+18", note: "Stable Margins" },
];

const OPPONENTS = [
  {
    name: "Incumbent Sarpanch network",
    weakness: "Drainage sanctions stalled 24 months — Ward 8/11 anger",
  },
  {
    name: "Independent strongman (Ward 3)",
    weakness: "No SC colony presence; welfare delivery perception weak",
  },
];

type Props = {
  territory?: string;
  clientName?: string;
  clientPhone?: string;
  locked?: boolean;
};

export function ClientStrategyPortal({
  territory = "NTR District • Penuganchiprolu Mandal • Nawabpeta",
  clientName = "Demo Candidate",
  clientPhone = "98765*****",
  locked = false,
}: Props) {
  const [lang, setLang] = useState<Lang>("te");
  const d = t(lang);
  const [turnoutShift, setTurnoutShift] = useState(0);
  const [activeWard, setActiveWard] = useState(4);
  const [playing, setPlaying] = useState(false);

  const counts = useMemo(
    () => ({
      green: WARDS.filter((w) => w.status === "green").length,
      yellow: WARDS.filter((w) => w.status === "yellow").length,
      red: WARDS.filter((w) => w.status === "red").length,
    }),
    [],
  );

  const marginVotes = 880 + turnoutShift * 18;
  const marginPct = (54.2 + turnoutShift * 0.4).toFixed(1);

  return (
    <div className="relative min-h-screen bg-[var(--wb-bg)] text-[var(--wb-text)] antialiased selection:bg-[var(--wb-stamp)]/30">
      <ConfidentialWatermark
        clientName={clientName}
        clientPhone={clientPhone}
        tone="dark"
      />

      {/* Paper grain */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1200px] space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8",
          locked && "pointer-events-none select-none",
        )}
      >
        {locked && (
          <div className="pointer-events-auto absolute inset-0 z-40 flex items-start justify-center bg-black/50 pt-36 backdrop-blur-sm">
            <div className="border border-[var(--wb-line)] bg-[var(--wb-panel)] px-6 py-5 text-center">
              <p className="text-sm font-extrabold">{d.lockedPreview}</p>
              <p className="mt-1 text-xs text-[var(--wb-muted)]">
                Unlock via Super Admin after payment verification
              </p>
            </div>
          </div>
        )}

        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--wb-line)] pb-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Panchayat360Logo size="sm" withTagline={false} lang={lang} inverse />
            </Link>
            <span className="hidden rotate-[-8deg] border-2 border-[var(--wb-stamp)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--wb-stamp)] sm:inline">
              LIVE AUDIT
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle lang={lang} onChange={setLang} tone="dark" />
            <button
              type="button"
              className="hidden h-10 items-center gap-2 border border-[var(--wb-stamp)]/60 bg-[var(--wb-stamp)]/10 px-4 text-xs font-bold text-[var(--wb-stamp)] sm:inline-flex"
            >
              <Download className="h-3.5 w-3.5" />
              {d.downloadWarBoard}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--wb-muted)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--pp-safe)]" />
            {territory}
          </span>
          <span className="font-mono text-[10px] text-[var(--wb-muted)]">
            240 VALIDATED · TIER-2 SSR-FPC
          </span>
        </div>

        {/* Score strip — dense war-board stats */}
        <section className="grid grid-cols-1 gap-px bg-[var(--wb-line)] sm:grid-cols-3">
          <div className="bg-[var(--wb-panel)] p-5 sm:p-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--wb-muted)]">
              {d.winProbabilityTitle}
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">
                54.2%
              </span>
              <span className="font-mono text-xs font-bold text-[var(--pp-safe)]">
                {d.leadDelta}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--wb-muted)]">{d.winProbabilitySub}</p>
            <div className="mt-4 h-1 overflow-hidden bg-black/40">
              <div className="h-full w-[54.2%] bg-[var(--pp-amber)]" />
            </div>
          </div>

          <div className="bg-[var(--wb-panel)] p-5 sm:p-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--wb-muted)]">
              {d.primaryGrievanceTitle}
            </span>
            <div className="mt-2 text-sm font-bold leading-snug sm:text-base">
              {d.primaryGrievanceVal}
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 border border-[var(--pp-battleground)]/40 bg-[var(--pp-battleground)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--pp-amber-hot)]">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {d.grievanceWarning}
            </div>
          </div>

          <div className="bg-[var(--wb-panel)] p-5 sm:p-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--wb-muted)]">
              {d.coalitionTitle}
            </span>
            <div className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
              76%
            </div>
            <p className="mt-1 text-xs text-[var(--wb-muted)]">{d.coalitionSub}</p>
            <div className="mt-4 flex gap-1">
              <span className="h-1.5 flex-1 bg-[var(--pp-safe)]" />
              <span className="h-1.5 flex-1 bg-[var(--pp-safe)]" />
              <span className="h-1.5 flex-1 bg-[var(--pp-safe)]" />
              <span className="h-1.5 w-10 bg-[var(--pp-battleground)]" />
            </div>
          </div>
        </section>

        {/* RAG war grid — large interactive cells */}
        <section className="border border-[var(--wb-line)] bg-[var(--wb-panel)]">
          <div className="flex flex-col justify-between gap-3 border-b border-[var(--wb-line)] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h3 className="text-base font-extrabold tracking-tight sm:text-lg">
                {d.ragMatrixTitle}
              </h3>
              <p className="text-xs text-[var(--wb-muted)]">{d.ragMatrixSub}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] font-semibold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 text-[var(--pp-safe)]">
                <span className="h-2.5 w-2.5 bg-[var(--pp-safe)]" />
                {d.safeCount} {counts.green}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--pp-battleground)]">
                <span className="h-2.5 w-2.5 bg-[var(--pp-battleground)]" />
                {d.battlegroundCount} {counts.yellow}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--pp-danger)]">
                <span className="h-2.5 w-2.5 bg-[var(--pp-danger)]" />
                {d.deficitCount} {counts.red}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[var(--wb-line)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {WARDS.map((w) => {
              const tone =
                w.status === "green"
                  ? {
                      bar: "bg-[var(--pp-safe)]",
                      delta: "text-[var(--pp-safe)]",
                      wash: "bg-[var(--pp-safe)]/[0.06]",
                    }
                  : w.status === "yellow"
                    ? {
                        bar: "bg-[var(--pp-battleground)]",
                        delta: "text-[var(--pp-battleground)]",
                        wash: "bg-[var(--pp-battleground)]/[0.08]",
                      }
                    : {
                        bar: "bg-[var(--pp-danger)]",
                        delta: "text-[var(--pp-danger)]",
                        wash: "bg-[var(--pp-danger)]/[0.07]",
                      };
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setActiveWard(w.id)}
                  className={cn(
                    "relative min-h-[110px] p-4 text-left transition-colors",
                    tone.wash,
                    activeWard === w.id
                      ? "bg-white/10 ring-2 ring-inset ring-[var(--pp-amber)]"
                      : "hover:bg-white/[0.04]",
                  )}
                >
                  <span className={cn("absolute left-0 top-0 h-full w-1", tone.bar)} />
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-xs font-extrabold">{w.label}</span>
                    <span className={cn("font-mono text-sm font-bold", tone.delta)}>
                      {w.delta}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium leading-snug text-[var(--wb-muted)]">
                    {w.note}
                  </p>
                  {/* redacted bar accent */}
                  <div className="mt-3 h-1.5 w-2/3 bg-white/10">
                    <div
                      className={cn("h-full", tone.bar)}
                      style={{
                        width: `${Math.min(95, Math.abs(parseInt(w.delta, 10)) * 1.6)}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-px bg-[var(--wb-line)] lg:grid-cols-2">
          <div className="space-y-4 bg-[var(--wb-panel)] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--pp-amber)]">
              <Sliders className="h-4 w-4" />
              <h4 className="text-sm font-extrabold text-[var(--wb-text)]">
                {d.simulatorTitle}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-[var(--wb-muted)]">
              {d.simulatorSub}
            </p>
            <div className="space-y-4 pt-1">
              <div className="flex justify-between font-mono text-xs font-bold">
                <span>{d.turnoutLabel}</span>
                <span
                  className={
                    turnoutShift >= 0
                      ? "text-[var(--pp-safe)]"
                      : "text-[var(--pp-danger)]"
                  }
                >
                  {turnoutShift > 0 ? `+${turnoutShift}%` : `${turnoutShift}%`}
                </span>
              </div>
              <input
                type="range"
                min={-15}
                max={15}
                value={turnoutShift}
                onChange={(e) => setTurnoutShift(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-[var(--pp-amber)]"
              />
              <div className="flex h-12 items-center justify-between border border-[var(--wb-line)] bg-black/30 px-4 font-mono text-xs">
                <span className="text-[var(--wb-muted)]">{d.simulatedMarginLabel}</span>
                <span className="text-sm font-bold">
                  {marginVotes} · {marginPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-[var(--wb-panel)] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--pp-amber)]">
              <Volume2 className="h-4 w-4" />
              <h4 className="text-sm font-extrabold text-[var(--wb-text)]">
                {d.audioVaultTitle}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-[var(--wb-muted)]">
              {d.audioVaultSub}
            </p>
            <div className="flex items-center justify-between gap-3 border border-[var(--wb-line)] bg-black/30 p-4">
              <div>
                <div className="text-xs font-bold">మహిళా ఓటరు (Ward 4 - BC Palem)</div>
                <p
                  className="mt-1 text-[11px] italic leading-snug text-[var(--wb-muted)]"
                  style={{ fontFamily: "var(--font-noto-te), sans-serif" }}
                >
                  &ldquo;నాలుగు నెలలుగా పైపులైను పగిలి నీరు రావడం లేదు…&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 border border-[var(--pp-amber)]/50 bg-[var(--pp-amber)]/10 px-3 font-mono text-xs font-bold text-[var(--pp-amber)]"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "0:08" : "0:14"}
              </button>
            </div>
          </div>
        </section>

        <section className="border border-[var(--wb-line)] bg-[var(--wb-panel)] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-[var(--wb-line)] pb-3">
            <Check className="h-4 w-4 text-[var(--pp-safe)]" />
            <h4 className="text-sm font-extrabold">
              {d.speechTitle} —{" "}
              <span className="text-[var(--pp-amber)]">Ward {activeWard}</span>
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-px bg-[var(--wb-line)] md:grid-cols-3">
            {[
              [d.speech1Title, d.speech1Desc],
              [d.speech2Title, d.speech2Desc],
              [d.speech3Title, d.speech3Desc],
            ].map(([title, desc]) => (
              <div key={title} className="bg-[var(--wb-bg)] p-4 text-xs leading-relaxed">
                <strong className="mb-1 block text-[var(--pp-amber)]">{title}</strong>
                <span className="text-[var(--wb-muted)]">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-[var(--wb-line)] bg-[var(--wb-panel)] p-5 sm:p-6">
          <h4 className="mb-3 text-sm font-extrabold">{d.opponentTitle}</h4>
          <ul className="space-y-2">
            {OPPONENTS.map((o) => (
              <li
                key={o.name}
                className="border border-[var(--wb-line)] bg-black/25 px-4 py-3 text-xs"
              >
                <span className="font-bold text-[var(--pp-danger)]">{o.name}</span>
                <span className="text-[var(--wb-muted)]"> — {o.weakness}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex justify-between border-t border-[var(--wb-line)] pt-4 text-[10px] text-[var(--wb-muted)]">
          <span className="font-mono">CONFIDENTIAL · CLIENT WAR BOARD</span>
          <Link href="/" className="hover:text-white">
            ← Ground Pulse
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default ClientStrategyPortal;
