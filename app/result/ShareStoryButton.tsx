"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import StoryCard from "./StoryCard";
import type { StoryPersona, StoryAxisResult } from "./StoryCard";

type Props = {
  persona: StoryPersona;
  axisResult: Record<"F" | "C" | "W", StoryAxisResult>;
  buttonColor?: string;
  fontFace?: string;
  logoDataUrl?: string;
};

export default function ShareStoryButton({ persona, axisResult, buttonColor, fontFace, logoDataUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading">("idle");

  async function handleShare() {
    if (!cardRef.current || state === "loading") return;
    setState("loading");

    try {
      // Inject font-face styles into the card element so html-to-image picks them up
      if (fontFace) {
        const style = document.createElement("style");
        style.textContent = fontFace;
        cardRef.current.appendChild(style);
      }

      // Two-pass render: first warms font cache, second is real capture
      await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });

      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], "survival-shift-story.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "survival-shift-story.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // user cancelled
    } finally {
      setState("idle");
    }
  }

  return (
    <>
      {/* Card rendered off-screen for capture only */}
      <div
        style={{ position: "fixed", top: -9999, left: -9999, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StoryCard ref={cardRef} persona={persona} axisResult={axisResult} logoDataUrl={logoDataUrl} />
      </div>

      <button
        onClick={handleShare}
        disabled={state === "loading"}
        className="w-full py-4 rounded-2xl text-white font-semibold text-sm
          disabled:opacity-60 active:scale-[0.98] transition-all duration-300
          flex items-center justify-center gap-2.5"
        style={{
          background: buttonColor ?? "linear-gradient(135deg, #833ab4, #e1306c, #f77737)",
        }}
      >
        {state === "loading" ? (
          <>
            <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            กำลังสร้างภาพ…
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            แชร์ลง Story IG
          </>
        )}
      </button>
    </>
  );
}
