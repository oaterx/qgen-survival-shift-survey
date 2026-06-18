import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { routePersona } from "../../lib/persona-router";
import { getAxisResult } from "../../lib/scoring";
import { decodeScoreToken } from "../../lib/share-token";
import { loadStorycardAssets, loadPersonaImageDataUrl } from "../../lib/storycard-assets";
import SignalTopBar from "../../components/survival-shift/SignalTopBar";
import SurvivalScoreSection from "./SurvivalScoreSection";
import ShareStoryButton from "./ShareStoryButton";
import ShareLinkButton from "./ShareLinkButton";
import ShareSurveyButton from "./ShareSurveyButton";
import type { StatusId } from "../../data/types";

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

function scoreLevel(score: number): { label: string; description: string } {
  if (score >= 67) return { label: "Stable", description: "คะแนนภาพรวมตอนนี้อยู่ในเกณฑ์ที่ดี ควรรักษาโมเมนตัมนี้ไว้ ✅" };
  if (score >= 34) return { label: "At Risk", description: "ความตึงเครียดในแกนต่าง ๆ เริ่มก่อตัว ควรย้อนกลับไปดูปัญหา และค่อย ๆ แก้ไปทีละด้าน ⚠️" };
  return { label: "Crisis", description: "อยู่ในช่วงวิกฤติ ถึงเวลาต้อง Take action❗️" };
}


export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const sp = await searchParams;
  const decoded = sp.r ? decodeScoreToken(sp.r) : null;
  if (!decoded) return notFound();
  const { f, c, w } = decoded;

  const scores = { F: f, C: c, W: w };
  const persona = routePersona(scores);
  const axisResult = getAxisResult(scores);

  const overallScore = Math.round(
    (axisResult.F.roundedScore + axisResult.C.roundedScore + axisResult.W.roundedScore) / 3
  );
  const level = scoreLevel(overallScore);
  const personaAccent = THEME_COLOR[persona.theme] ?? "#C96F3B";

  const actionPlan = (persona as { actionPlan?: Record<string, { titleTH: string; actions: string[] }> }).actionPlan;
  const { fontFace, logoDataUrl, headingDataUrl } = loadStorycardAssets();
  const personaImageDataUrl = loadPersonaImageDataUrl(persona.id);

  return (
    <main className="min-h-screen pb-16">

      {/* Header — shared top bar + heading */}
      <div className="animate-fade-in">
        <SignalTopBar />
      </div>
      <div className="flex justify-center pt-4 pb-1">
        <div className="relative w-full max-w-[220px] sm:max-w-[300px]" style={{ aspectRatio: "1022 / 356" }}>
          <Image
            src="/Element/Heading.png"
            alt="The Office Survivor — มนุษย์ออฟฟิศต้องรอด"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 220px, 300px"
            priority
          />
        </div>
      </div>

      <div className="px-5 max-w-lg mx-auto flex flex-col gap-5">

        {/* ── Persona ── */}
        <section className="relative animate-fade-up" style={{ animationDelay: "60ms" }}>
          <div className="px-4 pt-1 pb-1 flex flex-col items-center text-center">
            <div className="mb-3 sm:mb-6">
              <Image
                src={`/personas/${persona.id}.webp`}
                alt={persona.name}
                width={270}
                height={360}
                className="object-contain w-[200px] sm:w-[270px]"
                priority
              />
            </div>
            <h3 className="text-[24px] sm:text-[30px] font-bold text-qgen-black-absolute leading-tight mb-2 sm:mb-3 whitespace-pre-line">
              &ldquo;{persona.name}&rdquo;
            </h3>
            <div
              className="w-32 sm:w-40 h-[3px] rounded-full mb-3 sm:mb-4"
              style={{ background: personaAccent }}
            />
            <p className="text-[13.5px] sm:text-[15px] text-qgen-gray-ash leading-relaxed max-w-[300px] sm:max-w-[320px]">
              {persona.description}
            </p>
          </div>
        </section>

        {/* ── Your Survival Score + Axis Scores (accordion) ── */}
        <SurvivalScoreSection
          overallScore={overallScore}
          level={level}
          axisResult={{
            F: { roundedScore: axisResult.F.roundedScore, status: axisResult.F.status },
            C: { roundedScore: axisResult.C.roundedScore, status: axisResult.C.status },
            W: { roundedScore: axisResult.W.roundedScore, status: axisResult.W.status },
          }}
        />

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
            headingDataUrl={headingDataUrl}
            personaImageDataUrl={personaImageDataUrl}
          />

          {/* Share row: ผลลัพธ์ + แชร์แบบทดสอบ */}
          <div className="flex gap-2">
            <div className="flex-1"><ShareLinkButton /></div>
            <div className="flex-1"><ShareSurveyButton /></div>
          </div>

          {/* Back to home */}
          <Link
            href="/"
            className="w-full py-3.5 rounded-2xl border border-qgen-gray-border
              font-ui font-semibold text-qgen-black-soft text-sm text-center
              hover:bg-qgen-paper-alt active:scale-[0.98] transition-all duration-200"
          >
            กลับหน้าแรก
          </Link>

          <p className="text-center text-qgen-gray-ash/60 mt-2" style={{ fontSize: 10.5, fontWeight: 300 }}>
            All images in this survey are AI-generated.
          </p>
        </div>

      </div>
    </main>
  );
}
