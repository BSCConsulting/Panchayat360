"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { LangToggle } from "@/components/LangToggle";
import { Panchayat360Logo } from "@/components/Panchayat360Logo";
import { ProjectEstimator } from "@/components/ProjectEstimator";
import { ClientStrategyPortal } from "@/components/ClientStrategyPortal";
import { StreetPulseBoard } from "@/components/StreetPulseBoard";
import { t } from "@/lib/i18n";
import { gramPanchayats } from "@/lib/gp";
import type { Lang } from "@/types";

export function LandingPage() {
  const [lang, setLang] = useState<Lang>("te");
  const d = t(lang);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] antialiased selection:bg-[#007AFF]/15">
      <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:space-y-16 sm:px-6 sm:py-10 md:space-y-20">
        {/* Glass nav */}
        <header className="flex h-[52px] items-center justify-between rounded-full border border-white/50 bg-white/70 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-[50px] sm:h-16 sm:px-6">
          <Panchayat360Logo size="sm" withTagline={false} lang={lang} />
          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle lang={lang} onChange={setLang} />
            <Link
              href="/dashboard"
              className="hidden h-11 items-center rounded-full bg-[#007AFF] px-5 text-xs font-bold text-white sm:inline-flex"
            >
              {d.portalCta}
            </Link>
            <Link
              href="/admin"
              className="hidden h-11 items-center rounded-full border border-black/[0.06] bg-white px-4 text-xs font-bold text-[#1D1D1F] sm:inline-flex"
            >
              {d.adminCta}
            </Link>
          </div>
        </header>

        {/* Hero — brand first */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-white via-[#F5F5F7] to-[#E8F1FF] px-6 py-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:px-10 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, rgba(0,122,255,0.18), transparent 45%), radial-gradient(circle at 10% 80%, rgba(16,185,129,0.12), transparent 40%)",
            }}
          />
          <div className="relative z-10 max-w-2xl space-y-6">
            <Panchayat360Logo size="lg" withTagline lang={lang} />
            <p
              className="text-sm font-medium leading-relaxed text-[#6E6E73] sm:text-base"
              style={
                lang === "te"
                  ? {
                      fontFamily: "var(--font-noto-te), sans-serif",
                      lineHeight: 1.6,
                    }
                  : undefined
              }
            >
              {d.tagline}
            </p>
            <p className="text-xs font-semibold text-[#6E6E73]">
              NTR · Krishna · West Godavari ·{" "}
              <span className="text-[#1D1D1F]">
                {gramPanchayats.length.toLocaleString("en-IN")} Gram Panchayats
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#estimator"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#007AFF] px-6 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,122,255,0.28)]"
              >
                {d.heroCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center rounded-full border border-black/[0.06] bg-white/80 px-6 text-sm font-bold backdrop-blur-md"
              >
                {d.portalCta}
              </Link>
            </div>
          </div>
        </section>

        {/* Echo-chamber bento */}
        <section className="space-y-6">
          <h2 className="text-center text-lg font-black tracking-tight sm:text-xl">
            {d.whyTitle}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[d.trap1, d.trap2, d.trap3, d.trap4].map((trap, i) => (
              <div
                key={trap}
                className="rounded-[24px] border border-black/[0.05] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-[#007AFF]">
                  Trap 0{i + 1}
                </span>
                <p className="mt-2 text-sm font-extrabold leading-snug">{trap}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stacked deck −6° / 0° / +6° */}
        <section className="py-2 sm:py-6">
          <div className="relative mx-auto flex h-[290px] max-w-2xl items-center justify-center sm:h-[240px]">
            <DeckCard
              className="rotate-[-6deg] -translate-x-4 sm:-translate-x-8"
              icon={<Layers className="h-4 w-4" />}
              accent="#6366F1"
              title="Statutory Database & FPC"
              body="Ward mapping + 240-sample quotas without blindspots."
            />
            <DeckCard
              className="rotate-[6deg] translate-x-4 sm:translate-x-8"
              icon={<ShieldCheck className="h-4 w-4" />}
              accent="#FD1D1D"
              title="Automated Fraud Filters"
              body="<4 min or straight-lined entries discarded; quota +1."
            />
            <DeckCard
              className="z-20"
              icon={<Sparkles className="h-4 w-4" />}
              accent="#007AFF"
              title="Unaided Leadership AI"
              body="Nicknames & honorifics collapsed into canonical leaders."
              solid
            />
          </div>
        </section>

        <StreetPulseBoard
          title={
            lang === "te"
              ? "గ్రామంలో ఎవరి వైపు గాలి?"
              : "Whose way is the village leaning?"
          }
          location={lang === "te" ? "నేరుగా గ్రామం నుంచి" : "Street pulse · AP GPs"}
        />

        <ProjectEstimator lang={lang} />

        {/* Locked portal preview */}
        <section className="space-y-4">
          <h2 className="text-center text-lg font-black">{d.lockedPreview}</h2>
          <div className="overflow-hidden rounded-[32px] border border-black/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="max-h-[520px] overflow-hidden">
              <ClientStrategyPortal locked />
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-6 text-xs text-[#6E6E73] sm:flex-row">
          <span>
            © 2026 ప్రజా పల్స్ (Poll-Pulse AP) · SSR-FPC Framework
          </span>
          <div className="flex gap-4">
            <Link href="/dashboard" className="font-semibold hover:underline">
              {d.portalCta}
            </Link>
            <Link href="/admin" className="font-semibold hover:underline">
              {d.adminCta}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function DeckCard({
  className,
  icon,
  accent,
  title,
  body,
  solid,
}: {
  className?: string;
  icon: ReactNode;
  accent: string;
  title: string;
  body: string;
  solid?: boolean;
}) {
  return (
    <div
      className={`absolute h-[185px] w-[90%] rounded-[24px] border border-white/60 p-5 backdrop-blur-[50px] transition-transform hover:z-30 hover:rotate-0 sm:w-[72%] ${
        solid
          ? "h-[195px] w-[94%] border-black/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:w-[76%]"
          : "bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      } ${className ?? ""}`}
    >
      <div
        className="flex items-center gap-2 text-xs font-bold"
        style={{ color: accent }}
      >
        {icon}
        <span>{title}</span>
      </div>
      <h4 className="mt-2 text-sm font-extrabold text-[#1D1D1F]">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-[#6E6E73]">{body}</p>
    </div>
  );
}

export default LandingPage;
