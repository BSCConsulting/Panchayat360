import { AdminConsole } from "@/components/AdminConsole";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = getSupabaseAdmin();
  let initialConfigured = false;
  let initialCount: number | null = null;

  if (admin) {
    initialConfigured = true;
    const { count } = await admin
      .from("gram_panchayats")
      .select("*", { count: "exact", head: true });
    initialCount = count ?? null;
  }

  return (
    <AdminConsole
      initialConfigured={initialConfigured}
      initialCount={initialCount}
    />
  );
}
