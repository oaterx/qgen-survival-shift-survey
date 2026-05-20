"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../../data/questions";
import { demographicFields } from "../../data/demographics";
import type { DemographicAnswers, DemographicFieldId } from "../../data/demographics";
import type { SurveyAnswer } from "../../data/types";
import { groupAnswersByAxis, calculateAxisScores } from "../../lib/scoring";
import { routePersonaId } from "../../lib/persona-router";
import QGenLogo from "../../components/QGenLogo";
import WalkingCharacter from "../../components/WalkingCharacter";

type Gender = "male" | "female" | "unspecified";

const AXIS_LABEL: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};

const AXIS_PILL: Record<string, string> = {
  F: "bg-green-100 text-green-700",
  C: "bg-blue-100 text-qgen-blue",
  W: "bg-purple-100 text-purple-700",
};

const AXIS_BAR: Record<string, string> = {
  F: "bg-green-400",
  C: "bg-qgen-blue",
  W: "bg-purple-400",
};

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white
        text-sm font-medium text-zinc-600
        hover:border-zinc-400 hover:text-qgen-dark hover:bg-zinc-50
        active:scale-[0.98] transition-all duration-150"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M9 2L4 7l5 5" />
      </svg>
      ย้อนกลับ
    </button>
  );
}

export default function SurveyClient() {
  const router = useRouter();

  // Redirect to home if user lands here via refresh or direct URL (not from Start button)
  useEffect(() => {
    const ts = Number(sessionStorage.getItem("survey_entry") ?? 0);
    if (Date.now() - ts > 10_000) {
      router.replace("/");
    }
  }, []);

  const [phase, setPhase] = useState<"gender" | "demo" | "survey">("gender");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [demoAnswers, setDemoAnswers] = useState<DemographicAnswers>({});

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const total = questions.length;
  const question = questions[currentIndex];
  const progressPct = (currentIndex / total) * 100;

  // All required fields must have a value before demo can advance
  const requiredFields = demographicFields.filter((f) => f.required);
  const demoCanAdvance = requiredFields.every((f) => !!demoAnswers[f.id]);

  function handleDemoChange(id: DemographicFieldId, value: string) {
    setDemoAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSelect(value: 1 | 2 | 3 | 4) {
    const answer: SurveyAnswer = {
      questionId: question.id,
      axis: question.axis,
      value,
    };
    const newAnswers = [...answers, answer];

    if (currentIndex < total - 1) {
      setDirection("forward");
      setAnswers(newAnswers);
      setCurrentIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    const grouped = groupAnswersByAxis(newAnswers);
    const scores = calculateAxisScores(grouped);
    const personaId = routePersonaId(scores);

    fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        f: Math.round(scores.F),
        c: Math.round(scores.C),
        w: Math.round(scores.W),
        personaId,
        demographics: { ...demoAnswers, gender },
        answers: newAnswers,
      }),
    }).catch(() => {});

    router.push(
      `/result?f=${scores.F.toFixed(4)}&c=${scores.C.toFixed(4)}&w=${scores.W.toFixed(4)}`
    );
  }

  function handleSurveyBack() {
    if (currentIndex === 0) {
      setPhase("demo");
      return;
    }
    setDirection("back");
    setAnswers((a) => a.slice(0, -1));
    setCurrentIndex((i) => i - 1);
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
          <div className="absolute inset-0 rounded-full border-4 border-qgen-blue border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-zinc-400 font-light tracking-wide">กำลังคำนวณผลลัพธ์…</p>
      </div>
    );
  }

  // ── Gender selection ───────────────────────────────────────────────────────
  if (phase === "gender") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center px-5 py-4">
          <QGenLogo height={36} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10 max-w-lg mx-auto w-full animate-fade-up">
          <h2 className="text-xl font-bold text-qgen-dark mb-1 text-center">
            เลือกตัวละครของคุณ
          </h2>
          <p className="text-xs font-light text-zinc-400 mb-10 text-center">
            ตัวละครจะเดินตามคุณตลอดการทำแบบสำรวจ
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <button
              onClick={() => { setGender("male"); setPhase("demo"); }}
              className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl border-2 border-zinc-100
                hover:border-qgen-dark hover:bg-zinc-50 active:scale-[0.97] transition-all duration-200"
            >
              <div className="flex items-end justify-center h-20">
                <WalkingCharacter gender="male" width={46} />
              </div>
              <span className="text-sm font-semibold text-qgen-dark">ชาย</span>
            </button>

            <button
              onClick={() => { setGender("female"); setPhase("demo"); }}
              className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl border-2 border-zinc-100
                hover:border-qgen-dark hover:bg-zinc-50 active:scale-[0.97] transition-all duration-200"
            >
              <div className="flex items-end justify-center h-20">
                <WalkingCharacter gender="female" width={46} />
              </div>
              <span className="text-sm font-semibold text-qgen-dark">หญิง</span>
            </button>
          </div>

          <button
            onClick={() => { setGender("unspecified"); setPhase("demo"); }}
            className="mt-6 text-sm font-light text-zinc-300 hover:text-zinc-500 transition-colors duration-150"
          >
            ไม่ระบุเพศ / ข้าม
          </button>
        </div>
      </div>
    );
  }

  // ── Demographic — single page, all dropdowns ───────────────────────────────
  if (phase === "demo") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <QGenLogo height={36} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10 max-w-lg mx-auto w-full animate-slide-in">
          {/* Notice */}
          <div className="mb-6 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100">
            <p className="text-xs font-light text-zinc-400 leading-relaxed">
              ข้อมูลนี้ใช้เพื่อดูภาพรวมเชิงสถิติเท่านั้น และไม่มีผลต่อผลลัพธ์ Persona ของคุณ
            </p>
          </div>

          {/* All fields */}
          <div className="flex flex-col gap-6">
            {demographicFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-qgen-dark mb-1">
                  {field.label}
                  {field.required
                    ? <span className="ml-1 text-qgen-blue">*</span>
                    : <span className="ml-1.5 text-xs font-normal text-zinc-400">(ไม่บังคับ)</span>
                  }
                </label>
                {field.helperText && (
                  <p className="text-xs font-light text-zinc-400 mb-2">{field.helperText}</p>
                )}
                <div className="relative">
                  <select
                    value={demoAnswers[field.id] ?? ""}
                    onChange={(e) => handleDemoChange(field.id, e.target.value)}
                    className={[
                      "w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border bg-white",
                      "text-sm font-light cursor-pointer",
                      "focus:outline-none focus:ring-1 focus:ring-qgen-dark focus:border-qgen-dark",
                      "transition-colors duration-150",
                      demoAnswers[field.id]
                        ? "text-zinc-800 border-zinc-300"
                        : "text-zinc-400 border-zinc-200",
                    ].join(" ")}
                  >
                    <option value="" disabled>เลือก...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron */}
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => setPhase("survey")}
              disabled={!demoCanAdvance}
              className="w-full py-4 rounded-2xl bg-qgen-dark text-white font-semibold text-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                hover:bg-qgen-blue hover:shadow-lg hover:shadow-qgen-blue/20
                active:scale-[0.98] transition-all duration-300"
            >
              เริ่มทำแบบสำรวจ
            </button>

            <div className="flex justify-start">
              <BackButton onClick={() => setPhase("gender")} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main survey ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-4">
        <QGenLogo height={36} />
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-qgen-dark tabular-nums">{currentIndex + 1}</span>
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-sm text-zinc-300 tabular-nums">{total}</span>
        </div>
      </div>

      <div
        key={`q-${currentIndex}-${direction}`}
        className="flex-1 flex flex-col px-5 pt-5 pb-36 max-w-lg mx-auto w-full animate-slide-in"
      >
        <div className="mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${AXIS_PILL[question.axis]}`}>
            <span className="font-black">{question.axis}</span>
            <span>·</span>
            <span>{AXIS_LABEL[question.axis]}</span>
          </span>
        </div>

        <h2 className="text-[1.25rem] font-bold text-qgen-dark leading-snug mb-8">
          {question.question}
        </h2>

        <div className="flex flex-col gap-2.5">
          {question.options.map((opt) => {
            const style: Record<string, { btn: string; pill: string }> = {
              A: {
                btn:  "border-zinc-150 hover:border-green-300  hover:bg-green-50/60  hover:shadow-green-100",
                pill: "text-green-600  bg-green-100",
              },
              B: {
                btn:  "border-zinc-150 hover:border-yellow-300 hover:bg-yellow-50/60 hover:shadow-yellow-100",
                pill: "text-yellow-600 bg-yellow-100",
              },
              C: {
                btn:  "border-zinc-150 hover:border-orange-300 hover:bg-orange-50/60 hover:shadow-orange-100",
                pill: "text-orange-600 bg-orange-100",
              },
              D: {
                btn:  "border-zinc-150 hover:border-red-300    hover:bg-red-50/60    hover:shadow-red-100",
                pill: "text-red-600    bg-red-100",
              },
            };
            const s = style[opt.label] ?? { btn: "border-zinc-150 hover:border-zinc-300 hover:bg-zinc-50", pill: "text-zinc-500 bg-zinc-100" };
            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.value as 1 | 2 | 3 | 4)}
                className={`group w-full text-left px-4 py-4 rounded-xl border bg-white
                  hover:-translate-y-0.5 hover:shadow-sm
                  active:scale-[0.99] active:translate-y-0 transition-all duration-150 ease-out
                  flex items-start gap-3 ${s.btn}`}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black ${s.pill}`}>
                  {opt.label}
                </span>
                <span className="text-zinc-700 text-sm font-light leading-snug mt-[5px]">{opt.text}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <BackButton onClick={handleSurveyBack} />
        </div>
      </div>

      {/* Fixed bottom progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-zinc-200 px-5 pt-5 pb-8 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="relative w-full h-2 bg-zinc-100 rounded-full overflow-visible max-w-lg mx-auto">
          <div
            className={`h-full rounded-full ${AXIS_BAR[question.axis]} transition-all duration-500 ease-out`}
            style={{ width: `${progressPct}%` }}
          />
          <div
            className="absolute bottom-full transition-all duration-500 ease-out"
            style={{ left: `${progressPct}%`, transform: "translateX(-50%) translateY(4px)" }}
          >
            <WalkingCharacter gender={gender} width={26} />
          </div>
        </div>
      </div>
    </div>
  );
}
