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
      className="group relative block w-full py-4 rounded-2xl bg-qgen-dark text-white text-center font-semibold text-base overflow-hidden transition-all duration-300 hover:bg-qgen-blue hover:shadow-lg hover:shadow-qgen-blue/20 active:scale-[0.98]"
    >
      เริ่มทำแบบสอบถาม
    </button>
  );
}
