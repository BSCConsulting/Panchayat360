import type { SupabaseClient } from "@supabase/supabase-js";
import type { GramPanchayat } from "@/types";
import { gramPanchayats } from "@/lib/gp";

const BATCH = 200;

export type IngestResult = {
  upserted: number;
  batches: number;
  districts: Record<string, number>;
};

export async function ingestGramPanchayats(
  admin: SupabaseClient,
  rows: GramPanchayat[] = gramPanchayats,
): Promise<IngestResult> {
  const districts: Record<string, number> = {};
  let upserted = 0;
  let batches = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH).map((r) => ({
      district: r.district,
      mandal: r.mandal,
      mandal_population: r.mandal_population,
      gp_name: r.gp_name,
      gp_population: r.gp_population,
      statutory_wards: r.statutory_wards,
      statutory_tier: r.statutory_tier,
    }));

    const { data, error } = await admin
      .from("gram_panchayats")
      .upsert(slice, { onConflict: "district,mandal,gp_name" })
      .select("district");

    if (error) throw new Error(error.message);

    const n = data?.length ?? slice.length;
    upserted += n;
    batches += 1;
    for (const row of data ?? slice) {
      const d = (row as { district: string }).district;
      districts[d] = (districts[d] ?? 0) + 1;
    }
  }

  return { upserted, batches, districts };
}
