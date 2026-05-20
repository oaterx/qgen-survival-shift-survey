"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const el = document.createElement("input");
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full py-4 rounded-2xl bg-qgen-dark text-white font-semibold text-sm
        hover:bg-qgen-blue hover:shadow-lg hover:shadow-qgen-blue/20
        active:scale-[0.98]
        transition-all duration-300"
    >
      {copied ? "✓ คัดลอกลิงก์แล้ว" : "แชร์ผลลัพธ์"}
    </button>
  );
}
