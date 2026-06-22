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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function doubleRaf(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => { requestAnimationFrame(() => r()); }));
}

// Downscale a (possibly multi-MB) data URL to a transparent PNG at ~render size.
// Keeps the alpha channel so it composites cleanly over the card's paper bg.
function shrinkImage(dataUrl: string, maxW: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      try {
        const nw = img.naturalWidth || maxW;
        const nh = img.naturalHeight || maxW;
        const scale = Math.min(1, maxW / nw);
        const w = Math.max(1, Math.round(nw * scale));
        const h = Math.max(1, Math.round(nh * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Paint the persona onto the captured card via canvas drawImage().
// html-to-image renders by serialising the DOM into an SVG <foreignObject>, but
// in-app WebViews (LINE / Facebook / Instagram) refuse to paint <img> elements
// inside that foreignObject — so the persona comes out blank there. drawImage()
// goes through the normal 2D canvas path, which every browser/WebView supports.
async function compositePersona(
  baseUrl: string,
  personaUrl: string,
  cardRect: DOMRect,
  personaRect: DOMRect,
): Promise<string> {
  const [base, persona] = await Promise.all([loadImage(baseUrl), loadImage(personaUrl)]);
  const canvas = document.createElement("canvas");
  canvas.width = base.naturalWidth;
  canvas.height = base.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return baseUrl;
  ctx.drawImage(base, 0, 0);

  // Map the persona's CSS box → output pixels.
  const ratio = base.naturalWidth / cardRect.width;
  const boxX = (personaRect.left - cardRect.left) * ratio;
  const boxY = (personaRect.top - cardRect.top) * ratio;
  const boxW = personaRect.width * ratio;
  const boxH = personaRect.height * ratio;

  // Replicate object-fit: contain inside that box.
  const ar = persona.naturalWidth / persona.naturalHeight;
  const boxAr = boxW / boxH;
  let dw = boxW, dh = boxH, dx = boxX, dy = boxY;
  if (ar > boxAr) { dh = boxW / ar; dy = boxY + (boxH - dh) / 2; }
  else { dw = boxH * ar; dx = boxX + (boxW - dw) / 2; }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(persona, dx, dy, dw, dh);
  return canvas.toDataURL("image/png");
}

export default function ShareStoryButton({ persona, axisResult, buttonColor, fontFace, logoDataUrl, headingDataUrl, personaImageDataUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const [status, setStatus] = useState<"generating" | "ready" | "error">("generating");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Persona shrunk to its real render size; also the source for compositing.
  const [cardPersona, setCardPersona] = useState<string | undefined>(undefined);
  const [personaReady, setPersonaReady] = useState(false);

  // Step 1 (on mount): shrink the persona image before it ever enters the card.
  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    (async () => {
      if (!personaImageDataUrl) {
        setPersonaReady(true);
        return;
      }
      // Card renders persona at 280×373 CSS px; at pixelRatio 2 → 560px wide.
      const small = await shrinkImage(personaImageDataUrl, 600);
      if (!cancelled) {
        setCardPersona(small);
        setPersonaReady(true);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 2: once the shrunk persona is rendered into the card, capture it.
  useEffect(() => {
    if (personaReady) generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaReady]);

  async function generate() {
    if (startedRef.current || !cardRef.current) return;
    startedRef.current = true;
    setStatus("generating");
    try {
      const card = cardRef.current;
      if (fontFace && !card.querySelector("style")) {
        const style = document.createElement("style");
        style.textContent = fontFace;
        card.appendChild(style);
      }

      // Wait for every <img> to be fully loaded AND decoded.
      const imgs = Array.from(card.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          new Promise<void>((resolve) => {
            const finish = () => img.decode().catch(() => {}).finally(resolve);
            if (img.complete && img.naturalHeight > 0) {
              finish();
            } else {
              img.addEventListener("load", finish, { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }
          })
        )
      );
      await doubleRaf();

      // Measure the persona box, then hide it so html-to-image captures the
      // text/background/logo/heading layer only. The persona is painted back
      // on top via canvas drawImage() — reliable in every browser & WebView.
      const personaEl = card.querySelector<HTMLImageElement>("img[data-persona]");
      const cardRect = card.getBoundingClientRect();
      const personaRect = personaEl ? personaEl.getBoundingClientRect() : null;
      if (personaEl) personaEl.style.visibility = "hidden";
      await doubleRaf();

      await withTimeout(toPng(card, { pixelRatio: 2, cacheBust: true }), 12000, "render pass 1");
      const baseUrl = await withTimeout(toPng(card, { pixelRatio: 2, cacheBust: true }), 12000, "render pass 2");

      if (personaEl) personaEl.style.visibility = "";

      let finalUrl = baseUrl;
      if (cardPersona && personaRect) {
        try {
          finalUrl = await compositePersona(baseUrl, cardPersona, cardRect, personaRect);
        } catch (e) {
          console.error("[ShareStory] persona composite failed, using base image:", e);
        }
      }

      setPreviewUrl(finalUrl);
      try {
        setPreviewFile(dataUrlToFile(finalUrl, "office-survivor.png"));
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
      {/* Hidden card for capture — pushed off-screen. Persona is drawn separately
          via canvas drawImage(), so the card never needs to be on-screen, and
          off-screen avoids extending the page (a transformed ancestor would turn
          position:fixed into the page's containing block and add scroll space). */}
      <div
        style={{ position: "fixed", top: -10000, left: -10000, opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <StoryCard ref={cardRef} persona={persona} axisResult={axisResult} logoDataUrl={logoDataUrl} headingDataUrl={headingDataUrl} personaImageDataUrl={cardPersona} />
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
