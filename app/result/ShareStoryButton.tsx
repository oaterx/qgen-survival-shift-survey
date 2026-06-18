"use client";

import { useEffect, useRef, useState } from "react";
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
  const startedRef = useRef(false);

  const [status, setStatus] = useState<"generating" | "ready" | "error">("generating");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
      await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 1");
      const dataUrl = await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 2");
      setPreviewUrl(dataUrl);
      setStatus("ready");
    } catch (err) {
      console.error("[ShareStory] image generation failed:", err);
      startedRef.current = false;
      setStatus("error");
    }
  }

  function handleClick() {
    if (status === "ready" && previewUrl) {
      setShowModal(true);
    } else if (status === "error") {
      startedRef.current = false;
      generate();
    }
  }

  return (
    <>
      {/* Off-screen card for capture */}
      <div
        style={{ position: "fixed", top: -9999, left: -9999, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StoryCard ref={cardRef} persona={persona} axisResult={axisResult} logoDataUrl={logoDataUrl} headingDataUrl={headingDataUrl} personaImageDataUrl={personaImageDataUrl} />
      </div>

      <button
        onClick={handleClick}
        disabled={status === "generating"}
        className="w-full py-4 rounded-2xl text-white font-semibold text-sm
          active:scale-[0.97] transition-transform duration-200 ease-out disabled:opacity-70
          flex items-center justify-center gap-2.5"
        style={{ background: buttonColor ?? "linear-gradient(135deg, #833ab4, #e1306c, #f77737)" }}
      >
        {status === "generating" ? (
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
            Save Image & Share
          </>
        )}
      </button>

      {/* Preview modal */}
      {showModal && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 px-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hint text */}
            <p className="text-white/80 text-center text-xs mb-3">
              กดค้างที่รูปเพื่อบันทึก (iOS/Android) · คลิกขวาเพื่อเซฟ (Desktop)
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Story card"
              className="w-full rounded-2xl shadow-2xl"
              draggable
            />

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-3 rounded-2xl bg-white/10 text-white text-sm font-medium
                active:bg-white/20 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}
