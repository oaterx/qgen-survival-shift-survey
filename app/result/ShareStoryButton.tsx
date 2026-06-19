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

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], filename, { type: mime });
}

export default function ShareStoryButton({ persona, axisResult, buttonColor, fontFace, logoDataUrl, headingDataUrl, personaImageDataUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const [status, setStatus] = useState<"generating" | "ready" | "error">("generating");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      // Wait for every <img> in the card to fully decode before capturing.
      const imgs = Array.from(cardRef.current.querySelectorAll("img"));
      await Promise.all(imgs.map(img => img.decode().catch(() => {})));

      await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 1");
      const dataUrl = await withTimeout(toPng(cardRef.current, { pixelRatio: 2, cacheBust: true }), 8000, "render pass 2");
      setPreviewUrl(dataUrl);
      // Pre-convert to File so handleClick can call navigator.share() synchronously
      try {
        setPreviewFile(dataUrlToFile(dataUrl, "office-survivor.png"));
      } catch { /* non-critical */ }
      setStatus("ready");
    } catch (err) {
      console.error("[ShareStory] image generation failed:", err);
      startedRef.current = false;
      setStatus("error");
    }
  }

  function handleClick() {
    if (status === "error") {
      startedRef.current = false;
      generate();
      return;
    }
    if (!previewUrl) return;

    const isMobile = navigator.maxTouchPoints > 0;

    // Mobile: native file share sheet (iOS Safari 15+, Android Chrome 89+)
    if (isMobile && previewFile && navigator.canShare?.({ files: [previewFile] })) {
      navigator.share({
        files: [previewFile],
        title: "The Office Survivor — ผลลัพธ์ของฉัน",
      }).catch((err) => {
        if (!(err instanceof Error && err.name === "AbortError")) {
          setShowModal(true);
        }
      });
      return;
    }

    // Desktop: download directly
    if (!isMobile) {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = "office-survivor.png";
      a.click();
      return;
    }

    setShowModal(true);
  }

  const modal = showModal && previewUrl && (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-5"
      style={{
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      onClick={() => setShowModal(false)}
    >
      <div
        className="w-full max-w-[280px] flex flex-col items-center overflow-y-auto"
        style={{ maxHeight: "calc(100dvh - 32px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Story card"
          className="w-full rounded-2xl shadow-2xl mb-4 flex-shrink-0"
          style={{ maxHeight: "52vh", objectFit: "contain", WebkitTapHighlightColor: "transparent" }}
          draggable
        />

        <div className="w-full rounded-2xl mb-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div className="flex items-start gap-3 px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="text-base mt-0.5">📱</span>
            <div>
              <p className="text-white text-xs font-semibold mb-0.5">iOS / Android</p>
              <p className="text-white/60 text-xs leading-relaxed">กดค้างที่รูปภาพ แล้วเลือก &ldquo;บันทึกรูปภาพ&rdquo; หรือ &ldquo;Save to Photos&rdquo;</p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3">
            <span className="text-base mt-0.5">🖥️</span>
            <div>
              <p className="text-white text-xs font-semibold mb-0.5">Desktop</p>
              <p className="text-white/60 text-xs leading-relaxed">คลิกขวาที่รูปภาพ แล้วเลือก &ldquo;Save Image As…&rdquo;</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="w-full py-3 rounded-2xl text-white/70 text-sm font-medium active:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          ปิด
        </button>
      </div>
    </div>
  );

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
        style={{ background: "#C96F3B" }}
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

      {/* Portal: render modal at <body> level to avoid stacking context issues */}
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
