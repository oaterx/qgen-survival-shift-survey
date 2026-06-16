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

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

export default function ShareStoryButton({ persona, axisResult, buttonColor, fontFace, logoDataUrl, headingDataUrl, personaImageDataUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  // When share isn't available/fails, we show the generated image in an
  // on-page modal instead of trying download/popup tricks that depend on a
  // user-gesture context that's already expired by the time we get here.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleShare() {
    if (!cardRef.current || state === "loading") return;
    setState("loading");

    let blob: Blob;
    try {
      if (fontFace && !cardRef.current.querySelector("style")) {
        const style = document.createElement("style");
        style.textContent = fontFace;
        cardRef.current.appendChild(style);
      }

      // Two-pass render: first warms font cache, second is real capture.
      // Hard timeout so a stuck render (slow mobile, font load hang) can
      // never leave the button spinning forever with no feedback.
      await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 1");
      const dataUrl = await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 2");
      blob = await fetch(dataUrl).then((r) => r.blob());
    } catch (err) {
      console.error("[ShareStory] image generation failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 2500);
      return;
    }

    const file = new File([blob], "survival-shift-story.png", { type: "image/png" });

    // Native share sheet — works great when available, and is the only path
    // that still has a valid user-gesture context immediately after capture.
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
        console.error("[ShareStory] navigator.share failed, showing preview instead:", err);
      }
    }

    // Fallback: show the image in an on-page modal. This avoids both (a)
    // iOS Safari's unreliable <a download> support for blob URLs, and (b)
    // window.open()/popup-blocker issues — by now we're several awaits past
    // the original click, so the user-gesture context is gone and any new
    // popup would likely be silently blocked with no error to catch.
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setState("idle");
    };
    reader.onerror = () => {
      console.error("[ShareStory] FileReader failed");
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    };
    reader.readAsDataURL(blob);
  }

  function handleDownloadFromPreview() {
    if (!previewUrl) return;
    // This click is a fresh, direct user gesture (the modal button itself),
    // so the <a download> trick is reliable here even on browsers that
    // block it when triggered from stale/async contexts.
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = "survival-shift-story.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
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

      {/* Fallback preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: "rgba(10,10,10,0.85)" }}
          onClick={() => setPreviewUrl(null)}
        >
          <div className="min-h-full flex flex-col items-center justify-center gap-4 p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="The Office Survivor — ผลลัพธ์ของฉัน"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full rounded-2xl shadow-2xl"
              style={{ maxHeight: "55vh" }}
            />
            <p className="text-white/90 text-center text-sm" onClick={(e) => e.stopPropagation()}>
              {isIOS() ? "กดค้างที่รูปภาพเพื่อบันทึกลงอัลบั้ม" : "กดปุ่มด้านล่างเพื่อบันทึกรูปภาพ"}
            </p>
            {!isIOS() && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDownloadFromPreview(); }}
                className="px-6 py-3 rounded-xl bg-white text-qgen-black-soft font-ui font-semibold text-sm"
              >
                บันทึกรูปภาพ
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); }}
              className="px-6 py-2.5 rounded-xl border border-white/30 text-white font-ui text-sm"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}
