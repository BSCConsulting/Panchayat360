"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { LangToggle } from "@/components/LangToggle";
import { OpsTicker } from "@/components/OpsTicker";
import { Panchayat360Logo } from "@/components/Panchayat360Logo";
import { ProjectEstimator } from "@/components/ProjectEstimator";
import { StreetPulseBoard } from "@/components/StreetPulseBoard";
import { WarBoardProofReel } from "@/components/WarBoardProofReel";
import { t } from "@/lib/i18n";
import { gramPanchayats } from "@/lib/gp";
import { cn } from "@/lib/cn";
import type { Lang } from "@/types";

const TERRITORIES = [
  {
    id: "NTR",
    name: "NTR",
    nameTe: "ఎన్టీఆర్",
    gps: 141,
    active: 18,
    fill: 62,
    status: "FIELD ACTIVE" as const,
  },
  {
    id: "Krishna",
    name: "Krishna",
    nameTe: "కృష్ణ",
    gps: 426,
    active: 41,
    fill: 48,
    status: "CREWS ONLINE" as const,
  },
  {
    id: "West Godavari",
    name: "West Godavari",
    nameTe: "పశ్చిమ గోదావరి",
    gps: 409,
    active: 33,
    fill: 55,
    status: "SAMPLING" as const,
  },
];

export function LandingPage() {
  const [lang, setLang] = useState<Lang>("te");
  const [focus, setFocus] = useState(0);
  const d = t(lang);

  return (
    <div className="min-h-screen bg-[var(--wb-bg)] text-[var(--wb-text)] antialiased selection:bg-[var(--pp-amber)]/30">
      {/* Map-grid ambient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,163,23,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,163,23,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(232,163,23,0.12), transparent 45%), radial-gradient(ellipse at 80% 60%, rgba(47,158,107,0.08), transparent 40%)",
        }}
        aria-hidden
      />

      <header className="relative z-20 flex items-center justify-between border-b border-[var(--wb-line)] px-4 py-3 sm:px-6 sm:py-4">
        <Panchayat360Logo size="sm" withTagline={false} lang={lang} inverse />
        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} onChange={setLang} tone="dark" />
          <Link
            href="/dashboard"
            className="hidden h-10 items-center border border-[var(--pp-amber)]/50 bg-[var(--pp-amber)]/10 px-4 text-xs font-bold text-[var(--pp-amber)] sm:inline-flex"
          >
            {d.portalCta}
          </Link>
        </div>
      </header>

      <OpsTicker lang={lang} />

      {/* Mandal War Room hero */}
      <section className="relative z-10 px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-[var(--pp-danger)]/50 bg-[var(--pp-danger)]/15 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-[var(--pp-danger)]">
              <Radio className="h-3 w-3 animate-pulse" />
              MANDAL WAR ROOM
            </span>
            <span className="font-mono text-[10px] text-[var(--wb-muted)]">
              {gramPanchayats.length.toLocaleString("en-IN")} GP COVERAGE · SSR-FPC
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <h1
                className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl"
                style={{ letterSpacing: "-0.04em" }}
              >
                Panchayat
                <span className="text-[var(--pp-amber)]">360</span>
              </h1>
              <p
                className="max-w-xl text-base font-semibold leading-snug text-white/80 sm:text-xl"
                style={
                  lang === "te"
                    ? {
                        fontFamily: "var(--font-noto-te), sans-serif",
                        lineHeight: 1.55,
                      }
                    : undefined
                }
              >
                {lang === "te"
                  ? "గ్రామ పంచాయతీ గెలుపు — క్యాడర్ ఊహ కాదు, వార్డు-లెవల్ ఇంటెలిజెన్స్."
                  : "GP victory — not cadre guesswork. Ward-level intelligence."}
              </p>
              <p className="text-sm text-white/45">{d.tagline}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="#street-board"
                  className="pp-cta-pulse inline-flex h-12 items-center gap-2 bg-[var(--pp-amber)] px-6 text-sm font-black text-[var(--pp-midnight)]"
                >
                  {lang === "te" ? "స్ట్రీట్ బోర్డు తెరవండి" : "Open street board"}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#proof-reel"
                  className="inline-flex h-12 items-center border border-white/25 px-6 text-sm font-bold text-white hover:border-[var(--pp-amber)] hover:text-[var(--pp-amber)]"
                >
                  {lang === "te" ? "వార్ బోర్డు టీజ్" : "War board tease"}
                </a>
              </div>
            </div>

            {/* Territory strip */}
            <div className="grid gap-2">
              {TERRITORIES.map((tRow, i) => (
                <button
                  key={tRow.id}
                  type="button"
                  onClick={() => setFocus(i)}
                  className={cn(
                    "border p-3 text-left transition-all sm:p-4",
                    focus === i
                      ? "border-[var(--pp-amber)] bg-[var(--pp-amber)]/10"
                      : "border-[var(--wb-line)] bg-[var(--wb-panel)]/80 hover:border-white/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className="text-sm font-extrabold text-white sm:text-base"
                        style={
                          lang === "te"
                            ? { fontFamily: "var(--font-noto-te), sans-serif" }
                            : undefined
                        }
                      >
                        {lang === "te" ? tRow.nameTe : tRow.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-[var(--wb-muted)]">
                        {tRow.gps} GPs · {tRow.active} crews
                      </p>
                    </div>
                    <span className="shrink-0 border border-[var(--pp-safe)]/40 bg-[var(--pp-safe)]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide text-[var(--pp-safe)]">
                      {tRow.status}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden bg-black/50">
                    <div
                      className="h-full bg-[var(--pp-amber)] transition-all duration-700"
                      style={{ width: `${focus === i ? tRow.fill : tRow.fill - 8}%` }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-[var(--pp-amber)]">
                    SAMPLE FILL {tRow.fill}%
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-[1100px] space-y-14 px-4 pb-16 sm:space-y-20 sm:px-6 sm:pb-24">
        <StreetPulseBoard
          id="street-board"
          teLabels={lang === "te"}
          title={
            lang === "te"
              ? "గ్రామంలో ఎవరి వైపు గాలి?"
              : "Whose way is the village leaning?"
          }
          location={lang === "te" ? "నేరుగా గ్రామం నుంచి" : "LIVE FROM GP STREETS"}
        />

        <WarBoardProofReel lang={lang} />

        <section className="space-y-6 border border-[var(--wb-line)] bg-[var(--wb-panel)]/60 p-5 sm:p-8">
          <div className="max-w-xl">
            <h2
              className="text-2xl font-black tracking-tight text-white sm:text-3xl"
              style={{
                letterSpacing: "-0.03em",
                fontFamily:
                  lang === "te"
                    ? "var(--font-noto-te), sans-serif"
                    : undefined,
                lineHeight: lang === "te" ? 1.4 : undefined,
              }}
            >
              {d.whyTitle}
            </h2>
            <p className="mt-2 text-sm text-[var(--wb-muted)]">
              {lang === "te"
                ? "క్యాడర్ ఎకో-ఛాంబర్లు గెలుపు కాదు. వార్డు కోటా + ఫ్రాడ్ ఫిల్టర్లు + అన్‌ఎయిడెడ్ నాయకత్వం."
                : "Cadre echo chambers don’t win. Ward quotas, fraud filters, and unaided leadership do."}
            </p>
          </div>
          <ol className="grid gap-0 sm:grid-cols-2">
            {[d.trap1, d.trap2, d.trap3, d.trap4].map((trap, i) => (
              <li
                key={trap}
                className="flex gap-4 border-t border-[var(--wb-line)] py-4 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
              >
                <span className="font-mono text-sm font-bold text-[var(--pp-amber)]">
                  0{i + 1}
                </span>
                <p className="text-sm font-bold leading-snug text-white/90 sm:text-base">
                  {trap}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="border border-[var(--wb-line)] bg-[var(--pp-dust)] text-[var(--pp-ink)] [&_#estimator]:border-0 [&_#estimator]:bg-transparent [&_#estimator]:p-5 sm:[&_#estimator]:p-8">
          <ProjectEstimator lang={lang} />
        </div>

        <footer className="flex flex-col items-start justify-between gap-4 border-t border-[var(--wb-line)] pt-8 text-xs text-[var(--wb-muted)] sm:flex-row sm:items-center">
          <span>© 2026 ప్రజా పల్స్ (Poll-Pulse AP) · SSR-FPC</span>
          <div className="flex gap-5">
            <Link href="/dashboard" className="font-semibold hover:text-[var(--pp-amber)]">
              {d.portalCta}
            </Link>
            <Link href="/admin" className="font-semibold hover:text-[var(--pp-amber)]">
              {d.adminCta}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LandingPage;
