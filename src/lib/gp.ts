import type { GramPanchayat } from "@/types";
import raw from "@/data/gram_panchayats.json";

export const DISTRICTS = ["NTR", "Krishna", "West Godavari"] as const;

export const gramPanchayats = raw as GramPanchayat[];

export function mandalsFor(district: string): string[] {
  return [
    ...new Set(
      gramPanchayats
        .filter((g) => g.district === district)
        .map((g) => g.mandal)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export function gpsFor(district: string, mandal: string): GramPanchayat[] {
  return gramPanchayats
    .filter((g) => g.district === district && g.mandal === mandal)
    .sort((a, b) => a.gp_name.localeCompare(b.gp_name));
}

export function findGp(
  district: string,
  mandal: string,
  gpName: string,
): GramPanchayat | undefined {
  return gramPanchayats.find(
    (g) =>
      g.district === district &&
      g.mandal === mandal &&
      g.gp_name === gpName,
  );
}
