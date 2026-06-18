"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { questions } from "../../data/questions";
import { demographicFields } from "../../data/demographics";
import type { DemographicAnswers, DemographicFieldId } from "../../data/demographics";
import type { SurveyAnswer } from "../../data/types";
import { groupAnswersByAxis, calculateAxisScores } from "../../lib/scoring";
import { routePersonaId } from "../../lib/persona-router";
import { encodeScoreToken } from "../../lib/share-token";
import SignalTopBar from "../../components/survival-shift/SignalTopBar";
import SignalProgress from "../../components/survival-shift/SignalProgress";
import SignalLine from "../../components/survival-shift/SignalLine";
import OptionCard from "../../components/survival-shift/OptionCard";
import Dropdown from "../../components/survival-shift/Dropdown";

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

function WrapSafeText({ text }: { text: string }) {
  // "|" marks a manually-chosen safe break point inside a long unspaced
  // Thai run. Chromium ignores word-break: keep-all for Thai script and
  // will break anywhere, so each chunk is forced nowrap and only the
  // space/"|" boundaries are left as actual break opportunities. A <wbr>
  // is inserted between adjacent chunks so WebKit/Safari (which won't break
  // between two touching nowrap spans on its own) still has a real wrap
  // opportunity there — without it long piped runs overflow the right edge.
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const chunks = word.split("|");
        return (
          <span key={wi}>
            {chunks.map((chunk, ci) => (
              <span key={ci}>
                {ci > 0 ? <wbr /> : null}
                <span style={{ whiteSpace: "nowrap" }}>{chunk}</span>
              </span>
            ))}
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  children,
  align = "start",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  align?: "start" | "center";
}) {
  return (
    <label className={`flex gap-2.5 cursor-pointer select-none ${align === "center" ? "items-center" : "items-start"}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 flex items-center justify-center rounded-[5px] border transition-colors duration-150
          ${align === "center" ? "" : "mt-0.5"}
          ${checked ? "bg-qgen-signal border-qgen-signal" : "bg-qgen-paper border-qgen-gray-ash/60"}`}
        style={{ width: 20, height: 20 }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7.5l3.5 3.5L12 3" />
          </svg>
        )}
      </button>
      <span className="text-qgen-black-soft" style={{ fontSize: 12.5, lineHeight: "18px" }}>
        {children}
      </span>
    </label>
  );
}

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

// Persist in-progress survey to sessionStorage so a refresh / app-switch
// resumes where the user left off. Cleared on submit. sessionStorage (not
// localStorage) so a fresh browser session / closed tab starts over.
const PROGRESS_KEY = "survey_progress";

type SavedProgress = {
  phase: Phase;
  chapterIntroAxis: AxisId;
  demoAnswers: DemographicAnswers;
  currentIndex: number;
  answers: SurveyAnswer[];
  pageSelections: Record<string, 1 | 2 | 3 | 4>;
  email: string;
  consentAccepted: boolean;
  marketingConsent: boolean;
};

function loadProgress(): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

export default function SurveyClient() {
  const router = useRouter();
  const q2Ref = useRef<HTMLDivElement>(null);
  const incomeRef = useRef<HTMLDivElement>(null);

  // Saved progress is restored AFTER mount (in the effect below), never during
  // render — reading sessionStorage at render time makes the client's first
  // paint differ from the server's (which always renders the defaults) and
  // triggers a hydration mismatch. We render nothing until `hydrated`, so the
  // server and client first render agree, then restore + reveal the real UI.
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("storyIntro");
  const [chapterIntroAxis, setChapterIntroAxis] = useState<AxisId>("F");
  const [demoAnswers, setDemoAnswers] = useState<DemographicAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [pageSelections, setPageSelections] = useState<Record<string, 1 | 2 | 3 | 4>>({});
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false); // required — gates submit
  const [marketingConsent, setMarketingConsent] = useState(false); // optional — gates email send

  useEffect(() => {
    // Allow entry if the user just came from Start (within 10s) OR has saved
    // progress to resume; otherwise bounce direct/stale visits to the landing.
    const saved = loadProgress();
    const ts = Number(sessionStorage.getItem("survey_entry") ?? 0);
    const fresh = Date.now() - ts <= 10_000;
    if (!fresh && !saved) {
      router.replace("/");
      return;
    }
    if (saved) {
      setPhase(saved.phase);
      setChapterIntroAxis(saved.chapterIntroAxis);
      setDemoAnswers(saved.demoAnswers);
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
      setPageSelections(saved.pageSelections);
      setEmail(saved.email);
      setConsentAccepted(saved.consentAccepted);
      setMarketingConsent(saved.marketingConsent);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentIndex]);

  // Lock body scroll on non-scrollable phases; reset position on every phase change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const locked = phase !== "demo" && phase !== "survey";
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Save progress whenever any persisted field changes — but only after the
  // restore effect has run, so we never overwrite saved progress with the
  // defaults during the first mount.
  useEffect(() => {
    if (!hydrated) return;
    const data: SavedProgress = {
      phase, chapterIntroAxis, demoAnswers, currentIndex,
      answers, pageSelections, email, consentAccepted, marketingConsent,
    };
    try {
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch {
      // storage full / unavailable — non-fatal, just no resume
    }
  }, [hydrated, phase, chapterIntroAxis, demoAnswers, currentIndex, answers, pageSelections, email, consentAccepted, marketingConsent]);

  const total = questions.length;
  const q1 = questions[currentIndex];
  const q2 = questions[currentIndex + 1];
  const progressPct = (currentIndex / total) * 100;
  const bothAnswered =
    q1 && q2 &&
    pageSelections[q1.id] !== undefined &&
    pageSelections[q2.id] !== undefined;

  const requiredFields = demographicFields.filter((f) => f.required);
  const emailValid = email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const demoCanAdvance = requiredFields.every((f) => !!demoAnswers[f.id]) && emailValid;

  function handleDemoChange(id: DemographicFieldId, value: string) {
    setDemoAnswers((prev) => ({ ...prev, [id]: value }));
    if (id === "ageRange") {
      setTimeout(() => incomeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
    if (id === "incomeRange") {
      setTimeout(() => incomeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
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

  async function postWithRetry(payload: string, attempts = 3): Promise<boolean> {
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
        if (res.ok) return true;
      } catch {
        // network error — fall through to retry
      }
      // backoff before retrying (skip wait after the last attempt)
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
    return false;
  }

  async function handleSubmit() {
    if (submitting) return; // guard against double-submit → duplicate Sheet rows
    if (!consentAccepted) return; // PDPA: required consent must be given
    setSubmitting(true);

    const grouped = groupAnswersByAxis(answers);
    const scores = calculateAxisScores(grouped);
    const personaId = routePersonaId(scores);

    const payload = JSON.stringify({
      f: Math.round(scores.F), c: Math.round(scores.C), w: Math.round(scores.W),
      personaId,
      demographics: demoAnswers,
      answers,
      // PDPA ม.19 no-bundle: email is only sent when the user opts in to
      // marketing — never bundled with the required processing consent.
      email: marketingConsent ? (email.trim() || undefined) : undefined,
      consentAccepted,
      marketingConsent,
      // consentTimestamp is stamped server-side in Thai time (not trusted from client)
    });

    // Wait for the submission (with retries) so data isn't silently lost on
    // Cloud Run. Even if it ultimately fails we still show the result rather
    // than trapping the user — the error is logged server-side.
    await postWithRetry(payload);

    // Survey complete — clear saved progress so a return visit starts fresh.
    try {
      sessionStorage.removeItem(PROGRESS_KEY);
      sessionStorage.removeItem("survey_entry");
    } catch {
      // ignore
    }

    router.push(`/result?r=${encodeScoreToken(scores.F, scores.C, scores.W)}`);
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
    setPhase("demo");
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

  // Until mounted, render a paper-colored placeholder that matches the server
  // output exactly (no sessionStorage-derived state), avoiding any hydration
  // mismatch. The restore effect flips `hydrated` and reveals the real phase.
  if (!hydrated) {
    return <div className="h-dvh bg-qgen-paper" />;
  }

  // ── Demographics ───────────────────────────────────────────────────────────
  if (phase === "demo") {
    return (
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper">
        <SignalTopBar />

        <div className="flex-1 overflow-y-auto sm:overflow-visible px-5 pt-6 pb-36 max-w-lg mx-auto w-full animate-slide-in">
          <div className="text-center mb-2">
            <h1 className="font-ui font-bold text-qgen-black-absolute"
              style={{ fontSize: 26, lineHeight: "34px", letterSpacing: "-0.01em" }}>
              Your Information
            </h1>
          </div>

          <p className="text-center text-qgen-gray-ash mb-5 sm:mb-8"
            style={{ fontSize: 13, lineHeight: "20px" }}>
            ข้อมูลนี้ใช้เพื่อดูภาพรวมเชิงสถิติเท่านั้น{" "}
            <br className="sm:hidden" />
            และไม่มีผลต่อผลลัพธ์ Persona ของคุณ
          </p>

          <div className="flex flex-col gap-6">
            {demographicFields.map((field) => (
              <div key={field.id} ref={field.id === "incomeRange" ? incomeRef : undefined}>
                <label className="block font-ui font-semibold text-qgen-black-soft mb-2"
                  style={{ fontSize: 14.5 }}>
                  {field.label}
                  {field.required && <span className="ml-1 text-qgen-signal">*</span>}
                </label>
                {field.helperText && (
                  <p className="text-qgen-gray-ash mb-2" style={{ fontSize: 12 }}>{field.helperText}</p>
                )}
                <Dropdown
                  value={demoAnswers[field.id] ?? ""}
                  options={field.options}
                  onChange={(v) => handleDemoChange(field.id, v)}
                />
              </div>
            ))}

            <div>
              <label className="block font-ui font-semibold text-qgen-black-soft mb-2"
                style={{ fontSize: 14.5 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={[
                  "w-full px-4 rounded-[10px] border bg-qgen-paper-alt",
                  "font-ui transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-qgen-signal/30 focus:border-qgen-signal",
                  !emailValid
                    ? "text-qgen-black-soft border-qgen-signal-deep"
                    : email
                      ? "text-qgen-black-soft border-qgen-gray-ash/60"
                      : "text-qgen-gray-ash border-qgen-gray-border",
                ].join(" ")}
                style={{ height: 46, fontSize: 16 }}
              />
              {!emailValid && (
                <p className="mt-1.5 text-qgen-signal-deep" style={{ fontSize: 11.5 }}>
                  รูปแบบอีเมลไม่ถูกต้อง
                </p>
              )}
            </div>

            {/* ── PDPA consent ── */}
            <div className="flex flex-col gap-3 pt-1">
              <div>
                <ConsentCheckbox checked={consentAccepted} onChange={setConsentAccepted}>
                  ฉันได้อ่าน
                  <a
                    href="https://qgen.co/the-office-survivor-privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-qgen-signal underline hover:text-qgen-signal-deep"
                  >
                    ประกาศความเป็นส่วนตัว
                  </a>
                  {" "}และยินยอมให้ QGEN เก็บและประมวลผลข้อมูลของฉันเพื่อแสดงผลการประเมิน
                </ConsentCheckbox>
              </div>

              <ConsentCheckbox checked={marketingConsent} onChange={setMarketingConsent} align="center">
                ฉันยินยอมรับข่าวสารและคอนเทนต์จาก QGEN ทางอีเมล
              </ConsentCheckbox>
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
            <button
              onClick={() => {
                setChapterIntroAxis("F");
                setPhase("chapterIntro");
              }}
              disabled={!demoCanAdvance || !consentAccepted}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              ถัดไป
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => setPhase("storyIntro")} />
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
        desc: "มองเห็นโอกาสเติบโตในสายงาน และเติบโตไปพร้อมกับองค์กรได้อย่างมั่นคง",
      },
      {
        label: "Well-being",
        labelTH: "สุขภาพและความเป็นอยู่",
        desc: "มีสุขภาพกายและใจที่ดี จัดการความเครียดและความเหนื่อยล้าได้อย่างเหมาะสม",
      },
    ];
    return (
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className="flex-1 overflow-hidden sm:overflow-visible px-5 py-3 pb-32 sm:pb-24 max-w-lg mx-auto w-full animate-slide-in pt-8 sm:pt-16">
          <div
            className="w-full max-w-[190px] sm:max-w-[300px] mx-auto mb-4 sm:mb-4"
            style={{ aspectRatio: "1022 / 356" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Element/Heading.png"
              alt="The Office Survivor — มนุษย์ออฟฟิศต้องรอด"
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-qgen-gray-ash text-center mb-5 sm:mb-6 text-[12.5px] leading-[18px] sm:text-[15.5px] sm:leading-[24px]">
            สำรวจปัญหา 3 ด้านหลัก ของชีวิตมนุษย์ออฟฟิศ
            <br />
            เพื่อดูความเสี่ยงที่อาจเกิดขึ้นและแนวทางการรับมือสถานการณ์เบื้องต้น
          </p>

          <div
            className="w-full rounded-xl border border-qgen-gray-border bg-qgen-paper-alt overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(10,10,10,0.04)" }}
          >
            {STORY_AXES.map((ax, i) => (
              <div
                key={i}
                className="px-3.5 py-2.5 sm:px-4 sm:py-2.5"
              >
                <p className="font-ui font-semibold text-qgen-black-soft text-[13.5px] leading-[17px] sm:text-[16px] sm:leading-[21px]">
                  {ax.label} <span className="text-qgen-gray-ash font-semibold text-[11.5px] sm:text-[13px]">· {ax.labelTH}</span>
                </p>
                <p className="font-ui text-qgen-gray-ash mt-1 sm:mt-2 text-[11.5px] leading-[16px] sm:text-[13.5px] sm:leading-[20px]">
                  {ax.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
            <button
              onClick={() => setPhase("demo")}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                hover:bg-qgen-signal-deep active:scale-[0.98] transition-all duration-200"
              style={{ height: 48, fontSize: 15 }}
            >
              เริ่มทำแบบทดสอบ
              <svg className="inline ml-2 -mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h9M8 3l5 5-5 5" />
              </svg>
            </button>
            <div className="flex justify-start pt-1">
              <BackButton onClick={() => router.push("/")} />
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className={`flex-1 overflow-hidden sm:overflow-visible px-5 py-8 pb-32 sm:pb-24 sm:pt-16 max-w-lg mx-auto w-full animate-slide-in ${meta.story ? "pt-12" : ""}`}>
          {meta.story && (
            <div className="w-[170px] h-[170px] sm:w-[160px] sm:h-[160px] mx-auto mb-3 sm:mb-4" style={{ animation: "clock-ring 0.9s ease-in-out infinite" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Element/Clock.webp" alt="นาฬิกาปลุก" className="w-full h-full object-contain" />
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
          {meta.story && <div className="mt-5 sm:mt-10" />}

          {meta.story ? (
            <div className="flex flex-col gap-2.5 sm:gap-3.5">
              {meta.story.map((line, i) => {
                if (i === 0 && line.includes("|")) {
                  const [highlight, rest] = line.split("|");
                  return (
                    <p key={i} className="text-center text-[13.5px] leading-[22px] sm:text-[15px] sm:leading-[25px]">
                      <span className="font-bold text-qgen-signal text-[20px] sm:text-[23px]">{highlight}</span>
                      <span className="text-qgen-black-soft">{rest}</span>
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-qgen-black-soft text-center text-[13.5px] leading-[22px] sm:text-[15px] sm:leading-[25px]">
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

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className="flex-1 overflow-hidden sm:overflow-visible px-5 py-8 pb-32 sm:pb-24 sm:pt-16 max-w-lg mx-auto w-full animate-slide-in pt-12">
          <div className="w-[170px] h-[170px] sm:w-[160px] sm:h-[160px] mx-auto mb-3 sm:mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Element/Phone.webp" alt="โทรศัพท์แจ้งเตือน" className="w-full h-full object-contain" />
          </div>

          <div className="mt-5 sm:mt-10" />

          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            <p className="text-qgen-black-soft text-center text-[13.5px] leading-[22px] sm:text-[15px] sm:leading-[25px]">
              ก่อนออกจากห้อง โทรศัพท์สว่างขึ้นพร้อมแจ้งเตือนค่าใช้จ่าย
            </p>
            <p className="text-qgen-black-soft text-center text-[13.5px] leading-[22px] sm:text-[15px] sm:leading-[25px]">
              และคำถามในหัวก็เด้งขึ้นมาเบา ๆ ว่า
            </p>
            <p className="text-center mx-auto text-[16px] leading-[24px] sm:text-[18px] sm:leading-[27px]" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", padding: "0 28px", boxSizing: "border-box" }}>
              <span className="font-bold text-qgen-signal">
                &ldquo;เรากำลังใช้ชีวิตอยู่จริง ๆ หรือแค่พยายามเอาตัวเองให้รอดไปวัน ๆ&rdquo;
              </span>
            </p>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className="flex-1 overflow-hidden sm:overflow-visible sm:flex sm:flex-col sm:justify-center px-5 py-4 pb-32 sm:pb-24 sm:pt-0 max-w-lg mx-auto w-full animate-slide-in pt-8">
          <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
            style={{ fontSize: 11, letterSpacing: "0.18em" }}>
            Chapter 1
          </p>
          <div className="text-center mb-3 sm:mb-6">
            <div
              className="font-display text-qgen-black-soft text-[25px] leading-[30px] sm:text-[32px] sm:leading-[38px]"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Financial Security
            </div>
            <div
              className="font-bold text-qgen-signal text-[15px] leading-[22px] sm:text-[19px] sm:leading-[28px] mt-1.5 sm:mt-[6px]"
            >
              เงินเดือนเข้า แต่ชีวิตเรายังหนักอึ้ง
            </div>
          </div>

          <div className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] mx-auto mb-3 sm:mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Element/Money.webp" alt="เงินเดือนกับค่าใช้จ่าย" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3.5">
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              ระหว่างทางไปทำงาน คุณเปิดแอปธนาคารขึ้นมาดูแบบไม่ตั้งใจ
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              เงินเดือนเพิ่งเข้าได้ไม่นาน แต่ค่าใช้จ่ายเหมือนมารออยู่ก่อนแล้ว
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              บางครั้งคุณไม่ได้อยากประหยัดทุกอย่าง
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              แต่ทุกครั้งที่ใช้เงิน คุณก็เริ่มคิดมากขึ้นเรื่อย ๆ
            </p>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className="flex-1 overflow-hidden sm:overflow-visible sm:flex sm:flex-col sm:justify-center px-5 py-4 pb-32 sm:pb-24 sm:pt-0 max-w-lg mx-auto w-full animate-slide-in pt-8">
          <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
            style={{ fontSize: 11, letterSpacing: "0.18em" }}>
            Chapter 2
          </p>
          <div className="text-center mb-3 sm:mb-6">
            <div
              className="font-display text-qgen-black-soft text-[25px] leading-[30px] sm:text-[32px] sm:leading-[38px]"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Career Path
            </div>
            <div
              className="font-bold text-qgen-signal text-[15px] leading-[22px] sm:text-[19px] sm:leading-[28px] mt-1.5 sm:mt-[6px]"
            >
              งานที่ทำอยู่ กำลังพาเราไปไหน
            </div>
          </div>

          <div className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] mx-auto mb-3 sm:mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Element/Career.webp" alt="เส้นทางอาชีพ" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3.5">
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              คุณมาถึงออฟฟิศ เปิดคอม และเข้าสู่โหมดพร้อมทำงาน
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              อีเมลรอตอบ ประชุมรออยู่ งานเก่ารอแก้ และงานใหม่รอเริ่ม
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              ไม่ใช่ว่าคุณไม่ตั้งใจหรือไม่พยายาม แต่บางวันคุณก็เริ่มสงสัยว่า
            </p>
            <p className="text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              <span className="font-bold text-qgen-black-soft">
                &ldquo;งานที่ทำอยู่กำลังพาคุณไปข้างหน้าจริงไหม&rdquo;
              </span>
            </p>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />

        <div className="flex-1 overflow-hidden sm:overflow-visible sm:flex sm:flex-col sm:justify-center px-5 py-4 pb-32 sm:pb-24 sm:pt-0 max-w-lg mx-auto w-full animate-slide-in pt-8">
          <p className="font-ui font-semibold text-qgen-signal uppercase mb-3 text-center"
            style={{ fontSize: 11, letterSpacing: "0.18em" }}>
            Chapter 3
          </p>
          <div className="text-center mb-3 sm:mb-6">
            <div
              className="font-display text-qgen-black-soft text-[25px] leading-[30px] sm:text-[32px] sm:leading-[38px]"
              style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Well Being
            </div>
            <div
              className="font-bold text-qgen-signal text-[15px] leading-[22px] sm:text-[19px] sm:leading-[28px] mt-1.5 sm:mt-[6px]"
            >
              ร่างกายยังเดินต่อไป แต่ใจเริ่มไปต่อไม่ไหว
            </div>
          </div>

          <div className="w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] mx-auto mb-3 sm:mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Element/Health.webp" alt="ความเหนื่อยล้าทางร่างกายและใจ" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col gap-2 sm:gap-3.5">
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              วันทำงานดำเนินไปเรื่อย ๆ ช่วงบ่ายมาถึง
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              กาแฟแก้วแรกเริ่มหมดฤทธิ์
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              ตาเริ่มล้า ไหล่เริ่มตึง คุณอาจยังทำงานได้
            </p>
            <p className="text-qgen-black-soft text-center text-[13px] leading-[20px] sm:text-[15px] sm:leading-[25px]">
              แต่ร่างกายเริ่มส่งสัญญาณเล็ก ๆ ว่า มันเหนื่อยมาสักพักแล้ว
            </p>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
          style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-3">
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
      <div className="h-dvh sm:min-h-screen flex flex-col bg-qgen-paper overflow-hidden sm:overflow-visible">
        <SignalTopBar />
        <SignalProgress value={100} />

        <div className="flex-1 flex flex-col justify-center px-5 py-8 sm:pt-16 sm:pb-10 max-w-lg mx-auto w-full animate-slide-in">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-qgen-black-soft text-center text-[15px] leading-[24px] sm:text-[18px] sm:leading-[28px]">
              หลังจากผ่านมาทั้งวัน คุณอาจยังยืนไหว ยังทำงานต่อได้
            </p>
            <p className="text-qgen-black-soft text-center text-[15px] leading-[24px] sm:text-[18px] sm:leading-[28px]">
              และยังคงเตรียมพร้อมสำหรับวันพรุ่งนี้เหมือนเดิม
            </p>
            <p className="text-qgen-black-soft text-center text-[15px] leading-[24px] sm:text-[18px] sm:leading-[28px]">
              แต่คำถามสำคัญคือ
            </p>
            <p className="text-center" style={{ fontSize: 21, lineHeight: "30px" }}>
              <span className="font-bold text-qgen-signal">
                วันนี้คุณใช้พลังงานไปกับอะไรมากที่สุด
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-1.5 mt-6 rounded-xl border border-qgen-gray-border bg-qgen-paper-alt"
            style={{ padding: "14px 16px" }}>
            <p className="text-qgen-black-soft text-center" style={{ fontSize: 14, lineHeight: "22px" }}>
              กดดูผลลัพธ์ แล้วมาดูกันว่า
            </p>
            <p className="text-center" style={{ fontSize: 15, lineHeight: "24px" }}>
              <span className="font-bold text-qgen-black-soft">
                &ldquo;คุณกำลังเป็นมนุษย์ออฟฟิศประเภทไหนอยู่&rdquo;
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full font-ui font-bold text-white rounded-[12px]
                bg-qgen-signal shadow-[0_12px_32px_rgba(201,111,59,0.25)]
                disabled:opacity-60 disabled:cursor-not-allowed
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
          rightLabel={q1.axisName}
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
            style={{ fontSize: 17, lineHeight: "26px", overflowWrap: "anywhere" }}>
            <WrapSafeText text={q1.question} />
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
            style={{ fontSize: 17, lineHeight: "26px", overflowWrap: "anywhere" }}>
            <WrapSafeText text={q2.question} />
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

      </div>

      {/* Fixed bottom: ถัดไป button + back */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-qgen-gray-border px-5 pt-3 pb-6"
        style={{ background: "rgba(247,246,243,0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-lg mx-auto flex flex-col gap-3">
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
          <div className="flex justify-start pt-1">
            <BackButton onClick={handleSurveyBack} />
          </div>
        </div>
      </div>
    </div>
  );
}
