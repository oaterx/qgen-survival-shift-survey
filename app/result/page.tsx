import { notFound } from "next/navigation";
import Link from "next/link";
import { routePersona } from "../../lib/persona-router";
import { getAxisResult } from "../../lib/scoring";
import { loadStorycardAssets } from "../../lib/storycard-assets";
import QGenLogo from "../../components/QGenLogo";
import ScoreRing from "../../components/survival-shift/ScoreRing";
import ScoreBar from "./ScoreBar";
import ShareStoryButton from "./ShareStoryButton";
import ShareLinkButton from "./ShareLinkButton";
import type { StatusId } from "../../data/types";

const AXIS_NAME_EN: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};
const AXIS_NAME_TH: Record<string, string> = { F: "การเงิน", C: "อาชีพ", W: "สุขภาพ" };

const THEME_COLOR: Record<string, string> = {
  green:  "#4F9B45",
  orange: "#C96F3B",
  red:    "#E66A2C",
};

const ACTION_ACCENT: Record<string, string> = {
  "30days":  "#C96F3B",
  "90days":  "#6B7280",
  "365days": "#374151",
};

function scoreToColor(score: number): string {
  return `hsl(${(score * 1.2).toFixed(0)}, 68%, 42%)`;
}

function scoreLevel(score: number): { label: string; description: string } {
  if (score >= 67) return { label: "Stable", description: "You're in a good place. Keep doing what works." };
  if (score >= 33) return { label: "At Risk", description: "Early signs of pressure. Small adjustments can help." };
  return { label: "Crisis", description: "High stress detected. Time to take action." };
}

function statusEN(s: StatusId): string {
  if (s === "stable") return "Stable";
  if (s === "atRisk") return "At Risk";
  return "Crisis";
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; c?: string; w?: string }>;
}) {
  const sp = await searchParams;
  const f = parseFloat(sp.f ?? "");
  const c = parseFloat(sp.c ?? "");
  const w = parseFloat(sp.w ?? "");
  if (isNaN(f) || isNaN(c) || isNaN(w)) return notFound();

  const scores = { F: f, C: c, W: w };
  const persona = routePersona(scores);
  const axisResult = getAxisResult(scores);

  const overallScore = Math.round(
    (axisResult.F.roundedScore + axisResult.C.roundedScore + axisResult.W.roundedScore) / 3
  );
  const level = scoreLevel(overallScore);
  const personaAccent = THEME_COLOR[persona.theme] ?? "#C96F3B";

  const actionPlan = (persona as { actionPlan?: Record<string, { titleTH: string; actions: string[] }> }).actionPlan;
  const { fontFace, logoDataUrl } = loadStorycardAssets();

  return (
    <main className="min-h-screen pb-16">

      {/* Header — logo only */}
      <header className="flex flex-col items-center pt-7 pb-5 animate-fade-in">
        <QGenLogo height={48} />
      </header>

      <div className="px-5 max-w-lg mx-auto flex flex-col gap-5">

        {/* ── Persona ── */}
        <section
          className="rounded-2xl bg-qgen-paper-alt/80 border border-qgen-gray-border overflow-hidden animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          <div className="px-5 py-3 border-b border-qgen-gray-border">
            <h2 className="font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-qgen-gray-ash">
              Your Persona
            </h2>
          </div>
          <div className="px-6 pt-5 pb-5 flex flex-col items-center text-center">
            <h3 className="text-[24px] font-bold text-qgen-black-absolute leading-tight mb-2">
              {persona.name}
            </h3>
            {persona.tagline && (
              <p className="font-ui text-sm italic mb-4" style={{ color: personaAccent }}>
                "{persona.tagline}"
              </p>
            )}
            <p className="text-[13.5px] text-qgen-gray-ash leading-relaxed mb-5">
              {persona.description}
            </p>
          </div>
        </section>

        {/* ── Your Survival Score ── */}
        <section
          className="rounded-2xl bg-qgen-paper-alt/80 border border-qgen-gray-border overflow-hidden animate-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          <div className="px-5 py-3 border-b border-qgen-gray-border">
            <h2 className="font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-qgen-gray-ash">
              Your Survival Score
            </h2>
          </div>
          <div className="px-5 py-8 flex items-center justify-center gap-5">
            <ScoreRing score={overallScore} size={110} />
            <div>
              <p
                className="font-ui text-[26px] font-bold leading-tight"
                style={{ color: scoreToColor(overallScore) }}
              >
                {level.label}
              </p>
              <p className="text-[13px] text-qgen-gray-ash leading-relaxed mt-1.5 max-w-[180px]">
                {level.description}
              </p>
            </div>
          </div>
        </section>

        {/* ── Axis Scores ── */}
        <section
          className="rounded-2xl border border-qgen-gray-border bg-qgen-paper-alt/80 overflow-hidden animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          <div className="px-5 py-3 border-b border-qgen-gray-border">
            <h2 className="font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-qgen-gray-ash">
              Axis Scores
            </h2>
          </div>
          <div className="divide-y divide-qgen-gray-border/70">
            {(["F", "C", "W"] as const).map((axis, i) => {
              const r = axisResult[axis];
              return (
                <div key={axis} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col leading-tight">
                      <span className="font-ui font-semibold text-qgen-black-soft" style={{ fontSize: 14 }}>
                        {AXIS_NAME_EN[axis]}
                      </span>
                      <span className="text-qgen-gray-ash mt-0.5" style={{ fontSize: 12 }}>
                        {AXIS_NAME_TH[axis]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-ui text-3xl font-bold text-qgen-black-absolute tabular-nums leading-none">
                        {r.roundedScore}
                        <span className="font-ui text-xs font-normal text-qgen-gray-ash ml-0.5">%</span>
                      </span>
                      <span
                        className="font-ui text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: scoreToColor(r.roundedScore) }}
                      >
                        {statusEN(r.status)}
                      </span>
                    </div>
                  </div>
                  <ScoreBar score={r.roundedScore} delay={i * 120} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Recommended Actions ── */}
        {actionPlan && (
          <section
            className="rounded-2xl border border-qgen-gray-border bg-qgen-paper-alt/80 overflow-hidden animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="px-5 py-3 border-b border-qgen-gray-border">
              <h2 className="font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-qgen-gray-ash">
                Recommended Actions
              </h2>
            </div>
            <div className="divide-y divide-qgen-gray-border/70">
              {(["30days", "90days", "365days"] as const).map((key) => {
                const plan = actionPlan[key];
                if (!plan) return null;
                const accent = ACTION_ACCENT[key];
                return (
                  <div key={key} className="px-5 py-4">
                    <p className="font-ui font-bold mb-3" style={{ fontSize: 16, color: accent }}>
                      {plan.titleTH}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {plan.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ background: accent }}
                          />
                          <span className="text-qgen-black-soft" style={{ fontSize: 13, lineHeight: "20px" }}>
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Share + Back ── */}
        <div className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: "380ms" }}>
          {/* IG Story share */}
          <ShareStoryButton
            persona={{ id: persona.id, name: persona.name, description: persona.description, theme: persona.theme, tagline: persona.tagline }}
            axisResult={{
              F: { roundedScore: axisResult.F.roundedScore, status: axisResult.F.status },
              C: { roundedScore: axisResult.C.roundedScore, status: axisResult.C.status },
              W: { roundedScore: axisResult.W.roundedScore, status: axisResult.W.status },
            }}
            buttonColor={personaAccent}
            fontFace={fontFace}
            logoDataUrl={logoDataUrl}
          />

          {/* Share result link */}
          <ShareLinkButton />

          {/* Back to home */}
          <Link
            href="/"
            className="w-full py-3.5 rounded-2xl border border-qgen-gray-border
              font-ui font-semibold text-qgen-black-soft text-sm text-center
              hover:bg-qgen-paper-alt active:scale-[0.98] transition-all duration-200"
          >
            กลับหน้าแรก
          </Link>
        </div>

      </div>
    </main>
  );
}
