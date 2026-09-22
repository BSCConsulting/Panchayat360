/**
 * Panchayat360 / Poll-Pulse AP — Telegram webhook (grammY + Supabase Edge).
 * Pattern: https://supabase.com/docs/guides/functions/examples/telegram-bot
 *
 * Deploy:
 *   supabase functions deploy telegram-bot --no-verify-jwt --project-ref <REF>
 *   supabase secrets set TELEGRAM_BOT_TOKEN=... FUNCTION_SECRET=... --project-ref <REF>
 * Webhook:
 *   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<REF>.supabase.co/functions/v1/telegram-bot?secret=<FUNCTION_SECRET>
 */
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.21.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const token = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const functionSecret = Deno.env.get("FUNCTION_SECRET") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const bot = new Bot(token);
const db = createClient(supabaseUrl, serviceKey);

bot.command("start", async (ctx) => {
  await ctx.reply(
    [
      "<b>Panchayat360 Ops Bot</b>",
      "Commands:",
      "/status — GP directory counts",
      "/projects — active survey projects",
      "/fraud — latest flagged submissions",
      "/ping — health check",
    ].join("\n"),
    { parse_mode: "HTML" },
  );
});

bot.command("ping", (ctx) =>
  ctx.reply(`Pong · ${new Date().toISOString()}`),
);

bot.command("status", async (ctx) => {
  const { count: gps, error } = await db
    .from("gram_panchayats")
    .select("*", { count: "exact", head: true });
  if (error) {
    await ctx.reply(`DB error: ${error.message}`);
    return;
  }
  const districts = ["NTR", "Krishna", "West Godavari"] as const;
  const lines: string[] = [`<b>GP directory:</b> ${gps ?? 0} rows`];
  for (const d of districts) {
    const { count } = await db
      .from("gram_panchayats")
      .select("*", { count: "exact", head: true })
      .eq("district", d);
    lines.push(`· ${d}: ${count ?? 0}`);
  }
  await ctx.reply(lines.join("\n"), { parse_mode: "HTML" });
});

bot.command("projects", async (ctx) => {
  const { data, error } = await db
    .from("survey_projects")
    .select("id, status, target_timeline_days, total_sample_target, required_surveyors")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) {
    await ctx.reply(`DB error: ${error.message}`);
    return;
  }
  if (!data?.length) {
    await ctx.reply("No survey projects yet.");
    return;
  }
  const body = data
    .map(
      (p, i) =>
        `${i + 1}. <code>${p.id.slice(0, 8)}</code> · ${p.status} · ${p.required_surveyors} enum · ${p.total_sample_target} samples · ${p.target_timeline_days}d`,
    )
    .join("\n");
  await ctx.reply(`<b>Recent projects</b>\n${body}`, { parse_mode: "HTML" });
});

bot.command("fraud", async (ctx) => {
  const { data, error } = await db
    .from("survey_responses")
    .select("id, ward_number, surveyor_id, interview_duration_seconds, is_straight_lined, submitted_at")
    .eq("is_flagged_fraud", true)
    .order("submitted_at", { ascending: false })
    .limit(8);
  if (error) {
    await ctx.reply(`DB error: ${error.message}`);
    return;
  }
  if (!data?.length) {
    await ctx.reply("No flagged fraud rows.");
    return;
  }
  const body = data
    .map(
      (r) =>
        `W${r.ward_number} · ${r.surveyor_id} · ${r.interview_duration_seconds}s${r.is_straight_lined ? " · straight-line" : ""}`,
    )
    .join("\n");
  await ctx.reply(`<b>Fraud queue</b>\n${body}`, { parse_mode: "HTML" });
});

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== functionSecret) {
      return new Response("not allowed", { status: 405 });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
