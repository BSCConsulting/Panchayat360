import { NextResponse } from "next/server";
import { ingestGramPanchayats } from "@/lib/ingest";
import { getSupabaseAdmin, supabaseConfigured } from "@/lib/supabase";
import { ingestAlertHtml, sendTelegramHtml } from "@/lib/telegram";

export const runtime = "nodejs";

/** POST /api/admin/ingest-gps — upsert seed GPs into Supabase (service role). */
export async function POST(req: Request) {
  const secret = process.env.ADMIN_INGEST_SECRET;
  if (secret) {
    const header = req.headers.get("x-admin-secret");
    if (header !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  if (!supabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local (project Panchyat360).",
      },
      { status: 503 },
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY required for ingest" },
      { status: 503 },
    );
  }

  try {
    const result = await ingestGramPanchayats(admin);
    const tg = await sendTelegramHtml(ingestAlertHtml(result));
    return NextResponse.json({ ok: true, ...result, telegram: tg });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({
      configured: false,
      project: "Panchyat360",
      count: null,
    });
  }
  const { count, error } = await admin
    .from("gram_panchayats")
    .select("*", { count: "exact", head: true });
  return NextResponse.json({
    configured: true,
    project: "Panchyat360",
    count: error ? null : count,
    error: error?.message ?? null,
  });
}
