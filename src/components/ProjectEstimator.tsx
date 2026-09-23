"use client";

import { useMemo, useState } from "react";
import { DISTRICTS, findGp, gpsFor, mandalsFor } from "@/lib/gp";
import { t } from "@/lib/i18n";
import { crewForTimeline, samplesPerWard, TIER2_SAMPLE_BASELINE } from "@/lib/sampling";
import type { Lang } from "@/types";
import { cn } from "@/lib/cn";

type Props = { lang: Lang };

export function ProjectEstimator({ lang }: Props) {
  const d = t(lang);
  const [district, setDistrict] = useState<string>(DISTRICTS[0]);
  const mandals = mandalsFor(district);
  const [mandal, setMandal] = useState(mandals[0] ?? "");
  const gps = gpsFor(district, mandal);
  const [gpName, setGpName] = useState(gps[0]?.gp_name ?? "");
  const [days, setDays] = useState<2 | 3 | 4>(3);

  const gp = findGp(district, mandal, gpName) ?? gps[0];
  const ops = useMemo(() => crewForTimeline(days), [days]);

  function onDistrict(next: string) {
    setDistrict(next);
    const m = mandalsFor(next)[0] ?? "";
    setMandal(m);
    setGpName(gpsFor(next, m)[0]?.gp_name ?? "");
  }

  function onMandal(next: string) {
    setMandal(next);
    setGpName(gpsFor(district, next)[0]?.gp_name ?? "");
  }

  const selectClass =
    "h-11 w-full border border-[var(--pp-ink)]/12 bg-[var(--pp-dust)] px-3 text-sm font-semibold text-[var(--pp-ink)] outline-none focus:border-[var(--pp-amber)] focus:ring-1 focus:ring-[var(--pp-amber)]";

  return (
    <section id="estimator" className="space-y-6 border border-[var(--pp-ink)]/10 bg-white/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--pp-ink)]/10 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--pp-amber)]">
            SSR-FPC Engine
          </p>
          <h2
            className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            {d.estimatorTitle}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-xs font-bold text-[var(--pp-muted)]">{d.district}</span>
          <select
            className={selectClass}
            value={district}
            onChange={(e) => onDistrict(e.target.value)}
          >
            {DISTRICTS.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold text-[var(--pp-muted)]">{d.mandal}</span>
          <select
            className={selectClass}
            value={mandal}
            onChange={(e) => onMandal(e.target.value)}
          >
            {mandals.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold text-[var(--pp-muted)]">{d.gp}</span>
          <select
            className={selectClass}
            value={gp?.gp_name ?? ""}
            onChange={(e) => setGpName(e.target.value)}
          >
            {gps.map((x) => (
              <option key={x.gp_name} value={x.gp_name}>
                {x.gp_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {gp && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
          <Stat label={d.population} value={gp.gp_population.toLocaleString("en-IN")} />
          <Stat label={d.wards} value={String(gp.statutory_wards)} />
          <Stat label={d.sampleTier} value={String(TIER2_SAMPLE_BASELINE)} />
          <Stat label="Per ward" value={String(samplesPerWard(gp.statutory_wards))} />
          <Stat label="Tier" value={gp.statutory_tier} />
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-bold text-[var(--pp-muted)]">
          {d.timelineDaysLabel}
        </p>
        <div className="grid max-w-md grid-cols-3 gap-2">
          {([2, 3, 4] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setDays(day)}
              className={cn(
                "h-11 text-xs font-bold border transition-colors",
                days === day
                  ? "border-[var(--pp-midnight)] bg-[var(--pp-midnight)] text-white"
                  : "border-[var(--pp-ink)]/12 bg-[var(--pp-dust)] text-[var(--pp-ink)] hover:border-[var(--pp-amber)]",
              )}
            >
              {day} Days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-[var(--pp-ink)]/10 sm:grid-cols-3">
        <Metric
          label={`Required ${d.surveyors}`}
          value={`${ops.surveyors}`}
          unit="Enumerators"
          hint="Capped at 20 valid interviews/day"
        />
        <Metric
          label={d.supervisor}
          value={`${ops.supervisors}`}
          unit="Auditor"
          hint="10% back-checks & GPS audits"
        />
        <Metric
          label="Daily target"
          value={`${ops.dailyTarget}`}
          unit="samples"
          hint={`Crew of ${ops.totalCrew}`}
        />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="font-sans text-[var(--pp-muted)]">{label}</span>
      <span className="font-bold text-[var(--pp-ink)]">{value}</span>
    </span>
  );
}

function Metric({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit: string;
  hint: string;
}) {
  return (
    <div className="bg-[var(--pp-dust)] p-4 sm:p-5">
      <span className="text-[11px] font-bold text-[var(--pp-muted)]">{label}</span>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold tracking-tight text-[var(--pp-ink)]">
          {value}
        </span>
        <span className="text-xs font-semibold text-[var(--pp-muted)]">{unit}</span>
      </div>
      <span className="mt-1 block text-[10px] text-[var(--pp-muted)]">{hint}</span>
    </div>
  );
}
