import StartButton from "./StartButton";
import QGenLogo from "../components/QGenLogo";

const AXES = [
  {
    id: "F",
    label: "Financial Security",
    labelTH: "ความมั่นคงทางการเงิน",
    border: "border-green-400",
    dot: "bg-green-400",
  },
  {
    id: "C",
    label: "Career Path",
    labelTH: "เส้นทางอาชีพ",
    border: "border-qgen-blue",
    dot: "bg-qgen-blue",
  },
  {
    id: "W",
    label: "Well-being",
    labelTH: "สุขภาพกายและใจ",
    border: "border-purple-400",
    dot: "bg-purple-400",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6">

      {/* Logo */}
      <header
        className="pt-12 pb-2 animate-fade-in"
        style={{ animationDelay: "0ms" }}
      >
        <QGenLogo height={40} />
      </header>

      {/* Gold accent line */}
      <div
        className="w-10 h-0.5 bg-qgen-gold rounded-full mt-6 mb-8 animate-fade-in"
        style={{ animationDelay: "80ms" }}
      />

      {/* Hero text */}
      <div
        className="text-center max-w-xs animate-fade-up"
        style={{ animationDelay: "150ms" }}
      >
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-qgen-blue mb-3">
          Workplace Survey
        </p>
        <h1 className="text-[2.6rem] font-extrabold text-qgen-dark leading-[1.1] tracking-tight mb-5">
          The Survival<br />Shift Survey
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          วัด 3 แกนหลักของชีวิตทำงาน<br />
          เพื่อรู้ว่าตอนนี้ยืนอยู่ตรงไหน
        </p>
      </div>

      {/* Axis rows */}
      <div
        className="w-full max-w-sm mt-10 flex flex-col gap-2.5 animate-fade-up"
        style={{ animationDelay: "250ms" }}
      >
        {AXES.map((axis) => (
          <div
            key={axis.id}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 border-l-[3px] ${axis.border} hover:bg-white hover:shadow-sm transition-all duration-200`}
          >
            <span className="font-black text-qgen-dark w-5 text-center text-base tracking-tight">
              {axis.id}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-zinc-700">{axis.label}</span>
              <span className="text-xs font-light text-zinc-400">{axis.labelTH}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div
        className="flex items-center gap-3 mt-6 animate-fade-in"
        style={{ animationDelay: "350ms" }}
      >
        {["15 คำถาม", "3–5 นาที", "ไม่ระบุตัวตน"].map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-light">{item}</span>
            {i < 2 && <span className="w-0.5 h-0.5 rounded-full bg-zinc-300" />}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className="w-full max-w-sm mt-8 mb-12 animate-fade-up"
        style={{ animationDelay: "400ms" }}
      >
        <StartButton />
      </div>

    </main>
  );
}
