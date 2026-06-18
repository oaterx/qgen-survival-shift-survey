import Image from "next/image";
import StartButton from "./StartButton";
import QGenLogo from "../components/QGenLogo";
import ScrollLock from "./ScrollLock";

export default function LandingPage() {
  return (
    <main className="h-dvh overflow-hidden flex flex-col items-center bg-qgen-paper px-6 pt-6 pb-4">
      <ScrollLock />

      {/* Main content — centered vertically, gaps instead of fixed margins */}
      <div className="flex-1 flex flex-col items-center justify-center w-full gap-3 sm:gap-2">

        <QGenLogo height={90} />

        {/* Title */}
        <div className="relative w-full max-w-[340px] sm:max-w-[420px]" style={{ aspectRatio: "1022 / 356" }}>
          <Image
            src="/Element/Heading.png"
            alt="The Office Survivor — มนุษย์ออฟฟิศต้องรอด"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 340px, 420px"
            priority
          />
        </div>

        {/* Description */}
        <p
          className="text-qgen-gray-ash text-center"
          style={{ fontSize: 13.5, lineHeight: "21px", maxWidth: 300 }}
        >
          แบบทดสอบนี้จะพาคุณไปหาคำตอบว่า
          <br />
          &ldquo;คุณเป็นมนุษย์ออฟฟิศประเภทไหน&rdquo;
          <br />
          จาก 13 Personas ที่ทาง QGEN ออกแบบขึ้นมา
        </p>

        {/* Meta strip */}
        <div
          className="flex items-stretch justify-center gap-2.5 w-full max-w-sm"
          style={{ fontSize: 12 }}
        >
          {["18 คำถาม", "5–8 นาที"].map((item) => (
            <span
              key={item}
              className="flex-1 flex items-center justify-center rounded-xl border border-qgen-gray-border bg-qgen-paper-alt
                font-ui text-qgen-gray-ash text-center"
              style={{ padding: "7px 6px" }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full max-w-sm">
          <StartButton />
        </div>

      </div>

      {/* Footer — pinned to bottom */}
      <div className="w-full max-w-sm pt-3 border-t border-qgen-gray-border text-center shrink-0">
        <span className="font-ui text-qgen-gray-ash/70" style={{ fontSize: 11, fontWeight: 300 }}>
          Visit us at{" "}
        </span>
        <a
          href="https://qgen.co"
          target="_blank"
          rel="noopener noreferrer"
          className="font-ui text-qgen-black-soft underline transition-colors duration-150 hover:text-qgen-signal"
          style={{ fontSize: 11, fontWeight: 300 }}
        >
          https://qgen.co
        </a>
      </div>

    </main>
  );
}
