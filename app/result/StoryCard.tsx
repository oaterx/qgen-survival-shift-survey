import { forwardRef } from "react";

export type StoryPersona = {
  id: string;
  name: string;
  description: string;
  theme: string;
};

export type StoryAxisResult = {
  roundedScore: number;
  status: "stable" | "atRisk" | "crisis";
};

type Props = {
  persona: StoryPersona;
  axisResult: Record<"F" | "C" | "W", StoryAxisResult>;
};

const AXIS_TH: Record<string, string> = { F: "การเงิน", C: "อาชีพ", W: "สุขภาพ" };
const AXIS_EN: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};
const STATUS_COLOR: Record<string, string> = {
  stable: "#22c55e",
  atRisk: "#f97316",
  crisis: "#ef4444",
};
const STATUS_LABEL: Record<string, string> = {
  stable: "Stable",
  atRisk: "At Risk",
  crisis: "Critical",
};
const THEME_COLOR: Record<string, string> = {
  green:  "#22c55e",
  orange: "#f97316",
  red:    "#ef4444",
  purple: "#a855f7",
};

const StoryCard = forwardRef<HTMLDivElement, Props>(function StoryCard(
  { persona, axisResult },
  ref
) {
  const accent = THEME_COLOR[persona.theme] ?? "#1c5fa6";

  return (
    <div
      ref={ref}
      style={{
        width: 540,
        height: 960,
        background: "linear-gradient(155deg, #0d1624 0%, #1b2843 55%, #0d1624 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Prompt', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft glow behind persona name area */}
      <div style={{
        position: "absolute",
        top: 160,
        left: -60,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* ── Header ── */}
      <div style={{ padding: "52px 48px 0", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Inline QGEN logo — works without external image */}
        <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: 1 }}>Q</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#1c5fa6", letterSpacing: 1 }}>GEN</span>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#f5b31b", lineHeight: 1, marginTop: 2 }}>·</span>
      </div>
      <div style={{ padding: "8px 48px 0", fontSize: 10, letterSpacing: "0.18em", color: "#475569", textTransform: "uppercase" }}>
        The Survival Shift Survey
      </div>

      {/* Divider */}
      <div style={{ margin: "28px 48px 0", height: 1, background: "rgba(255,255,255,0.07)" }} />

      {/* ── Persona section ── */}
      <div style={{ padding: "32px 48px 0" }}>
        {/* Chip */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 14px",
          borderRadius: 100,
          background: `${accent}1a`,
          border: `1px solid ${accent}40`,
          marginBottom: 18,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: accent, textTransform: "uppercase" }}>
            Persona #{persona.id}
          </span>
        </div>

        {/* Name */}
        <div style={{ fontSize: 38, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 18 }}>
          {persona.name}
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, fontWeight: 300, color: "#94a3b8", lineHeight: 1.8, maxWidth: 420 }}>
          {persona.description}
        </div>
      </div>

      {/* ── Score bars ── */}
      <div style={{ padding: "44px 48px 0" }}>
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.16em",
          color: "#475569",
          textTransform: "uppercase",
          marginBottom: 22,
        }}>
          Axis Scores
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {(["F", "C", "W"] as const).map((axis) => {
            const r = axisResult[axis];
            const barColor = STATUS_COLOR[r.status];
            return (
              <div key={axis}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{AXIS_TH[axis]}</span>
                    <span style={{ fontSize: 11, fontWeight: 300, color: "#475569", marginLeft: 8 }}>{AXIS_EN[axis]}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "white", fontVariantNumeric: "tabular-nums" }}>
                      {r.roundedScore}
                      <span style={{ fontSize: 11, fontWeight: 300, color: "#475569", marginLeft: 2 }}>%</span>
                    </span>
                    <div style={{
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: `${barColor}1a`,
                      border: `1px solid ${barColor}40`,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>{STATUS_LABEL[r.status]}</span>
                    </div>
                  </div>
                </div>
                {/* Track */}
                <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%",
                    width: `${r.roundedScore}%`,
                    background: barColor,
                    borderRadius: 2,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom branding ── */}
      <div style={{ padding: "0 48px 52px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 22 }} />
        <div style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>ลองทำแบบสำรวจของคุณ</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b", letterSpacing: "0.04em" }}>
          survivalshift.qgen.co
        </div>
      </div>
    </div>
  );
});

export default StoryCard;
