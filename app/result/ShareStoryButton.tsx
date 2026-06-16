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
  headingDataUrl?: string;
  personaImageDataUrl?: string;
};

export default function ShareStoryButton({ persona, axisResult, buttonColor, fontFace, logoDataUrl, headingDataUrl, personaImageDataUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "survival-shift-story.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (!cardRef.current || state === "loading") return;
    setState("loading");

    let blob: Blob;
    try {
      // Inject font-face styles into the card element so html-to-image picks them up
      if (fontFace && !cardRef.current.querySelector("style")) {
        const style = document.createElement("style");
        style.textContent = fontFace;
        cardRef.current.appendChild(style);
      }

      // Two-pass render: first warms font cache, second is real capture
      await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      blob = await fetch(dataUrl).then((r) => r.blob());
    } catch {
      // Image generation itself failed — nothing to share/download.
      setState("error");
      setTimeout(() => setState("idle"), 2500);
      return;
    }

    const file = new File([blob], "survival-shift-story.png", { type: "image/png" });

    // Try the native share sheet first, but always fall back to a direct
    // download if it fails for any reason other than the user cancelling —
    // some mobile browsers (notably iOS Safari) reject navigator.share()
    // here because the user-gesture context can expire during the async
    // image generation above, and we don't want that to look like nothing happened.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        setState("idle");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setState("idle");
          return;
        }
        // fall through to download
      }
    }

    try {
      downloadBlob(blob);
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <>
      {/* Card rendered off-screen for capture only */}
      <div
        style={{ position: "fixed", top: -9999, left: -9999, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StoryCard ref={cardRef} persona={persona} axisResult={axisResult} logoDataUrl={logoDataUrl} headingDataUrl={headingDataUrl} personaImageDataUrl={personaImageDataUrl} />
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
        ) : state === "error" ? (
          <>สร้างภาพไม่สำเร็จ ลองอีกครั้ง</>
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
