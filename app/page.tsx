import Image from "next/image";
import StartButton from "./StartButton";
import QGenLogo from "../components/QGenLogo";

export default function LandingPage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col items-center bg-qgen-paper px-6 pt-16 sm:pt-12 pb-6">

      {/* Top group — grows to fill, content centered within it */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">

      {/* Logo */}
      <div className="mb-5">
        <QGenLogo height={56} />
      </div>

      {/* Title */}
      <div className="relative w-full max-w-[500px] mt-2" style={{ aspectRatio: "1022 / 356" }}>
        <Image
          src="/Element/Heading.png"
          alt="The Office Survivor — มนุษย์ออฟฟิศต้องรอด"
          fill
          className="object-contain"
          sizes="500px"
          priority
        />
      </div>

      {/* Description */}
      <p
        className="text-qgen-gray-ash text-center mt-6"
        style={{ fontSize: 14, lineHeight: "22px", maxWidth: 320 }}
      >
        แบบทดสอบนี้จะพาคุณไปหาคำตอบว่า
        <br />
        &ldquo;คุณเป็นมนุษย์ออฟฟิศประเภทไหน&rdquo;
        <br />
        จาก 13 Personas ที่ทาง QGEN ออกแบบขึ้นมา
      </p>

      {/* Meta strip */}
      <div
        className="flex items-stretch justify-center gap-2.5 mt-6 w-full max-w-sm"
        style={{ fontSize: 12 }}
      >
        {["18 คำถาม", "8–10 นาที"].map((item) => (
          <span
            key={item}
            className="flex-1 flex items-center justify-center rounded-xl border border-qgen-gray-border bg-qgen-paper-alt
              font-ui text-qgen-gray-ash text-center"
            style={{ padding: "8px 6px" }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm mt-2">
        <StartButton />
      </div>

      </div>

      {/* Footer link — pinned to bottom */}
      <div className="w-full max-w-sm pt-4 border-t border-qgen-gray-border text-center">
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
