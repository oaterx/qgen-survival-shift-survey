"use client";

import { useState } from "react";
import ScoreRing from "../../components/survival-shift/ScoreRing";
import ScoreBar from "./ScoreBar";
import type { StatusId } from "../../data/types";

const AXIS_NAME_EN: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};
const AXIS_NAME_TH: Record<string, string> = { F: "การเงิน", C: "อาชีพ", W: "สุขภาพ" };

function scoreToColor(score: number): string {
  if (score >= 67) return "#4F9B45"; // stable — green
  if (score >= 33) return "#E1A300"; // at risk — yellow
  return "#E66A2C"; // crisis — red/orange
}

function statusEN(s: StatusId): string {
  if (s === "stable") return "Stable";
  if (s === "atRisk") return "At Risk";
  return "Crisis";
}

function levelKeyword(label: string): string {
  if (label === "Stable") return "STABLE";
  if (label === "At Risk") return "AT RISK";
  return "CRISIS";
}

interface Props {
  overallScore: number;
  level: { label: string; description: string };
  axisResult: Record<string, { roundedScore: number; status: StatusId }>;
}

export default function SurvivalScoreSection({ overallScore, level, axisResult }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl bg-qgen-paper-alt/80 border border-qgen-gray-border overflow-hidden animate-fade-up"
      style={{ animationDelay: "140ms" }}>
      <div className="px-5 py-3 border-b border-qgen-gray-border">
        <h2 className="font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-qgen-gray-ash">
          Survival Score
        </h2>
      </div>

      {/* Score ring + level */}
      <div className="px-5 py-5 flex items-center gap-5">
        <ScoreRing score={overallScore} size={110} />
        <div className="text-left flex-1 min-w-0">
          <p className="font-ui text-[20px] font-bold leading-tight text-qgen-black-absolute">
            {level.label === "Crisis" ? (
              <>Your life is in <span style={{ color: scoreToColor(overallScore) }}>{levelKeyword(level.label)}</span></>
            ) : (
              <>Your life is <span style={{ color: scoreToColor(overallScore) }}>{levelKeyword(level.label)}</span></>
            )}
          </p>
          <p className="text-[13px] text-qgen-gray-ash leading-relaxed mt-1.5">
            {level.description}
          </p>
        </div>
      </div>

      {/* Accordion toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-3 border-t border-qgen-gray-border
          font-ui text-[12px] text-qgen-gray-ash hover:text-qgen-black-soft transition-colors"
      >
        ดูคะแนนแต่ละด้าน
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M2 5l5 5 5-5" />
        </svg>
      </button>

      {/* Axis scores */}
      {open && (
        <div className="divide-y divide-qgen-gray-border/70 border-t border-qgen-gray-border">
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
      )}
    </section>
  );
}
