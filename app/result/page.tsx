import { notFound } from "next/navigation";
import Link from "next/link";
import { routePersona } from "../../lib/persona-router";
import { getAxisResult } from "../../lib/scoring";
import { STATUS_LABELS } from "../../lib/status";
import QGenLogo from "../../components/QGenLogo";
import ScoreBar from "./ScoreBar";
import ShareButton from "./ShareButton";
import ShareStoryButton from "./ShareStoryButton";

const AXIS_NAME_TH: Record<string, string> = { F: "การเงิน", C: "อาชีพ", W: "สุขภาพ" };
const AXIS_NAME_EN: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};

const THEME_ACCENT: Record<string, string> = {
  green:  "border-l-[3px] border-green-400",
  orange: "border-l-[3px] border-orange-400",
  red:    "border-l-[3px] border-red-400",
  purple: "border-l-[3px] border-purple-400",
};

const THEME_TAG: Record<string, string> = {
  green:  "text-green-700  bg-green-50",
  orange: "text-orange-700 bg-orange-50",
  red:    "text-red-700    bg-red-50",
  purple: "text-purple-700 bg-purple-50",
};

const STATUS_BADGE: Record<string, string> = {
  stable: "text-green-700  bg-green-50  border border-green-200",
  atRisk: "text-orange-700 bg-orange-50 border border-orange-200",
  crisis: "text-red-700    bg-red-50    border border-red-200",
};

const PERIOD_STYLE = [
  {
    key:        "30days",
    num:        "30",
    unit:       "วัน",
    sub:        "Quick Win",
    topBorder:  "border-t-[3px] border-qgen-blue",
    headerBg:   "bg-blue-50/60",
    badge:      "bg-qgen-blue text-white",
    bulletBg:   "bg-blue-100",
    bulletText: "text-qgen-blue",
  },
  {
    key:        "90days",
    num:        "90",
    unit:       "วัน",
    sub:        "Build Momentum",
    topBorder:  "border-t-[3px] border-qgen-gold",
    headerBg:   "bg-amber-50/60",
    badge:      "bg-qgen-gold text-qgen-dark",
    bulletBg:   "bg-amber-100",
    bulletText: "text-amber-600",
  },
  {
    key:        "365days",
    num:        "365",
    unit:       "วัน",
    sub:        "Shift",
    topBorder:  "border-t-[3px] border-qgen-dark",
    headerBg:   "bg-slate-50",
    badge:      "bg-qgen-dark text-white",
    bulletBg:   "bg-slate-100",
    bulletText: "text-slate-500",
  },
] as const;

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

  return (
    <main className="min-h-screen bg-white pb-16">

      {/* Header */}
      <header
        className="flex justify-center py-5 border-b border-zinc-100 animate-fade-in"
        style={{ animationDelay: "0ms" }}
      >
        <QGenLogo height={40} />
      </header>

      <div className="px-5 pt-7 max-w-lg mx-auto flex flex-col gap-5">

        {/* ── Persona card ── */}
        <div
          className={`rounded-2xl bg-white border border-zinc-100 overflow-hidden animate-fade-up ${THEME_ACCENT[persona.theme]}`}
          style={{ animationDelay: "80ms" }}
        >
          <div className="px-5 pt-5 pb-6 flex flex-col items-center text-center">
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${THEME_TAG[persona.theme]}`}>
              Persona #{persona.id}
            </span>
            <h1 className="text-2xl font-extrabold text-qgen-dark leading-tight mb-3">
              {persona.name}
            </h1>
            <p className="text-sm font-light text-zinc-500 leading-relaxed">
              {persona.description}
            </p>
          </div>
        </div>

        {/* ── Axis scores ── */}
        <section
          className="rounded-2xl border border-zinc-100 bg-white overflow-hidden animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="px-5 py-3 border-b border-zinc-100">
            <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400">
              Axis Scores
            </h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {(["F", "C", "W"] as const).map((axis, i) => {
              const r = axisResult[axis];
              return (
                <div key={axis} className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-qgen-dark">
                        {AXIS_NAME_TH[axis]}
                      </span>
                      <span className="text-xs font-light text-zinc-400 mt-0.5">
                        {AXIS_NAME_EN[axis]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-black text-qgen-dark tabular-nums">
                        {r.roundedScore}
                        <span className="text-xs font-light text-zinc-400 ml-0.5">%</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABELS[r.status].label}
                      </span>
                    </div>
                  </div>
                  <ScoreBar score={r.roundedScore} status={r.status} delay={i * 120} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Action plan ── */}
        <section
          className="animate-fade-up"
          style={{ animationDelay: "280ms" }}
        >
          <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-zinc-400 px-1 mb-3">
            Action Plan
          </h2>
          <div className="flex flex-col gap-3">
            {PERIOD_STYLE.map(({ key, num, unit, sub, topBorder, headerBg, badge, bulletBg, bulletText }) => {
              const plan = persona.actionPlan[key];
              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm ${topBorder}`}
                >
                  {/* Period header */}
                  <div className={`flex items-center justify-between px-5 py-4 ${headerBg} border-b border-zinc-100/80`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[2rem] font-black text-qgen-dark leading-none tracking-tight">
                        {num}
                      </span>
                      <span className="text-sm font-light text-zinc-400 leading-none">{unit}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide ${badge}`}>
                      {sub}
                    </span>
                  </div>

                  {/* Action items */}
                  <ul className="px-5 pt-4 pb-5 flex flex-col gap-4">
                    {plan.actions.map((action, i) => (
                      <li key={i} className="flex gap-3.5 items-start">
                        {/* Numbered bullet */}
                        <span className={`flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center mt-[1px] ${bulletBg}`}>
                          <span className={`text-[10px] font-black ${bulletText}`}>{i + 1}</span>
                        </span>
                        <span className="text-[13.5px] text-zinc-600 font-light leading-relaxed flex-1">
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

        {/* ── Share + back ── */}
        <div
          className="flex flex-col gap-3 pt-1 animate-fade-up"
          style={{ animationDelay: "360ms" }}
        >
          <ShareStoryButton
            persona={{ id: persona.id, name: persona.name, description: persona.description, theme: persona.theme }}
            axisResult={{
              F: { roundedScore: axisResult.F.roundedScore, status: axisResult.F.status },
              C: { roundedScore: axisResult.C.roundedScore, status: axisResult.C.status },
              W: { roundedScore: axisResult.W.roundedScore, status: axisResult.W.status },
            }}
          />
          <ShareButton />
          <Link
            href="/"
            className="block w-full py-3 rounded-2xl border border-zinc-200 text-center text-sm font-light text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-all duration-200"
          >
            กลับหน้าแรก
          </Link>
        </div>

      </div>
    </main>
  );
}
