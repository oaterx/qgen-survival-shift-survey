"use client";

import { useState } from "react";

export default function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "The Survival Shift — ผลลัพธ์ของฉัน", url });
      } catch {
        // user cancelled
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          คัดลอกลิ้งค์แล้ว
        </>
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
          แชร์ผลลัพธ์เป็นลิ้งค์
        </>
      )}
    </button>
  );
}
