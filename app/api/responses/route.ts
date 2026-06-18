import { NextResponse } from "next/server";
import type { DemographicAnswers } from "../../../data/demographics";
import type { SurveyAnswer } from "../../../data/types";

// Thai time (UTC+7) as "YYYY-MM-DD HH:MM:SS". Independent of the server's
// timezone (Cloud Run runs UTC), and sorts correctly as text in Google Sheets.
function thaiTimestamp(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

// Cloud Run has an ephemeral, often read-only filesystem and auto-scales across
// instances, so the Google Sheet is the single source of truth. We await the
// push and report failure back to the client so it can retry.
async function pushToGoogleSheet(record: Record<string, unknown>): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) {
    console.error("[responses] GOOGLE_SHEET_WEBHOOK_URL is not set");
    return false;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: controller.signal,
      // GAS web apps respond with a 302 redirect to script.googleusercontent.com;
      // fetch follows it by default, which is what we want.
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`[responses] Google Sheet push failed: HTTP ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[responses] Google Sheet push error:", err);
    return false;
  }
}

function flattenForSheet(
  f: number,
  c: number,
  w: number,
  personaId: string,
  personaGender: string,
  demographics: DemographicAnswers,
  answers: SurveyAnswer[],
  email: string | undefined,
  consent: { consentAccepted: boolean; marketingConsent: boolean; consentTimestamp: string },
) {
  const flat: Record<string, unknown> = {
    timestamp: thaiTimestamp(),
    personaId,
    f,
    c,
    w,
    positionLevel: demographics.positionLevel ?? "",
    industry: demographics.industry ?? "",
    ageRange: demographics.ageRange ?? "",
    incomeRange: demographics.incomeRange ?? "",
    email: email ?? "",
    consentAccepted: consent.consentAccepted ? "TRUE" : "FALSE",
    marketingConsent: consent.marketingConsent ? "TRUE" : "FALSE",
    consentTimestamp: consent.consentTimestamp,
  };
  for (const a of answers) {
    if (a && typeof a.questionId === "string") {
      flat[a.questionId] = a.value;
    }
  }
  flat.personaGender = personaGender;
  return flat;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { f, c, w, personaId, demographics, answers } = body as {
    f: unknown;
    c: unknown;
    w: unknown;
    personaId: unknown;
    demographics?: DemographicAnswers;
    answers?: SurveyAnswer[];
  };

  if (typeof f !== "number" || typeof c !== "number" || typeof w !== "number") {
    return NextResponse.json({ ok: false, error: "invalid_scores" }, { status: 400 });
  }

  const flat = flattenForSheet(
    f,
    c,
    w,
    String(personaId ?? ""),
    typeof body.personaGender === "string" ? body.personaGender : "",
    demographics ?? {},
    Array.isArray(answers) ? answers : [],
    typeof body.email === "string" ? body.email : undefined,
    {
      consentAccepted: body.consentAccepted === true,
      marketingConsent: body.marketingConsent === true,
      // Stamp consent time server-side in Thai time, consistent with the main
      // timestamp column and not dependent on the client's clock.
      consentTimestamp: thaiTimestamp(),
    },
  );

  const pushed = await pushToGoogleSheet(flat);

  if (!pushed) {
    // Surface the failure so the client can retry instead of silently losing data.
    return NextResponse.json({ ok: false, error: "sheet_push_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
