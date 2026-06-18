"use client";

import { useState } from "react";

export default function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  function copyText(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => execCopy(text));
    } else {
      execCopy(text);
    }
  }

  function execCopy(text: string) {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function handleShare() {
    const url = window.location.href;
    const shareData = { title: "The Office Survivor — มนุษย์ออฟฟิศต้องรอด", url };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      navigator.share(shareData).catch((err) => {
        if (err?.name !== "AbortError") copyText(url);
      });
      return;
    }
    copyText(url);
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
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="9" width="3" height="6" rx="0.5" />
            <rect x="6" y="5" width="3" height="10" rx="0.5" />
            <rect x="11" y="1" width="3" height="14" rx="0.5" />
          </svg>
          แชร์ลิงก์ผลลัพธ์
        </>
      )}
    </button>
  );
}
