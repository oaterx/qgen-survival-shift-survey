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
      className="relative w-full cursor-pointer transition-transform duration-150 ease-out"
      style={{
        aspectRatio: "1672 / 941",
        maxHeight: 130,
        transform: pressed ? "scale(1.1)" : undefined,
      }}
    >
      <Image
        src="/Element/ปุ่ม Start.png"
        alt="เริ่มทำแบบสำรวจ"
        fill
        className={`object-contain animate-start-bounce transition-all duration-150 ease-out
          ${pressed
            ? "drop-shadow-[0_16px_30px_rgba(150,73,28,1)]"
            : "hover:scale-105 hover:drop-shadow-[0_12px_24px_rgba(150,73,28,0.9)] active:scale-110 active:drop-shadow-[0_16px_30px_rgba(150,73,28,1)]"}`}
        sizes="400px"
        priority
      />
    </button>
  );
}
