"use client";

import { cn } from "@/lib/cn";
import type { Lang } from "@/types";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<
  Size,
  { emblem: number; title: string; tag: string; gap: string }
> = {
  sm: { emblem: 36, title: "text-sm", tag: "text-[10px]", gap: "gap-2" },
  md: { emblem: 48, title: "text-lg", tag: "text-xs", gap: "gap-3" },
  lg: { emblem: 72, title: "text-2xl sm:text-3xl", tag: "text-sm", gap: "gap-4" },
};

type Props = {
  size?: Size;
  withTagline?: boolean;
  lang?: Lang;
  className?: string;
  /** inverse = on dark photo / war board */
  inverse?: boolean;
};

/** 360° ward-radar emblem + Panchayat360 wordmark. */
export function Panchayat360Logo({
  size = "md",
  withTagline = true,
  lang = "en",
  className,
  inverse = false,
}: Props) {
  const s = SIZE_MAP[size];
  const tagline =
    lang === "te"
      ? "గ్రామ గెలుపుకు శాస్త్రీయ వ్యూహం"
      : "Precision Intelligence for Panchayat Victory";

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <WardRadarEmblem size={s.emblem} />
      <div className="min-w-0 leading-tight">
        <div
          className={cn("font-extrabold tracking-tight", s.title)}
          style={{ letterSpacing: "-0.04em" }}
        >
          <span className={inverse ? "text-white" : "text-[var(--pp-ink)]"}>
            Panchayat
          </span>
          <span className="text-[var(--pp-amber)]">360</span>
        </div>
        {withTagline && (
          <p
            className={cn(
              "truncate font-semibold",
              s.tag,
              inverse ? "text-white/70" : "text-[var(--pp-muted)]",
              lang === "te" && "leading-[1.6]",
            )}
            style={
              lang === "te"
                ? { fontFamily: "var(--font-noto-te), sans-serif" }
                : undefined
            }
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}

/** 12-segment statutory-ward radar dial with RAG glow accents. */
export function WardRadarEmblem({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const cx = 50;
  const cy = 50;
  const outerR = 44;
  const innerR = 32;
  const gapDeg = 2.5;
  const segmentDeg = 360 / 12;

  // Highlight indices (0 = top / -90° start): top-right ≈ 1, right/bottom-right ≈ 3, bottom-left ≈ 7
  const accents: Record<number, { fill: string; glow: string }> = {
    1: { fill: "#E8A317", glow: "rgba(232,163,23,0.45)" },
    3: { fill: "#2F9E6B", glow: "rgba(47,158,107,0.45)" },
    7: { fill: "#E8DFD0", glow: "rgba(232,223,208,0.35)" },
  };

  // polar() treats 0° as top; accents: ~1 o'clock, ~4 o'clock, ~8 o'clock
  const segments = Array.from({ length: 12 }, (_, i) => {
    const start = i * segmentDeg + gapDeg / 2;
    const end = (i + 1) * segmentDeg - gapDeg / 2;
    const accent = accents[i];
    return {
      i,
      d: annularSector(cx, cy, innerR, outerR, start, end),
      fill: accent?.fill ?? "#0F172A",
      glow: accent?.glow,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      aria-label="Panchayat360 ward radar emblem"
      role="img"
    >
      <defs>
        {segments
          .filter((s) => s.glow)
          .map((s) => (
            <radialGradient
              key={`g-${s.i}`}
              id={`glow-${s.i}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={s.glow!} stopOpacity="0.9" />
              <stop offset="100%" stopColor={s.fill} stopOpacity="1" />
            </radialGradient>
          ))}
      </defs>

      {/* Soft ambient glow behind accent segments */}
      {segments
        .filter((s) => s.glow)
        .map((s) => {
          const mid = s.i * segmentDeg + segmentDeg / 2;
          const p = polar(cx, cy, 38, mid);
          const gx = p.x;
          const gy = p.y;
          return (
            <circle
              key={`glow-dot-${s.i}`}
              cx={gx}
              cy={gy}
              r={10}
              fill={s.glow}
              opacity={0.55}
            />
          );
        })}

      {segments.map((s) => (
        <path
          key={s.i}
          d={s.d}
          fill={s.glow ? `url(#glow-${s.i})` : s.fill}
        />
      ))}

      {/* Inner reticle disc */}
      <circle cx={cx} cy={cy} r={24} fill="#0F172A" />
      <line
        x1={cx}
        y1={cy - 14}
        x2={cx}
        y2={cy + 14}
        stroke="#FFFFFF"
        strokeWidth={1}
        opacity={0.35}
      />
      <line
        x1={cx - 14}
        y1={cy}
        x2={cx + 14}
        y2={cy}
        stroke="#FFFFFF"
        strokeWidth={1}
        opacity={0.35}
      />
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={0.75}
        opacity={0.2}
      />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FFFFFF"
        fontSize={22}
        fontWeight={800}
        fontFamily="var(--font-outfit), sans-serif"
      >
        P
      </text>
    </svg>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  // Round so SSR/client SVG paths match (avoids hydration mismatch).
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 1e6) / 1e6,
    y: Math.round((cy + r * Math.sin(rad)) * 1e6) / 1e6,
  };
}

function annularSector(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number,
) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const o1 = polar(cx, cy, rOuter, startDeg);
  const o2 = polar(cx, cy, rOuter, endDeg);
  const i1 = polar(cx, cy, rInner, endDeg);
  const i2 = polar(cx, cy, rInner, startDeg);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

export default Panchayat360Logo;
