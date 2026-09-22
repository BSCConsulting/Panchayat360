/** Server-side Telegram Bot API helpers (ops alerts). */

const API = "https://api.telegram.org";

export type TelegramSendResult =
  | { ok: true; message_id: number }
  | { ok: false; skipped?: boolean; error: string };

function creds() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_OPS_CHAT_ID;
  return { token, chatId };
}

export function telegramConfigured(): boolean {
  const { token, chatId } = creds();
  return Boolean(token && chatId);
}

export async function sendTelegramHtml(
  html: string,
  chatIdOverride?: string,
): Promise<TelegramSendResult> {
  const { token, chatId } = creds();
  const target = chatIdOverride ?? chatId;
  if (!token || !target) {
    return { ok: false, skipped: true, error: "TELEGRAM_BOT_TOKEN or TELEGRAM_OPS_CHAT_ID unset" };
  }

  const res = await fetch(`${API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: target,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const json = (await res.json()) as {
    ok: boolean;
    result?: { message_id: number };
    description?: string;
  };

  if (!json.ok || !json.result) {
    return { ok: false, error: json.description ?? `HTTP ${res.status}` };
  }
  return { ok: true, message_id: json.result.message_id };
}

export function fraudAlertHtml(row: {
  ward: number;
  surveyor_id: string;
  seconds: number;
  reason: string;
  gp?: string;
}): string {
  return [
    "<b>Panchayat360 · Fraud gate</b>",
    `Ward <b>${row.ward}</b> · ${row.surveyor_id}`,
    `Duration: ${row.seconds}s · Reason: <code>${row.reason}</code>`,
    row.gp ? `GP: ${row.gp}` : "",
    "Quota replenished +1",
  ]
    .filter(Boolean)
    .join("\n");
}

export function ingestAlertHtml(stats: {
  upserted: number;
  districts: Record<string, number>;
}): string {
  const dist = Object.entries(stats.districts)
    .map(([k, v]) => `· ${k}: ${v}`)
    .join("\n");
  return [
    "<b>Panchayat360 · GP ingest</b>",
    `Upserted: <b>${stats.upserted}</b>`,
    dist,
  ].join("\n");
}
