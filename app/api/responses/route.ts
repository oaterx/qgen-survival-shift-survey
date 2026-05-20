import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { DemographicAnswers } from "../../../data/demographics";
import type { SurveyAnswer } from "../../../data/types";

async function pushToGoogleSheet(record: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch {
    // Non-fatal — local file is the source of truth
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { f, c, w, personaId, demographics, answers } = body as {
      f: unknown;
      c: unknown;
      w: unknown;
      personaId: unknown;
      demographics?: DemographicAnswers & { gender?: string };
      answers?: SurveyAnswer[];
    };

    if (typeof f !== "number" || typeof c !== "number" || typeof w !== "number") {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const record = {
      timestamp: new Date().toISOString(),
      f,
      c,
      w,
      personaId: String(personaId ?? ""),
      demographics: demographics ?? {},
      answers: answers ?? [],
    };

    // Save locally
    const filePath = path.join(process.cwd(), "data", "responses.jsonl");
    fs.appendFileSync(filePath, JSON.stringify(record) + "\n", "utf-8");

    // Push to Google Sheet (fire-and-forget, non-blocking)
    pushToGoogleSheet(record);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
