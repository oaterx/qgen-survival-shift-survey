"use client";

import { useState } from "react";

const SURVEY_URL = "https://qgen.co/en/the-office-survivor";

export default function ShareSurveyButton() {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const title = "The Office Survivor — มนุษย์ออฟฟิศต้องรอด";

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: SURVEY_URL }).catch(() => {});
      return;
    }

    // Desktop fallback: copy to clipboard
    navigator.clipboard?.writeText(SURVEY_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <button
      onClick={handleShare}
      className="w-full py-3.5 rounded-2xl border border-qgen-gray-border
        font-ui font-semibold text-qgen-black-soft text-sm text-center
        hover:bg-qgen-paper-alt active:scale-[0.98] transition-all duration-200
        flex items-center justify-center gap-1.5"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8l4 4 8-8" />
          </svg>
          คัดลอกแล้ว
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="3" r="1.5" />
            <circle cx="12" cy="13" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <line x1="10.55" y1="4.22" x2="5.45" y2="6.78" />
            <line x1="10.55" y1="11.78" x2="5.45" y2="9.22" />
          </svg>
          แชร์แบบทดสอบ
        </>
      )}
    </button>
  );
}
