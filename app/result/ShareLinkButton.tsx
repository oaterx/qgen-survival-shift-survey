"use client";

import { useState } from "react";

// Fallback for browsers/contexts where the async Clipboard API throws
// (permission denied, insecure context, older WebView, etc.) — uses the
// older execCommand path via a temporary off-screen textarea.
function copyWithFallback(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function ShareLinkButton() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    setError(false);

    if (navigator.share) {
      try {
        await navigator.share({ title: "The Office Survivor — ผลลัพธ์ของฉัน", url });
        return;
      } catch (err) {
        // AbortError = user cancelled the native share sheet — not a failure.
        if (err instanceof Error && err.name === "AbortError") return;
        // Otherwise fall through and try clipboard copy instead.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    } catch {
      // Clipboard API blocked (permission denied / insecure context) — fall back.
    }

    if (copyWithFallback(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full py-3.5 rounded-2xl border border-qgen-gray-border
        font-ui font-semibold text-qgen-black-soft text-sm
        hover:bg-qgen-paper-alt active:scale-[0.98] transition-all duration-200
        flex items-center justify-center gap-2"
    >
      {copied ? (
        <>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8l4 4 8-8" />
          </svg>
          คัดลอกลิงก์แล้ว
        </>
      ) : error ? (
        <span className="text-qgen-signal-deep">คัดลอกไม่สำเร็จ ลองอีกครั้ง</span>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="3" r="1.5" />
            <circle cx="12" cy="13" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <line x1="10.55" y1="4.22" x2="5.45" y2="6.78" />
            <line x1="10.55" y1="11.78" x2="5.45" y2="9.22" />
          </svg>
          แชร์ผลลัพธ์
        </>
      )}
    </button>
  );
}
