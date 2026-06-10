"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../../data/questions";
import { demographicFields } from "../../data/demographics";
import type { DemographicAnswers, DemographicFieldId } from "../../data/demographics";
import type { SurveyAnswer } from "../../data/types";
import { groupAnswersByAxis, calculateAxisScores } from "../../lib/scoring";
import { routePersonaId } from "../../lib/persona-router";
import SignalTopBar from "../../components/survival-shift/SignalTopBar";
import SignalProgress from "../../components/survival-shift/SignalProgress";
import SignalLine from "../../components/survival-shift/SignalLine";
import OptionCard from "../../components/survival-shift/OptionCard";

type Gender = "unspecified";
type Phase = "demo" | "storyIntro" | "chapterIntro" | "survey" | "ending";
type AxisId = "F" | "C" | "W";

const AXIS_LABEL: Record<AxisId, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};

const CHAPTER_META: Record<AxisId, { no: string; desc: string; cta: string }> = {
  F: {
    no: "บทที่ 1",
    desc: "เราจะเริ่มที่เรื่องเงิน — แรงกดดันที่ทุกคนรู้สึกอยู่ แต่ไม่ค่อยพูดออกมา",
    cta: "เริ่มบทที่ 1",
  },
  C: {
    no: "บทที่ 2",
    desc: "ถัดไปคือเรื่องงาน — เส้นทาง ความผูกพัน และคำถามที่คุณอาจหลีกเลี่ยงมานาน",
    cta: "เริ่มบทที่ 2",
  },
  W: {
    no: "บทที่ 3",
    desc: "บทสุดท้ายคือร่างกายและจิตใจ — สิ่งที่มักถูกเสียสละเป็นอันดับแรกเสมอ",
    cta: "เริ่มบทที่ 3",
  },
};

const AXIS_START_INDEX: Record<AxisId, number> = { F: 0, C: 6, W: 12 };

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 font-ui text-qgen-gray-ash
        hover:text-qgen-black-soft transition-colors duration-150"
      style={{ fontSize: 13 }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2L4 7l5 5" />
      </svg>
      ย้อนกลับ
    </button>
  );
}

export default function SurveyClient() {
  const router = useRouter();
  const q2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ts = Number(sessionStorage.getItem("survey_entry") ?? 0);
    if (Date.now() - ts > 10_000) router.replace("/");
  }, []);

  const [phase, setPhase] = useState<Phase>("demo");
  const [chapterIntroAxis, setChapterIntroAxis] = useState<AxisId>("F");
  const gender: Gender = "unspecified";
  const [demoAnswers, setDemoAnswers] = useState<DemographicAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentIndex]);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [pageSelections, setPageSelections] = useState<Record<string, 1 | 2 | 3 | 4>>({});
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [email, setEmail] = useState("");

  const total = questions.length;
  const q1 = questions[currentIndex];
  const q2 = questions[currentIndex + 1];
  const progressPct = (currentIndex / total) * 100;
  const bothAnswered =
    q1 && q2 &&
    pageSelections[q1.id] !== undefined &&
    pageSelections[q2.id] !== undefined;

  const requiredFields = demographicFields.filter((f) => f.required);
  const demoCanAdvance = requiredFields.every((f) => !!demoAnswers[f.id]);

  function handleDemoChange(id: DemographicFieldId, value: string) {
    setDemoAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSelect(questionId: string, value: 1 | 2 | 3 | 4) {
    setPageSelections((prev) => {
      const wasUnanswered = prev[questionId] === undefined;
      if (q1 && questionId === q1.id && wasUnanswered) {
        setTimeout(() => q2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
      return { ...prev, [questionId]: value };
    });
  }

  function handleNext() {
    const a1: SurveyAnswer = { questionId: q1.id, axis: q1.axis, value: pageSelections[q1.id]! };
    const a2: SurveyAnswer = { questionId: q2.id, axis: q2.axis, value: pageSelections[q2.id]! };
    const newAnswers = [...answers, a1, a2];
    setAnswers(newAnswers);
    setPageSelections({});
    const nextIndex = currentIndex + 2;

    if (nextIndex === 6) {
      setCurrentIndex(6);
      setChapterIntroAxis("C");
      setPhase("chapterIntro");
      return;
    }
    if (nextIndex === 12) {
      setCurrentIndex(12);
      setChapterIntroAxis("W");
      setPhase("chapterIntro");
      return;
    }
    if (nextIndex >= total) {
      setPhase("ending");
      return;
    }
    setDirection("forward");
    setCurrentIndex(nextIndex);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const grouped = groupAnswersByAxis(answers);
    const scores = calculateAxisScores(grouped);
    const personaId = routePersonaId(scores);

    fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        f: Math.round(scores.F), c: Math.round(scores.C), w: Math.round(scores.W),
        personaId,
        demographics: { ...demoAnswers, gender },
        answers,
        email: email.trim() || undefined,
      }),
    }).catch(() => {});

    await new Promise((r) => setTimeout(r, 2000));
    router.push(`/result?f=${scores.F.toFixed(4)}&c=${scores.C.toFixed(4)}&w=${scores.W.toFixed(4)}`);
  }

  function handleSurveyBack() {
    setPageSelections({});

    if (currentIndex === 0) {
      setPhase("chapterIntro");
      setChapterIntroAxis("F");
      return;
    }
    if (currentIndex === 6) {
      setPhase("chapterIntro");
      setChapterIntroAxis("C");
      return;
    }
    if (currentIndex === 12) {
      setPhase("chapterIntro");
      setChapterIntroAxis("W");
      return;
    }

    const prevPairIndex = currentIndex - 2;
    const pq1 = questions[prevPairIndex];
    const pq2 = questions[prevPairIndex + 1];
    const last2 = answers.slice(-2);
    setPageSelections({
      [pq1.id]: last2[0].value as 1 | 2 | 3 | 4,
      [pq2.id]: last2[1].value as 1 | 2 | 3 | 4,
    });
    setAnswers((a) => a.slice(0, -2));
    setCurrentIndex(prevPairIndex);
    setDirection("back");
  }

  function handleChapterIntroBack() {
    if (chapterIntroAxis === "F") {
      setPhase("storyIntro");
      return;
    }
    const prevPairIndex = chapterIntroAxis === "C" ? 4 : 10;
    const pq1 = questions[prevPairIndex];
    const pq2 = questions[prevPairIndex + 1];
    const last2 = answers.slice(-2);
    setPageSelections({
      [pq1.id]: last2[0].value as 1 | 2 | 3 | 4,
      [pq2.id]: last2[1].value as 1 | 2 | 3 | 4,
    });
    setAnswers((a) => a.slice(0, -2));
    setCurrentIndex(prevPairIndex);
    setPhase("survey");
    setDirection("back");
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-8 bg-qgen-paper">
        <p className="font-ui font-medium text-qgen-black-soft" style={{ fontSize: 15 }}>
          กำลังวิเคราะห์…
        </p>
        <div
          className="rounded-full overflow-hidden bg-qgen-paper-wash"
          style={{ width: 200, height: 6 }}
        >
          <div
            className="h-full rounded-full bg-qgen-signal"
            style={{ animation: "loading-bar 2s ease-out forwards" }}
          />
        </div>
      </div>
    );
  }

  // ── Demographics ───────────────────────────────────────────────────────────
  if (phase === "demo") {
    return (
      <div className="h-screen flex flex-col bg-qgen-paper">
        <SignalTopBar rightLabel="Demographic" />

        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-16 max-w-lg mx-auto w-full animate-slide-in">
          <div className="text-center mb-2">
            <h1 className="font-display font-bold text-qgen-black-absolute"
              style={{ fontSize: 26, lineHeight: "34px", letterSpacing: "-0.01em" }}>
              ข้อมูลพื้นฐาน
            </h1>
          </div>

          <p className="text-center text-qgen-gray-ash mb-8"
            style={{ fontSize: 13, lineHeight: "20px" }}>
            ข้อมูลนี้ใช้เพื่อดูภาพรวมเชิงสถิติเท่านั้น และไม่มีผลต่อผลลัพธ์ Persona ของคุณ
          </p>

          <div className="flex flex-col gap-6">
            {demographicFields.map((field) => (
              <div key={field.id}>
                <label className="block font-ui font-semibold text-qgen-black-soft mb-2"
                  style={{ fontSize: 13 }}>
                  {field.label}
                  {field.required
                    ? <span className="ml-1 text-qgen-signal">*</span>
                    : <span className="ml-1.5 font-normal text-qgen-gray-ash" style={{ fontSize: 11 }}>(ไม่บังคับ)</span>
                  }
                </label>
                {field.helperText && (
                  <p className="text-qgen-gray-ash mb-2" style={{ fontSize: 12 }}>{field.helperText}</p>
                )}
                <div className="relative">
                  <select
                    value={demoAnswers[field.id] ?? ""}
                    onChange={(e) => handleDemoChange(field.id, e.target.value)}
                    className={[
                      "w-full appearance-none px-4 pr-10 rounded-[10px] border bg-qgen-paper-alt",
                      "font-ui cursor-pointer transition-colors duration-150",
                      "focus:outline-none focus:ring-2 focus:ring-qgen-signal/30 focus:border-qgen-signal",
                      demoAnswers[field.id]
                        ? "text-qgen-black-soft border-qgen-gray-ash/60"
                        : "text-qgen-gray-ash border-qgen-gray-border",
                    ].join(" ")}
                    style={{ height: 46, fontSize: 14 }}
                  >
                    <option value="" disabled>เลือก...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-qgen-gray-ash">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 5l4 4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={() => setPhase("storyIntro")}
              disabled={!demoCanAdvance}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              ถัดไป
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => router.push("/")} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Story Intro ────────────────────────────────────────────────────────────
  if (phase === "storyIntro") {
    const STORY_AXES = [
      { label: "Financial\nSecurity" },
      { label: "Career Path" },
      { label: "Well-being" },
    ];
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in">
          <div>
            <div
              className="mb-6 font-display text-qgen-black-soft text-center whitespace-nowrap"
              style={{ fontSize: "clamp(28px, 8vw, 40px)", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              The Survival Shift
            </div>

            <p className="text-qgen-black-soft mb-3" style={{ fontSize: 15, lineHeight: "24px" }}>
              ในยุคที่ค่าครองชีพสูงขึ้นทุกปี แต่รายได้ไม่ตาม — พนักงานหลายคนกำลังเอาตัวรอดอยู่อย่างเงียบ ๆ
            </p>
            <p className="text-qgen-gray-ash mb-6" style={{ fontSize: 14, lineHeight: "22px" }}>
              แบบสำรวจนี้จะพาคุณผ่าน 3 บท เพื่อช่วยให้คุณเห็นว่าตอนนี้ชีวิตของคุณอยู่ที่จุดไหน
            </p>

            <div className="flex gap-3">
              {STORY_AXES.map((ax, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center rounded-xl border border-qgen-gray-border bg-qgen-paper-alt"
                  style={{ padding: "12px 8px", boxShadow: "0 2px 8px rgba(10,10,10,0.04)" }}
                >
                  <span
                    className="font-ui font-semibold text-qgen-black-soft text-center whitespace-pre-line"
                    style={{ fontSize: 13, lineHeight: "18px" }}
                  >
                    {ax.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setChapterIntroAxis("F");
                setPhase("chapterIntro");
              }}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              เริ่มเลย
              <svg className="inline ml-2 -mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h9M8 3l5 5-5 5" />
              </svg>
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => setPhase("demo")} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Chapter Intro ──────────────────────────────────────────────────────────
  if (phase === "chapterIntro") {
    const meta = CHAPTER_META[chapterIntroAxis];
    const startIdx = AXIS_START_INDEX[chapterIntroAxis];

    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar rightLabel={AXIS_LABEL[chapterIntroAxis]} />
        <SignalProgress value={(startIdx / total) * 100} />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in">
          <div>
            <p className="font-ui font-semibold text-qgen-signal uppercase mb-3"
              style={{ fontSize: 11, letterSpacing: "0.18em" }}>
              {meta.no}
            </p>
            <div
              className="font-display text-qgen-black-soft"
              style={{ fontSize: 34, lineHeight: "40px", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              {AXIS_LABEL[chapterIntroAxis]}
            </div>

            <div className="w-12 rounded-full" style={{ height: 3, background: "#C96F3B", marginTop: 18, marginBottom: 18 }} />

            <p className="text-qgen-black-soft" style={{ fontSize: 15, lineHeight: "25px" }}>
              {meta.desc}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setCurrentIndex(startIdx);
                setDirection("forward");
                setPhase("survey");
              }}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              {meta.cta}
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={handleChapterIntroBack} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Ending + Email ─────────────────────────────────────────────────────────
  if (phase === "ending") {
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />
        <SignalProgress value={100} />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in">
          <div>
            <div
              className="font-display text-qgen-black-soft mb-5 text-center"
              style={{ fontSize: 26, lineHeight: "34px", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              คุณตอบคำถามครบแล้ว
            </div>

            <p className="text-qgen-black-soft mb-6 text-center" style={{ fontSize: 16, lineHeight: "26px" }}>
              กำลังวิเคราะห์คำตอบทั้ง 3 แกนของคุณ
            </p>

            <div className="rounded-[14px] bg-qgen-paper-alt border border-qgen-gray-border p-5">
              <p className="font-ui font-semibold text-qgen-black-soft mb-1" style={{ fontSize: 13 }}>
                Your Email
              </p>
              <p className="text-qgen-gray-ash mb-3" style={{ fontSize: 12, lineHeight: "18px" }}>
                กรอกอีเมลเพื่อรับข้อมูล ความรู้ และข่าวสารจากทาง QGEN Consultant ก่อนใคร
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 rounded-[10px] border bg-qgen-paper font-ui
                  focus:outline-none focus:ring-2 focus:ring-qgen-signal/30 focus:border-qgen-signal
                  text-qgen-black-soft border-qgen-gray-border placeholder:text-qgen-gray-ash/60
                  transition-colors duration-150"
                style={{ height: 44, fontSize: 14 }}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              ดูผลลัพธ์ของฉัน
              <svg className="inline ml-2 -mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h9M8 3l5 5-5 5" />
              </svg>
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => {
                const pq1 = questions[16];
                const pq2 = questions[17];
                const last2 = answers.slice(-2);
                setPageSelections({
                  [pq1.id]: last2[0].value as 1 | 2 | 3 | 4,
                  [pq2.id]: last2[1].value as 1 | 2 | 3 | 4,
                });
                setAnswers((a) => a.slice(0, -2));
                setCurrentIndex(16);
                setPhase("survey");
                setDirection("back");
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Survey ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-qgen-paper">

      {/* Sticky header: TopBar + thin progress */}
      <div className="sticky top-0 z-10 bg-qgen-paper">
        <SignalTopBar
          current={currentIndex + 1}
          currentEnd={currentIndex + 2}
          total={total}
        />
        <SignalProgress value={progressPct} />
      </div>

      {/* Content: 2 questions */}
      <div
        key={`pair-${currentIndex}-${direction}`}
        className="flex-1 flex flex-col px-5 pt-6 pb-40 max-w-lg mx-auto w-full animate-slide-in"
      >
        {/* Axis label — centered, display font */}
        <p className="text-center font-display font-bold text-qgen-black-soft uppercase mb-6"
          style={{ fontSize: 15, letterSpacing: "0.14em" }}>
          {AXIS_LABEL[q1.axis as AxisId]}
        </p>

        {/* Question 1 */}
        <div className="mb-8">
          <p className="font-ui text-qgen-gray-ash mb-2"
            style={{ fontSize: 11, letterSpacing: "0.06em" }}>
            ข้อที่ {currentIndex + 1}
          </p>
          <h2 className="text-qgen-black-soft font-semibold mb-3"
            style={{ fontSize: 17, lineHeight: "26px" }}>
            {q1.question}
          </h2>
          <div className="flex flex-col gap-2">
            {q1.options.map((opt) => (
              <OptionCard
                key={opt.label}
                label={opt.label}
                text={opt.text}
                selected={pageSelections[q1.id] === opt.value}
                onSelect={() => handleSelect(q1.id, opt.value as 1 | 2 | 3 | 4)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-qgen-gray-border/40 mb-8" />

        {/* Question 2 */}
        <div ref={q2Ref} className="mb-6">
          <p className="font-ui text-qgen-gray-ash mb-2"
            style={{ fontSize: 11, letterSpacing: "0.06em" }}>
            ข้อที่ {currentIndex + 2}
          </p>
          <h2 className="text-qgen-black-soft font-semibold mb-3"
            style={{ fontSize: 17, lineHeight: "26px" }}>
            {q2.question}
          </h2>
          <div className="flex flex-col gap-2">
            {q2.options.map((opt) => (
              <OptionCard
                key={opt.label}
                label={opt.label}
                text={opt.text}
                selected={pageSelections[q2.id] === opt.value}
                onSelect={() => handleSelect(q2.id, opt.value as 1 | 2 | 3 | 4)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-start">
          <BackButton onClick={handleSurveyBack} />
        </div>
      </div>

      {/* Fixed bottom: ถัดไป button */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
        style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleNext}
            disabled={!bothAnswered}
            className="w-full font-ui font-bold text-white rounded-[12px]
              bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
              hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
            style={{ height: 48, fontSize: 15 }}
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
