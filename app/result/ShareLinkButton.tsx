"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

function ShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const copy = () => {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.cssText = "position:fixed;top:-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        return true;
      } catch { return false; }
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(copy);
    } else {
      copy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[300px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(247,246,243,0.97)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3.5 text-center border-b border-qgen-gray-border">
          <p className="font-ui font-semibold text-qgen-black-soft" style={{ fontSize: 14 }}>
            แชร์ลิงก์ผลลัพธ์
          </p>
        </div>
        <div className="flex flex-col divide-y divide-qgen-gray-border">
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 font-ui font-medium text-qgen-black-soft text-center
              hover:bg-qgen-paper-alt active:bg-qgen-paper-wash transition-colors duration-150
              flex items-center justify-center gap-2"
            style={{ fontSize: 14 }}
          >
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#06C755"/>
              <path d="M33 18.5C33 12.7 27.1 8 20 8S7 12.7 7 18.5c0 5.2 4.6 9.6 10.8 10.4.4.1 1 .3 1.1.7.1.4 0 .9 0 .9l-.2 1.1c-.1.4-.4 1.5 1.3.8 1.7-.7 9.1-5.4 12.5-9.2C32.3 21.9 33 20.3 33 18.5z" fill="white"/>
            </svg>
            แชร์ไปยัง LINE
          </a>
          <button
            onClick={copyLink}
            className="w-full py-3.5 font-ui font-medium text-qgen-black-soft text-center
              hover:bg-qgen-paper-alt active:bg-qgen-paper-wash transition-colors duration-150
              flex items-center justify-center gap-2"
            style={{ fontSize: 14 }}
          >
            {copied ? (
              <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8l4 4 8-8" /></svg>คัดลอกแล้ว</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="9" height="12" rx="1.5"/><path d="M2 5v9a1.5 1.5 0 001.5 1.5H11"/></svg>คัดลอกลิงก์</>
            )}
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-4 font-ui text-white/70 text-sm active:text-white transition-colors"
      >
        ยกเลิก
      </button>
    </div>,
    document.body
  );
}

export default function ShareLinkButton({ url }: { url: string }) {
  const [showModal, setShowModal] = useState(false);

  function handleShare() {
    if (window === window.parent && navigator.share) {
      navigator.share({ title: "The Office Survivor — ผลลัพธ์ของฉัน", url })
        .catch((err) => {
          if (!(err instanceof Error && err.name === "AbortError")) {
            setShowModal(true);
          }
        });
      return;
    }
    setShowModal(true);
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full py-3.5 rounded-2xl border border-qgen-gray-border
          font-ui font-semibold text-qgen-black-soft text-sm
          hover:bg-qgen-paper-alt active:scale-[0.98] transition-all duration-200
          flex items-center justify-center gap-2"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="9" width="3" height="6" rx="0.5" />
          <rect x="6" y="5" width="3" height="10" rx="0.5" />
          <rect x="11" y="1" width="3" height="14" rx="0.5" />
        </svg>
        แชร์ลิงก์ผลลัพธ์
      </button>
      {showModal && <ShareModal url={url} onClose={() => setShowModal(false)} />}
    </>
  );
}
