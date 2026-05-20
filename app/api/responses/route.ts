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

function flattenForSheet(
  f: number,
  c: number,
  w: number,
  personaId: string,
  demographics: DemographicAnswers & { gender?: string },
  answers: SurveyAnswer[],
) {
  const flat: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    personaId,
    f,
    c,
    w,
    gender: demographics.gender ?? "",
    positionLevel: demographics.positionLevel ?? "",
    industry: demographics.industry ?? "",
    ageRange: demographics.ageRange ?? "",
    incomeRange: demographics.incomeRange ?? "",
  };
  for (const a of answers) {
    flat[a.questionId] = a.value;
  }
  return flat;
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

    // Save locally (full nested format)
    const filePath = path.join(process.cwd(), "data", "responses.jsonl");
    fs.appendFileSync(filePath, JSON.stringify(record) + "\n", "utf-8");

    // Push to Google Sheet (flat columns: one column per question)
    const flat = flattenForSheet(
      f,
      c,
      w,
      String(personaId ?? ""),
      demographics ?? {},
      answers ?? [],
    );
    pushToGoogleSheet(flat);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
