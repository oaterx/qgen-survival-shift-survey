"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

type Phase = "demo" | "storyIntro" | "chapterIntro" | "storyContinue" | "chapterOpen" | "chapterOpen2" | "chapterOpen3" | "survey" | "ending";
type AxisId = "F" | "C" | "W";

const AXIS_LABEL: Record<AxisId, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};

const CHAPTER_META: Record<AxisId, { no: string; desc: string; story?: string[]; cta: string }> = {
  F: {
    no: "บทที่ 1",
    desc: "เราจะเริ่มที่เรื่องเงิน — แรงกดดันที่ทุกคนรู้สึกอยู่ แต่ไม่ค่อยพูดออกมา",
    story: [
      "เช้าวันใหม่...|ที่ไม่สดใสเหมือนเดิม",
      "เสียงนาฬิกาปลุกดังขึ้น คุณลุกขึ้นแต่งตัวเหมือนทุกวัน",
      "ภายนอกดูพร้อมไปทำงาน แต่ข้างในกลับรู้สึกว่างเปล่า",
    ],
    cta: "ถัดไป",
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
      setPhase("chapterOpen2");
      return;
    }
    if (nextIndex === 12) {
      setCurrentIndex(12);
      setPhase("chapterOpen3");
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
        demographics: demoAnswers,
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
      setPhase("chapterOpen");
      return;
    }
    if (currentIndex === 6) {
      setPhase("chapterOpen2");
      return;
    }
    if (currentIndex === 12) {
      setPhase("chapterOpen3");
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
    setPhase("storyIntro");
  }

  function handleChapterOpen2Back() {
    const prevPairIndex = 4;
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

  function handleChapterOpen3Back() {
    const prevPairIndex = 10;
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

            <div>
              <label className="block font-ui font-semibold text-qgen-black-soft mb-2"
                style={{ fontSize: 13 }}>
                Email
                <span className="ml-1.5 font-normal text-qgen-gray-ash" style={{ fontSize: 11 }}>(ไม่บังคับ)</span>
              </label>
              <p className="text-qgen-gray-ash mb-2" style={{ fontSize: 12 }}>
                กรอกอีเมลเพื่อรับข้อมูล ความรู้ และข่าวสารจากทาง QGEN Consultant ก่อนใคร
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={[
                  "w-full px-4 rounded-[10px] border bg-qgen-paper-alt",
                  "font-ui transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-qgen-signal/30 focus:border-qgen-signal",
                  email
                    ? "text-qgen-black-soft border-qgen-gray-ash/60"
                    : "text-qgen-gray-ash border-qgen-gray-border",
                ].join(" ")}
                style={{ height: 46, fontSize: 14 }}
              />
            </div>
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
      {
        label: "Financial Security",
        labelTH: "ความมั่นคงทางการเงิน",
        desc: "มีรายได้และเงินสำรองเพียงพอ ดูแลค่าใช้จ่ายได้โดยไม่ต้องกังวลเรื่องเงิน",
      },
      {
        label: "Career Path",
        labelTH: "ความก้าวหน้าในสายอาชีพ",
        desc: "มองเห็นโอกาสการเติบโตในสายงาน และเติบโตไปพร้อมกับองค์กรได้อย่างมั่นคง",
      },
      {
        label: "Well-being",
        labelTH: "สุขภาพและความเป็นอยู่",
        desc: "มีสุขภาพกายและใจที่ดี จัดการความเครียดและความเหนื่อยล้าได้อย่างเหมาะสม",
      },
    ];
    return (
      <div className="min-h-screen flex flex-col bg-qgen-paper">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in">
          <div>
            <div
              className="relative w-full max-w-[300px] mx-auto mb-4"
              style={{ aspectRatio: "1022 / 356" }}
            >
              <Image
                src="/Element/Heading.png"
                alt="The Office Survivor — มนุษย์ออฟฟิศต้องรอด"
                fill
                className="object-contain"
                sizes="300px"
                priority
              />
            </div>

            <p className="text-qgen-gray-ash text-center mb-6" style={{ fontSize: 14, lineHeight: "22px" }}>
              ในแบบสำรวจนี้เราจะพาคุณไปสำรวจปัญหาใน 3 ด้านหลัก ๆ ของชีวิตมนุษย์ออฟฟิศ
            </p>

            <div className="flex flex-col gap-2">
              {STORY_AXES.map((ax, i) => (
                <div
                  key={i}
                  className="w-full rounded-xl border border-qgen-gray-border bg-qgen-paper-alt"
                  style={{ padding: "12px 14px", boxShadow: "0 2px 8px rgba(10,10,10,0.04)" }}
                >
                  <p className="font-ui font-semibold text-qgen-black-soft" style={{ fontSize: 13, lineHeight: "18px" }}>
                    {ax.label} <span className="text-qgen-gray-ash font-normal">· {ax.labelTH}</span>
                  </p>
                  <p className="font-ui text-qgen-gray-ash mt-1" style={{ fontSize: 11.5, lineHeight: "17px" }}>
                    {ax.desc}
                  </p>
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
        <SignalTopBar />

        <div className={`flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in ${meta.story ? "pt-32" : ""}`}>
          <div>
            {meta.story && (
              <div className="relative w-[220px] h-[220px] mx-auto mb-5" style={{ animation: "clock-ring 0.9s ease-in-out infinite" }}>
                <Image
                  src="/Element/Clock.png"
                  alt="นาฬิกาปลุก"
                  fill
                  className="object-contain"
                  sizes="220px"
                  priority
                />
              </div>
            )}

            {!meta.story && (
              <>
                <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
                  style={{ fontSize: 11, letterSpacing: "0.18em" }}>
                  {meta.no}
                </p>
                <div
                  className="font-display text-qgen-black-soft text-center"
                  style={{ fontSize: 34, lineHeight: "40px", fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  {AXIS_LABEL[chapterIntroAxis]}
                </div>
                <div className="w-12 rounded-full mx-auto" style={{ height: 3, background: "#C96F3B", marginTop: 18, marginBottom: 18 }} />
              </>
            )}
            {meta.story && <div style={{ marginTop: 40 }} />}

            {meta.story ? (
              <div className="flex flex-col gap-3.5">
                {meta.story.map((line, i) => {
                  if (i === 0 && line.includes("|")) {
                    const [highlight, rest] = line.split("|");
                    return (
                      <p key={i} className="text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                        <span className="font-bold text-qgen-signal" style={{ fontSize: 23 }}>{highlight}</span>
                        <span className="text-qgen-black-soft">{rest}</span>
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                      {line}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-qgen-black-soft" style={{ fontSize: 15, lineHeight: "25px" }}>
                {meta.desc}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (meta.story) {
                  setPhase("storyContinue");
                  return;
                }
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

  // ── Story Continue (pre-Chapter 1 survey) ───────────────────────────────────
  if (phase === "storyContinue") {
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in pt-32">
          <div>
            <div className="relative w-[220px] h-[220px] mx-auto mb-5">
              <Image
                src="/Element/Phone.png"
                alt="โทรศัพท์แจ้งเตือน"
                fill
                className="object-contain"
                sizes="220px"
                priority
              />
            </div>

            <div style={{ marginTop: 40 }} />

            <div className="flex flex-col gap-3.5">
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                ก่อนออกจากห้อง โทรศัพท์สว่างขึ้นพร้อมแจ้งเตือนค่าใช้จ่าย
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                และคำถามในหัวก็เด้งขึ้นมาเบา ๆ ว่า
              </p>
              <p className="text-center mx-auto" style={{ fontSize: 18, lineHeight: "27px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
                <span className="font-bold text-qgen-signal">
                  &ldquo;เรากำลังใช้ชีวิตอยู่จริง ๆ หรือแค่พยายามเอาตัวเองให้รอดไปวัน ๆ&rdquo;
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setPhase("chapterOpen")}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              ถัดไป
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => {
                setChapterIntroAxis("F");
                setPhase("chapterIntro");
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Chapter Open (Chapter 1 cold-open) ──────────────────────────────────────
  if (phase === "chapterOpen") {
    const startIdx = AXIS_START_INDEX["F"];
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in pt-12">
          <div>
            <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
              style={{ fontSize: 11, letterSpacing: "0.18em" }}>
              Chapter 1
            </p>
            <div className="text-center mb-6">
              <div
                className="font-display text-qgen-black-soft"
                style={{ fontSize: 32, lineHeight: "38px", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Financial Security
              </div>
              <div
                className="font-bold text-qgen-signal"
                style={{ fontSize: 16, lineHeight: "24px", marginTop: 6 }}
              >
                เงินเดือนเข้า แต่ชีวิตเรายังหนักอึ้ง
              </div>
            </div>

            <div className="relative w-[220px] h-[220px] mx-auto mb-6">
              <Image
                src="/Element/Money.png"
                alt="เงินเดือนกับค่าใช้จ่าย"
                fill
                className="object-contain"
                sizes="220px"
                priority
              />
            </div>

            <div className="flex flex-col gap-3.5">
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                ระหว่างทางไปทำงาน คุณเปิดแอปธนาคารขึ้นมาดูแบบไม่ตั้งใจ
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                เงินเดือนเพิ่งเข้าได้ไม่นาน แต่ค่าใช้จ่ายเหมือนรออยู่ก่อนแล้ว
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                บางครั้งคุณไม่ได้อยากประหยัดทุกอย่าง
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                แต่ทุกครั้งที่ใช้เงิน คุณก็เริ่มคิดมากขึ้นเรื่อย ๆ
              </p>
            </div>
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
              เริ่ม Chapter 1
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => setPhase("storyContinue")} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Chapter Open 2 (Chapter 2 cold-open) ────────────────────────────────────
  if (phase === "chapterOpen2") {
    const startIdx = AXIS_START_INDEX["C"];
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in pt-12">
          <div>
            <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
              style={{ fontSize: 11, letterSpacing: "0.18em" }}>
              Chapter 2
            </p>
            <div className="text-center mb-6">
              <div
                className="font-display text-qgen-black-soft"
                style={{ fontSize: 32, lineHeight: "38px", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Career Path
              </div>
              <div
                className="font-bold text-qgen-signal"
                style={{ fontSize: 16, lineHeight: "24px", marginTop: 6 }}
              >
                งานที่ทำอยู่ กำลังพาเราไปไหน
              </div>
            </div>

            <div className="relative w-[220px] h-[220px] mx-auto mb-6">
              <Image
                src="/Element/Career.png"
                alt="เส้นทางอาชีพ"
                fill
                className="object-contain"
                sizes="220px"
                priority
              />
            </div>

            <div className="flex flex-col gap-3.5">
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                คุณมาถึงออฟฟิศ เปิดคอม และเข้าสู่โหมดพร้อมทำงาน
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                อีเมลค้างเต็ม Inbox ประชุมรออยู่ งานเก่ารอแก้ และงานใหม่รอเริ่ม
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                คุณไม่ได้ไม่ตั้งใจหรือไม่พยายาม แต่บางวันคุณก็เริ่มสงสัยว่า
              </p>
              <p className="text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                <span className="font-bold text-qgen-signal">
                  &ldquo;งานที่ทำอยู่กำลังพาคุณไปข้างหน้าจริงไหม&rdquo;
                </span>
              </p>
            </div>
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
              เริ่ม Chapter 2
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={handleChapterOpen2Back} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Chapter Open 3 (Chapter 3 cold-open) ────────────────────────────────────
  if (phase === "chapterOpen3") {
    const startIdx = AXIS_START_INDEX["W"];
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in pt-12">
          <div>
            <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
              style={{ fontSize: 11, letterSpacing: "0.18em" }}>
              Chapter 3
            </p>
            <div className="text-center mb-6">
              <div
                className="font-display text-qgen-black-soft"
                style={{ fontSize: 32, lineHeight: "38px", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Well Being
              </div>
              <div
                className="font-bold text-qgen-signal"
                style={{ fontSize: 16, lineHeight: "24px", marginTop: 6 }}
              >
                ร่างกายยังเดินต่อไป แต่ใจเริ่มไปต่อไม่ไหว
              </div>
            </div>

            <div className="relative w-[220px] h-[220px] mx-auto mb-6">
              <Image
                src="/Element/Health.png"
                alt="ความเหนื่อยล้าทางร่างกายและใจ"
                fill
                className="object-contain"
                sizes="220px"
                priority
              />
            </div>

            <div className="flex flex-col gap-3.5">
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                วันทำงานดำเนินไปเรื่อย ๆ ช่วงบ่ายมาถึง
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                กาแฟแก้วแรกเริ่มหมดฤทธิ์
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                ตาเริ่มล้า ไหล่เริ่มตึง คุณอาจยังทำงานได้
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                แต่ร่างกายเริ่มส่งสัญญาณเล็ก ๆ ว่า มันเหนื่อยมาสักพักแล้ว
              </p>
            </div>
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
              เริ่ม Chapter 3
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={handleChapterOpen3Back} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Ending (closing screen, no image, no email) ─────────────────────────────
  if (phase === "ending") {
    return (
      <div className="h-screen flex flex-col bg-qgen-paper overflow-hidden">
        <SignalTopBar />
        <SignalProgress value={100} />

        <div className="flex-1 flex flex-col justify-between px-5 py-8 max-w-lg mx-auto w-full animate-slide-in">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex flex-col gap-3.5">
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                หลังจากผ่านมาทั้งวัน คุณอาจยังยืนไหว ยังทำงานต่อได้
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                และยังเตรียมตัวสำหรับวันพรุ่งนี้เหมือนเดิม
              </p>
              <p className="text-qgen-black-soft text-center" style={{ fontSize: 15, lineHeight: "25px" }}>
                แต่คำถามสำคัญคือ
              </p>
              <p className="text-center" style={{ fontSize: 18, lineHeight: "27px" }}>
                <span className="font-bold text-qgen-signal">
                  วันนี้คุณกำลังใช้พลังไปกับอะไรมากที่สุด?
                </span>
              </p>
              <p className="text-qgen-black-soft text-center mt-2" style={{ fontSize: 15, lineHeight: "25px" }}>
                กดดูผลลัพธ์ แล้วมาดูกันว่า
              </p>
              <p className="text-center" style={{ fontSize: 16, lineHeight: "26px" }}>
                <span className="font-bold text-qgen-black-soft">
                  &ldquo;คุณกำลังเป็นมนุษย์ออฟฟิศประเภทไหนอยู่&rdquo;
                </span>
              </p>
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
