"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const fileRef = useRef<File | null>(null);
  const startedRef = useRef(false);

  const [open, setOpen] = useState(false);
  // "generating" → image is being rendered; "ready" → preview + actions shown;
  // "error" → render failed, offer retry.
  const [status, setStatus] = useState<"generating" | "ready" | "error">("generating");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Render the share image in the background as soon as the result page mounts,
  // so tapping the button can open a modal that's already populated — the tap
  // feels instant ("ปึ้ป") instead of staring at a frozen button for seconds.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.canShare === "function");
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generate() {
    if (startedRef.current || !cardRef.current) return;
    startedRef.current = true;
    setStatus("generating");
    try {
      if (fontFace && !cardRef.current.querySelector("style")) {
        const style = document.createElement("style");
        style.textContent = fontFace;
        cardRef.current.appendChild(style);
      }
      // Two-pass render: first warms the font/image cache, second is the real
      // capture. Hard timeout so a stuck render can't hang forever.
      await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 1");
      const dataUrl = await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 2");
      const blob = await fetch(dataUrl).then((r) => r.blob());
      fileRef.current = new File([blob], "survival-shift-story.png", { type: "image/png" });
      setPreviewUrl(dataUrl);
      setStatus("ready");
    } catch (err) {
      console.error("[ShareStory] image generation failed:", err);
      startedRef.current = false; // allow retry
      setStatus("error");
    }
  }

  function handleOpen() {
    setOpen(true);
    // If a previous attempt errored (or never started), kick it off now.
    if (status !== "ready") generate();
  }

  // Fired directly from the in-modal button tap — a fresh user-gesture context,
  // which is exactly what iOS Safari requires for navigator.share to actually
  // open the share sheet (the old flow shared after async work, by which point
  // the gesture had expired and the call silently failed).
  async function handleShare() {
    const file = fileRef.current;
    if (!file) return;
    // Try native share sheet first (works on iOS/Android; lets user Save to
    // Photos or share to IG Stories). Skip the canShare({files}) pre-check —
    // it returns false on some iOS versions even when share actually works,
    // causing the button to do nothing. Just call share and handle errors.
    try {
      await navigator.share({ files: [file], title: "The Office Survivor" });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      // Share not supported or failed — fall back to direct download.
      handleDownload();
    }
  }

  function handleDownload() {
    if (!previewUrl) return;
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
        onClick={handleOpen}
        className="w-full py-4 rounded-2xl text-white font-semibold text-sm
          active:scale-[0.97] transition-transform duration-200 ease-out
          flex items-center justify-center gap-2.5"
        style={{
          background: buttonColor ?? "linear-gradient(135deg, #833ab4, #e1306c, #f77737)",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
        แชร์ลง Story IG
      </button>

      {/* Share / download modal — portalled to <body> so it escapes the
          result page's animate-fade-up wrapper, whose transform would
          otherwise become the containing block for position:fixed and pin the
          modal partway down the page instead of over the full viewport. */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 overflow-y-auto animate-modal-backdrop"
          style={{ background: "rgba(10,10,10,0.85)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="min-h-full flex flex-col items-center justify-center gap-4 p-6 animate-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "generating" && (
              <div className="flex flex-col items-center gap-3 text-white/90">
                <span className="inline-block w-7 h-7 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <p className="text-sm">กำลังสร้างภาพ…</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-white/90 text-center text-sm">สร้างภาพไม่สำเร็จ</p>
                <button
                  onClick={generate}
                  className="px-6 py-3 rounded-xl bg-white text-qgen-black-soft font-ui font-semibold text-sm active:scale-[0.97] transition-transform duration-200 ease-out"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            )}

            {status === "ready" && previewUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="The Office Survivor — ผลลัพธ์ของฉัน"
                  className="max-w-full rounded-2xl shadow-2xl"
                  style={{ maxHeight: "55vh" }}
                />
                {/* Single action button: native share sheet on iOS/Android
                    (lets user Save to Photos or share to IG Stories in one tap),
                    plain download on desktop where share isn't supported. */}
                <button
                  onClick={handleShare}
                  className="w-full max-w-[280px] px-6 py-4 rounded-xl bg-white text-qgen-black-soft
                    font-ui font-bold text-[15px] active:scale-[0.97] transition-transform duration-200 ease-out
                    flex items-center justify-center gap-2.5"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  แชร์ / บันทึก
                </button>
              </>
            )}

            <button
              onClick={() => setOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-white/30 text-white font-ui text-sm active:scale-[0.97] transition-transform duration-200 ease-out"
            >
              ปิด
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
