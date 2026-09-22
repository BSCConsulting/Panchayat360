"use client";

import { useMemo, useState } from "react";
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
    <div className="relative min-h-screen bg-[#F5F5F7] text-[#1D1D1F] antialiased selection:bg-[#007AFF]/15">
      <ConfidentialWatermark clientName={clientName} clientPhone={clientPhone} />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-10",
          locked && "pointer-events-none select-none",
        )}
      >
        {locked && (
          <div className="pointer-events-auto absolute inset-0 z-40 flex items-start justify-center rounded-[32px] bg-white/40 pt-40 backdrop-blur-md">
            <div className="rounded-[24px] border border-white/60 bg-white/85 px-6 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-[50px]">
              <p className="text-sm font-extrabold">{d.lockedPreview}</p>
              <p className="mt-1 text-xs text-[#6E6E73]">
                Unlock via Super Admin after payment verification
              </p>
            </div>
          </div>
        )}

        <header className="flex h-[52px] items-center justify-between rounded-full border border-white/50 bg-white/70 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-[50px] sm:h-16 sm:px-6">
          <Panchayat360Logo size="sm" withTagline={false} lang={lang} />
          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle lang={lang} onChange={setLang} />
            <button
              type="button"
              className="hidden h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#FD1D1D] to-[#FCAF45] px-5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(253,29,29,0.25)] sm:inline-flex"
            >
              <Download className="h-3.5 w-3.5" />
              {d.downloadWarBoard}
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs font-semibold text-[#6E6E73]">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#1DB954]" />
            {territory}
          </span>
          <span className="rounded-full border border-black/[0.04] bg-white/80 px-3 py-1 backdrop-blur-md">
            240 Validated Samples • Tier-2 SSR-FPC
          </span>
        </div>

        {/* Scorecard */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                {d.winProbabilityTitle}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight sm:text-4xl">
                  54.2%
                </span>
                <span className="rounded-full border border-[#1DB954]/20 bg-[#1DB954]/10 px-2 py-0.5 text-xs font-bold text-[#1DB954]">
                  {d.leadDelta}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-[#6E6E73]">
                {d.winProbabilitySub}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F5F5F7]">
              <div className="h-full w-[54.2%] rounded-full bg-[#007AFF]" />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                {d.primaryGrievanceTitle}
              </span>
              <div className="mt-2 text-sm font-extrabold leading-snug sm:text-base">
                {d.primaryGrievanceVal}
              </div>
            </div>
            <div className="mt-3 inline-flex items-center self-start rounded-full bg-[#FEF3C7] px-3 py-1.5 text-xs font-medium text-[#B45309]">
              <AlertTriangle className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              {d.grievanceWarning}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6E73]">
                {d.coalitionTitle}
              </span>
              <div className="mt-2 text-2xl font-black tracking-tight">
                76% Consolidated
              </div>
              <p className="mt-1 text-xs font-medium text-[#6E6E73]">
                {d.coalitionSub}
              </p>
            </div>
            <div className="mt-4 flex gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-[#1DB954]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#1DB954]" />
              <span className="h-1.5 flex-1 rounded-full bg-[#1DB954]" />
              <span className="h-1.5 w-12 rounded-full bg-[#F59E0B]" />
            </div>
          </div>
        </section>

        {/* RAG grid */}
        <section className="space-y-6 rounded-[32px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-base font-black tracking-tight sm:text-lg">
                {d.ragMatrixTitle}
              </h3>
              <p className="text-xs text-[#6E6E73]">{d.ragMatrixSub}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1DB954]" />
                {d.safeCount} ({counts.green})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                {d.battlegroundCount} ({counts.yellow})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                {d.deficitCount} ({counts.red})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {WARDS.map((w) => {
              const border =
                w.status === "green"
                  ? "border-[#1DB954]/30 bg-[#1DB954]/[0.02]"
                  : w.status === "yellow"
                    ? "border-[#F59E0B]/50 bg-[#F59E0B]/[0.04]"
                    : "border-[#EF4444]/30 bg-[#EF4444]/[0.02]";
              const tag =
                w.status === "green"
                  ? "bg-[#1DB954]/10 text-[#1DB954]"
                  : w.status === "yellow"
                    ? "bg-[#F59E0B]/10 text-[#D97706]"
                    : "bg-[#EF4444]/10 text-[#DC2626]";
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setActiveWard(w.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all hover:shadow-md",
                    border,
                    activeWard === w.id && "bg-white shadow-md ring-2 ring-[#007AFF]",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-black">{w.label}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-black", tag)}>
                      {w.delta}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium leading-snug text-[#6E6E73]">
                    {w.note}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Simulator + audio */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#007AFF]">
              <Sliders className="h-5 w-5" />
              <h4 className="text-sm font-extrabold text-[#1D1D1F]">
                {d.simulatorTitle}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-[#6E6E73]">{d.simulatorSub}</p>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{d.turnoutLabel}</span>
                <span
                  className={
                    turnoutShift >= 0 ? "text-[#1DB954]" : "text-[#EF4444]"
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
                className="h-2 w-full cursor-pointer accent-[#007AFF]"
              />
              <div className="flex h-12 items-center justify-between rounded-2xl border border-black/[0.04] bg-[#F5F5F7] px-4 text-xs font-semibold">
                <span className="text-[#6E6E73]">{d.simulatedMarginLabel}</span>
                <span className="text-sm font-black">
                  {marginVotes} Votes ({marginPct}%)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[#6366F1]">
              <Volume2 className="h-5 w-5" />
              <h4 className="text-sm font-extrabold text-[#1D1D1F]">
                {d.audioVaultTitle}
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-[#6E6E73]">{d.audioVaultSub}</p>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/[0.04] bg-[#F5F5F7] p-4">
              <div>
                <div className="text-xs font-bold">మహిళా ఓటరు (Ward 4 - BC Palem)</div>
                <p className="mt-1 text-[11px] italic leading-snug text-[#6E6E73]">
                  &ldquo;నాలుగు నెలలుగా పైపులైను పగిలి నీరు రావడం లేదు…&rdquo;
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-4 text-xs font-bold text-[#007AFF]"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "0:08" : "Play 0:14"}
              </button>
            </div>
          </div>
        </section>

        {/* Speech + opponent */}
        <section className="space-y-4 rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#1DB954]" />
              <h4 className="text-sm font-extrabold">
                {d.speechTitle} —{" "}
                <span className="text-[#007AFF]">Ward {activeWard} Focus</span>
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
            {[
              [d.speech1Title, d.speech1Desc, "#007AFF"],
              [d.speech2Title, d.speech2Desc, "#6366F1"],
              [d.speech3Title, d.speech3Desc, "#EF4444"],
            ].map(([title, desc, color]) => (
              <div
                key={title}
                className="rounded-2xl border border-black/[0.04] bg-[#F5F5F7] p-4 leading-relaxed"
              >
                <strong className="mb-1 block" style={{ color }}>
                  {title}
                </strong>
                {desc}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h4 className="text-sm font-extrabold">{d.opponentTitle}</h4>
          <ul className="space-y-2">
            {OPPONENTS.map((o) => (
              <li
                key={o.name}
                className="rounded-2xl border border-black/[0.04] bg-[#F5F5F7] px-4 py-3 text-xs"
              >
                <span className="font-bold text-[#EF4444]">{o.name}</span>
                <span className="text-[#6E6E73]"> — {o.weakness}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default ClientStrategyPortal;
