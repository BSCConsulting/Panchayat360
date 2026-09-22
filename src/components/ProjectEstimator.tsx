"use client";

import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
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
    "h-11 w-full rounded-2xl border border-black/[0.05] bg-[#F5F5F7] px-4 text-sm font-semibold text-[#1D1D1F] outline-none focus:ring-2 focus:ring-[#007AFF]/30";

  return (
    <section
      id="estimator"
      className="rounded-[32px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8 space-y-6"
    >
      <div className="flex items-center justify-between gap-3 border-b border-black/[0.04] pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#007AFF]" />
          <h2 className="text-sm font-extrabold text-[#1D1D1F] sm:text-base">
            {d.estimatorTitle}
          </h2>
        </div>
        <span className="text-xs font-medium text-[#6E6E73]">SSR-FPC Engine</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-xs font-bold text-[#6E6E73]">{d.district}</span>
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
          <span className="text-xs font-bold text-[#6E6E73]">{d.mandal}</span>
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
          <span className="text-xs font-bold text-[#6E6E73]">{d.gp}</span>
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
        <div className="flex flex-wrap gap-2">
          <StatPill
            label={d.population}
            value={gp.gp_population.toLocaleString("en-IN")}
          />
          <StatPill label={d.wards} value={String(gp.statutory_wards)} />
          <StatPill label={d.sampleTier} value={String(TIER2_SAMPLE_BASELINE)} />
          <StatPill
            label="Per ward"
            value={String(samplesPerWard(gp.statutory_wards))}
          />
          <StatPill label="Tier" value={gp.statutory_tier} />
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-bold text-[#6E6E73]">
          {d.timelineDaysLabel}
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {([2, 3, 4] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setDays(day)}
              className={cn(
                "h-11 rounded-2xl text-xs font-bold border transition-all",
                days === day
                  ? "border-transparent bg-slate-900 text-white shadow-sm"
                  : "border-black/[0.04] bg-[#F5F5F7] text-[#1D1D1F] hover:bg-slate-100",
              )}
            >
              {day} Days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric
          label={`Required ${d.surveyors}`}
          value={`${ops.surveyors} Enumerators`}
          hint="Capped at 20 valid interviews/day"
        />
        <Metric
          label={d.supervisor}
          value={`${ops.supervisors} Auditor`}
          hint="10% back-checks & GPS audits"
        />
        <Metric
          label="Daily target"
          value={`${ops.dailyTarget} samples`}
          hint={`Crew of ${ops.totalCrew}`}
        />
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[0.04] bg-[#F5F5F7] px-4 text-xs font-semibold text-[#1D1D1F]">
      <span className="text-[#6E6E73]">{label}</span>
      <span className="font-extrabold">{value}</span>
    </span>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/[0.04] bg-[#F5F5F7] p-4">
      <span className="text-[11px] font-bold text-[#6E6E73]">{label}</span>
      <div className="mt-1 text-xl font-black text-[#1D1D1F]">{value}</div>
      <span className="mt-1 text-[10px] text-[#6E6E73]">{hint}</span>
    </div>
  );
}
