import StartButton from "./StartButton";
import QGenLogo from "../components/QGenLogo";

const AXES = [
  { label: "Financial\nSecurity" },
  { label: "Career Path" },
  { label: "Well-being" },
];

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-qgen-paper px-6">

      {/* Logo */}
      <div className="mb-7">
        <QGenLogo height={44} />
      </div>

      {/* Title */}
      <h1
        className="font-display font-bold text-qgen-black-absolute text-center whitespace-nowrap"
        style={{ fontSize: "clamp(28px, 8vw, 42px)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
      >
        The Survival Shift
      </h1>

      {/* Description */}
      <p
        className="text-qgen-gray-ash text-center mt-4"
        style={{ fontSize: 14, lineHeight: "22px", maxWidth: 320 }}
      >
        วัด 3 แกนหลักของชีวิตทำงาน เพื่อรู้ว่าตอนนี้ชีวิตคุณอยู่ที่จุดไหน
      </p>

      {/* 3 axis boxes — equal height, items-stretch */}
      <div className="w-full max-w-sm mt-7 flex gap-2.5 items-stretch">
        {AXES.map((axis, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center rounded-xl border border-qgen-gray-border bg-qgen-paper-alt"
            style={{
              padding: "10px 6px",
              boxShadow: "0 2px 8px rgba(10,10,10,0.04)",
            }}
          >
            <span
              className="font-ui font-semibold text-qgen-black-soft text-center whitespace-pre-line"
              style={{ fontSize: 12, lineHeight: "17px" }}
            >
              {axis.label}
            </span>
          </div>
        ))}
      </div>

      {/* Meta strip */}
      <div className="flex items-center gap-4 mt-6" style={{ fontSize: 12 }}>
        {["18 คำถาม", "5–8 นาที", "ไม่ระบุตัวตน"].map((item, i) => (
          <span key={i} className="flex items-center gap-4">
            <span className="font-ui text-qgen-gray-ash">{item}</span>
            {i < 2 && <span className="w-[3px] h-[3px] rounded-full bg-qgen-gray-border" />}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full max-w-sm mt-7">
        <StartButton />
      </div>

    </main>
  );
}
