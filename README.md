# Poll-Pulse AP / Panchayat360

Grassroots electoral intelligence for Andhra Pradesh Gram Panchayat elections (NTR, Krishna, West Godavari).

## Stack

Next.js App Router · React · Tailwind CSS · TypeScript · Supabase · Telegram (grammY edge + Bot API alerts)

## Routes

| Path | Module |
|------|--------|
| `/` | Landing + street pulse board + estimator + locked portal preview |
| `/dashboard` | Client strategy portal |
| `/admin` | Super admin — push GPs to Supabase, fraud gates, unlock switches |

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| `GET/POST` | `/api/admin/ingest-gps` | Upsert 976 GPs into Supabase (+ Telegram ingest alert) |
| `POST` | `/api/survey/ingest` | CAPI row + fraud gates + Telegram fraud alert |

## Telegram edge function

`supabase/functions/telegram-bot` — grammY webhook (`/start`, `/status`, `/projects`, `/fraud`, `/ping`).

```bash
# After linking project Panchyat360
supabase functions deploy telegram-bot --no-verify-jwt
supabase secrets set TELEGRAM_BOT_TOKEN=... FUNCTION_SECRET=... SUPABASE_SERVICE_ROLE_KEY=...
# setWebhook
# https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<REF>.supabase.co/functions/v1/telegram-bot?secret=<FUNCTION_SECRET>
```

## Setup

1. Paste `supabase/schema.sql` into Supabase SQL Editor (project **Panchyat360**).
2. Copy `.env.example` → `.env.local` and fill URL + anon + **service role** + Telegram token/chat.
3. Run:

```bash
npm install
npm run dev
# or one-shot CLI ingest:
npm run ingest:gps
```

Admin UI → **Push GPs → Supabase**.

## Self-check

```bash
npm run check
```
