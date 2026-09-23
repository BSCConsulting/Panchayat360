"use client";

type Props = {
  clientName?: string;
  clientPhone?: string;
  tone?: "light" | "dark";
};

/** Diagonal anti-leak watermark — War Board / authenticated surfaces only. */
export function ConfidentialWatermark({
  clientName = "CLIENT",
  clientPhone = "••••••••••",
  tone = "dark",
}: Props) {
  const label = `CONFIDENTIAL • ${clientName} • ${clientPhone} • RESTRICTED ACCESS`;
  const color = tone === "dark" ? "#e8eaed" : "#1D1D1F";
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden opacity-[0.045]"
      aria-hidden
    >
      <div className="flex h-full w-[200%] flex-wrap content-start gap-24 p-8 -translate-x-1/4">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="rotate-[-30deg] whitespace-nowrap font-mono text-xl font-black tracking-widest"
            style={{ color }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
