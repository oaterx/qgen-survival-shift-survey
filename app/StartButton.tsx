"use client";

import { useRouter } from "next/navigation";

export default function StartButton() {
  const router = useRouter();

  function handleStart() {
    sessionStorage.setItem("survey_entry", Date.now().toString());
    router.push("/survey");
  }

  return (
    <button
      onClick={handleStart}
      className="group relative flex items-center justify-center gap-2 w-full rounded-[12px]
        bg-qgen-signal text-white text-center font-ui font-bold tracking-wide
        shadow-[0_12px_32px_rgba(201,111,59,0.25)]
        transition-all duration-200 hover:bg-qgen-signal-deep hover:shadow-[0_16px_40px_rgba(201,111,59,0.32)]
        active:scale-[0.98]"
      style={{ height: 48, fontSize: 15 }}
    >
      เริ่มทำแบบสำรวจ
      <svg
        className="transition-transform duration-300 group-hover:translate-x-1"
        width="18" height="18" viewBox="0 0 18 18" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M3 9h11M10 4l5 5-5 5" />
      </svg>
    </button>
  );
}
