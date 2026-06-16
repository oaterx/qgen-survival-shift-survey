import Image from "next/image";
import StartButton from "./StartButton";
import QGenLogo from "../components/QGenLogo";

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-qgen-paper px-6">

      {/* Logo */}
      <div className="mb-5">
        <QGenLogo height={56} />
      </div>

      {/* Title */}
      <div className="relative w-full max-w-[500px]" style={{ aspectRatio: "1022 / 356" }}>
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
        className="text-qgen-gray-ash text-center mt-4"
        style={{ fontSize: 14, lineHeight: "22px", maxWidth: 320 }}
      >
        จำลองหนึ่งวันของมนุษย์ออฟฟิศ เพื่อสำรวจว่าชีวิตคุณตอนนี้ติดขัดตรงไหน และควรดูแลจุดใดก่อน
      </p>

      {/* Meta strip */}
      <div
        className="flex items-stretch justify-center gap-2.5 mt-6 w-full max-w-sm"
        style={{ fontSize: 12 }}
      >
        {["18 คำถาม", "5–8 นาที", "ไม่ระบุตัวตน"].map((item) => (
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

    </main>
  );
}
