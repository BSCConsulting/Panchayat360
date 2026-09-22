import { NextResponse } from "next/server";
import { applyFraudGates, type SurveyChoiceFields } from "@/lib/fraud";
import { getSupabaseAdmin } from "@/lib/supabase";
import { fraudAlertHtml, sendTelegramHtml } from "@/lib/telegram";

export const runtime = "nodejs";

type Body = SurveyChoiceFields & {
  project_id: string;
  ward_number: number;
  surveyor_id: string;
  demographics?: Record<string, unknown>;
  gp_name?: string;
  [key: string]: unknown;
};

/** POST /api/survey/ingest — CAPI row + fraud gates + Telegram alert + quota note. */
export async function POST(req: Request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (
    !body.project_id ||
    !body.surveyor_id ||
    typeof body.ward_number !== "number" ||
    typeof body.interview_duration_seconds !== "number"
  ) {
    return NextResponse.json(
      { error: "project_id, surveyor_id, ward_number, interview_duration_seconds required" },
      { status: 400 },
    );
  }

  const gate = applyFraudGates(body);

  const { data, error } = await admin
    .from("survey_responses")
    .insert({
      project_id: body.project_id,
      ward_number: body.ward_number,
      surveyor_id: body.surveyor_id,
      interview_duration_seconds: body.interview_duration_seconds,
      is_straight_lined: gate.is_straight_lined,
      is_flagged_fraud: gate.is_flagged_fraud,
      demographics: body.demographics ?? {},
      q1_civic_issue: body.q1_civic_issue ?? null,
      q8_candidate_priority_trait: body.q8_candidate_priority_trait ?? null,
      q9_ysrcp_governance_rating: body.q9_ysrcp_governance_rating ?? null,
      q10_nda_governance_rating: body.q10_nda_governance_rating ?? null,
      q11_regime_comparison: body.q11_regime_comparison ?? null,
      q12_immediate_priority_issue: body.q12_immediate_priority_issue ?? null,
      q14_voting_anchor_factor: body.q14_voting_anchor_factor ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let telegram = null;
  if (gate.is_flagged_fraud) {
    telegram = await sendTelegramHtml(
      fraudAlertHtml({
        ward: body.ward_number,
        surveyor_id: body.surveyor_id,
        seconds: body.interview_duration_seconds,
        reason: gate.reason,
        gp: body.gp_name,
      }),
    );
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    gate,
    telegram,
  });
}
