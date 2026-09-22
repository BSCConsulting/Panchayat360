"use client";

type Props = {
  clientName?: string;
  clientPhone?: string;
};

/** Diagonal anti-leak watermark across authenticated surfaces. */
export function ConfidentialWatermark({
  clientName = "CLIENT",
  clientPhone = "••••••••••",
}: Props) {
  const label = `CONFIDENTIAL • ${clientName} • ${clientPhone} • RESTRICTED ACCESS`;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden opacity-[0.035]"
      aria-hidden
    >
      <div className="flex h-full w-[200%] flex-wrap content-start gap-24 p-8 -translate-x-1/4">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="rotate-[-30deg] text-xl font-black tracking-widest text-[#1D1D1F] whitespace-nowrap"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
