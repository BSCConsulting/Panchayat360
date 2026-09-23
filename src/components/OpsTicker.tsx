"use client";

import type { Lang } from "@/types";

const TICKS_TE = [
  "వార్డు 8 · 14 శాంపిల్స్ · ఫ్రాడ్ డిస్కార్డ్",
  "నవాబ్‌పేట · టైర్-2 కోటా 62% నిండింది",
  "పెనుగంచిప్రోలు · GPS ఆడిట్ పాస్",
  "కృష్ణ · మండలం సర్వే క్రూస్ ఆన్‌లైన్",
  "వెస్ట్ గోదావరి · 9 వార్డులు సేఫ్ జోన్",
  "NTR · అన్‌ఎయిడెడ్ నాయకత్వ స్కాన్ రన్",
];

const TICKS_EN = [
  "Ward 8 · 14 samples · fraud discarded",
  "Nawabpeta · Tier-2 quota 62% filled",
  "Penuganchiprolu · GPS audit PASS",
  "Krishna · mandal survey crews online",
  "West Godavari · 9 wards in SAFE zone",
  "NTR · unaided leadership scan running",
];

type Props = { lang: Lang };

/** Scrolling field-ops ticker — war-room urgency. */
export function OpsTicker({ lang }: Props) {
  const items = lang === "te" ? TICKS_TE : TICKS_EN;
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-[var(--pp-amber)]/35 bg-black/55">
      <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-[var(--pp-amber)] px-3 font-mono text-[10px] font-bold tracking-widest text-[var(--pp-midnight)]">
        LIVE
      </div>
      <div className="pp-ticker-track flex w-max whitespace-nowrap py-2.5 pl-16">
        {loop.map((msg, i) => (
          <span
            key={`${msg}-${i}`}
            className="mx-6 inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-[var(--pp-amber-hot)] sm:text-xs"
            style={
              lang === "te"
                ? { fontFamily: "var(--font-noto-te), monospace" }
                : undefined
            }
          >
            <span className="text-[var(--pp-danger)]">▸</span>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
