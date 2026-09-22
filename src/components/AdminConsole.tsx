"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileSpreadsheet,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Upload,
} from "lucide-react";
import { Panchayat360Logo } from "@/components/Panchayat360Logo";
import { applyFraudGates } from "@/lib/fraud";
import { gramPanchayats } from "@/lib/gp";
import { crewForTimeline, samplesPerWard } from "@/lib/sampling";
import { cn } from "@/lib/cn";

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  gp: string;
  unlocked: boolean;
};

const SEED_CLIENTS: ClientRow[] = [
  {
    id: "1",
    name: "Ravi Kumar",
    phone: "9876543210",
    gp: "Nawabpeta",
    unlocked: false,
  },
  {
    id: "2",
    name: "Sita Devi",
    phone: "9988776655",
    gp: "Avanigadda",
    unlocked: true,
  },
];

const DEMO_SUBMISSIONS = [
  {
    id: "a",
    ward: 4,
    surveyor_id: "S-01",
    interview_duration_seconds: 180,
    q1_civic_issue: "A",
    q8_candidate_priority_trait: "A",
    q9_ysrcp_governance_rating: "A",
    q10_nda_governance_rating: "A",
  },
  {
    id: "b",
    ward: 7,
    surveyor_id: "S-02",
    interview_duration_seconds: 420,
    q1_civic_issue: "Water",
    q8_candidate_priority_trait: "Honesty",
    q9_ysrcp_governance_rating: "Worse",
    q10_nda_governance_rating: "Better",
  },
  {
    id: "c",
    ward: 8,
    surveyor_id: "S-01",
    interview_duration_seconds: 200,
    q1_civic_issue: "Roads",
    q8_candidate_priority_trait: "Access",
    q9_ysrcp_governance_rating: "Same",
    q10_nda_governance_rating: "Same",
  },
];

type Props = {
  initialConfigured?: boolean;
  initialCount?: number | null;
};

export function AdminConsole({
  initialConfigured = false,
  initialCount = null,
}: Props) {
  const [clients, setClients] = useState(SEED_CLIENTS);
  const [days, setDays] = useState<2 | 3 | 4>(3);
  const [ingestLog, setIngestLog] = useState<string>(
    initialConfigured
      ? `Supabase connected · ${initialCount ?? "…"} GPs in gram_panchayats.`
      : `Local seed: ${gramPanchayats.length} GPs (NTR / Krishna / West Godavari). Push to Supabase via Re-ingest.`,
  );
  const [ingesting, setIngesting] = useState(false);
  const [remoteCount, setRemoteCount] = useState<number | null>(initialCount);
  const [supabaseOk, setSupabaseOk] = useState(initialConfigured);
  const [wardQuota, setWardQuota] = useState<Record<number, number>>({
    4: 20,
    7: 20,
    8: 20,
  });

  const ops = useMemo(() => crewForTimeline(days), [days]);

  const audited = useMemo(
    () =>
      DEMO_SUBMISSIONS.map((row) => {
        const gate = applyFraudGates(row);
        return { ...row, gate };
      }),
    [],
  );

  useEffect(() => {
    void fetch("/api/admin/ingest-gps")
      .then((r) => r.json())
      .then((j: { configured?: boolean; count?: number | null }) => {
        setSupabaseOk(Boolean(j.configured));
        setRemoteCount(typeof j.count === "number" ? j.count : null);
      })
      .catch(() => setSupabaseOk(false));
  }, []);

  function unlock(id: string) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unlocked: !c.unlocked } : c)),
    );
  }

  function runQuotaRecovery() {
    let log = "";
    setWardQuota((prev) => {
      const next = { ...prev };
      for (const row of audited) {
        if (row.gate.quota_replenish) {
          next[row.ward] = (next[row.ward] ?? 20) + 1;
          log += `Ward ${row.ward}: +1 quota (fraud ${row.gate.reason}). `;
        }
      }
      return next;
    });
    setIngestLog((l) => `${log || "No fraud queues."} | ${l}`);
  }

  async function pushToSupabase() {
    setIngesting(true);
    try {
      const res = await fetch("/api/admin/ingest-gps", { method: "POST" });
      const j = (await res.json()) as {
        ok?: boolean;
        upserted?: number;
        districts?: Record<string, number>;
        error?: string;
        telegram?: { ok?: boolean; skipped?: boolean; error?: string };
      };
      if (!res.ok || j.error) {
        setIngestLog(
          `Ingest failed: ${j.error ?? res.status}. Sample/ward math still local (13 wards → ${samplesPerWard(13)}/ward).`,
        );
        return;
      }
      setRemoteCount(j.upserted ?? null);
      setSupabaseOk(true);
      const dist = j.districts
        ? Object.entries(j.districts)
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")
        : "";
      const tg =
        j.telegram?.ok
          ? "Telegram alert sent."
          : j.telegram?.skipped
            ? "Telegram skipped (env unset)."
            : j.telegram?.error
              ? `Telegram: ${j.telegram.error}`
              : "";
      setIngestLog(
        `Supabase upsert OK — ${j.upserted} rows (${dist}). ${tg}`,
      );
    } catch (e) {
      setIngestLog(`Ingest error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIngesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-10">
        <header className="flex h-14 items-center justify-between rounded-full border border-white/50 bg-white/70 px-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-[50px]">
          <Panchayat360Logo size="sm" withTagline={false} />
          <span className="rounded-full bg-[#0F172A] px-3 py-1 text-[10px] font-bold text-white">
            SUPER ADMIN
          </span>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-black/[0.05] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#007AFF]">
              <FileSpreadsheet className="h-4 w-4" /> Master Directory
            </div>
            <p className="mt-2 text-3xl font-black">{gramPanchayats.length}</p>
            <p className="text-xs text-[#6E6E73]">
              Local seed · Supabase{" "}
              {supabaseOk
                ? `live (${remoteCount ?? "…"} rows)`
                : "offline — set .env.local"}
            </p>
            <button
              type="button"
              disabled={ingesting}
              onClick={() => void pushToSupabase()}
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#007AFF] px-4 text-xs font-bold text-white disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {ingesting ? "Upserting…" : "Push GPs → Supabase"}
            </button>
          </div>

          <div className="rounded-[24px] border border-black/[0.05] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:col-span-2">
            <p className="text-xs font-bold text-[#6E6E73]">Timeline & crew sizing</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {([2, 3, 4] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={cn(
                    "h-11 rounded-2xl px-4 text-xs font-bold border",
                    days === d
                      ? "border-transparent bg-slate-900 text-white"
                      : "border-black/[0.04] bg-[#F5F5F7]",
                  )}
                >
                  {d} Days → {crewForTimeline(d).surveyors} surveyors
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold">
              Active config: {ops.surveyors} enumerators + {ops.supervisors} auditor
              ({ops.dailyTarget}/day)
            </p>
          </div>
        </section>

        <section className="rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1DB954]" />
              <h2 className="text-sm font-extrabold">Live Quality Gate Audits</h2>
            </div>
            <button
              type="button"
              onClick={runQuotaRecovery}
              className="h-11 rounded-2xl border border-black/[0.06] bg-[#F5F5F7] px-4 text-xs font-bold"
            >
              Run quota replenishment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="text-[#6E6E73]">
                <tr>
                  <th className="pb-2 font-bold">ID</th>
                  <th className="pb-2 font-bold">Ward</th>
                  <th className="pb-2 font-bold">Surveyor</th>
                  <th className="pb-2 font-bold">Duration</th>
                  <th className="pb-2 font-bold">Gate</th>
                  <th className="pb-2 font-bold">Quota</th>
                </tr>
              </thead>
              <tbody>
                {audited.map((row) => (
                  <tr key={row.id} className="border-t border-black/[0.04]">
                    <td className="py-3 font-mono">{row.id}</td>
                    <td>{row.ward}</td>
                    <td>{row.surveyor_id}</td>
                    <td>{row.interview_duration_seconds}s</td>
                    <td>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-bold",
                          row.gate.is_flagged_fraud
                            ? "bg-[#EF4444]/10 text-[#DC2626]"
                            : "bg-[#1DB954]/10 text-[#1DB954]",
                        )}
                      >
                        {row.gate.reason}
                      </span>
                    </td>
                    <td>{wardQuota[row.ward] ?? 20}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rounded-2xl bg-[#F5F5F7] p-3 text-[11px] text-[#6E6E73]">
            {ingestLog}
          </p>
        </section>

        <section className="rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
          <h2 className="text-sm font-extrabold">Client Access Switches</h2>
          <ul className="space-y-2">
            {clients.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-black/[0.04] bg-[#F5F5F7] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-xs text-[#6E6E73]">
                    {c.phone} · {c.gp}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => unlock(c.id)}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold border border-black/[0.06]"
                >
                  {c.unlocked ? (
                    <>
                      <ToggleRight className="h-4 w-4 text-[#1DB954]" /> Unlocked
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-[#6E6E73]" /> Locked
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminConsole;
