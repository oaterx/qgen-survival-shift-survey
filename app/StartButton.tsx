"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function StartButton() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  function handleStart() {
    setPressed(true);
    sessionStorage.setItem("survey_entry", Date.now().toString());
    setTimeout(() => router.push("/survey"), 180);
  }

  return (
    <button
      onClick={handleStart}
      aria-label="เริ่มทำแบบสำรวจ"
      className="relative w-full cursor-pointer"
      style={{ aspectRatio: "1672 / 941", maxHeight: 130 }}
    >
      <Image
        src="/Element/ปุ่ม Start.png"
        alt="เริ่มทำแบบสำรวจ"
        fill
        className={`object-contain transition-all duration-150 ease-out
          ${pressed
            ? "scale-110 drop-shadow-[0_16px_30px_rgba(150,73,28,1)]"
            : "animate-start-bounce hover:drop-shadow-[0_12px_24px_rgba(150,73,28,0.9)] active:scale-105 active:drop-shadow-[0_16px_30px_rgba(150,73,28,1)]"
          }`}
        sizes="400px"
        priority
      />
    </button>
  );
}
