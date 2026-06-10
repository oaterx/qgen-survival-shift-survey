import { forwardRef } from "react";
import type { StatusId } from "../../data/types";

export type StoryPersona = {
  id: string;
  name: string;
  description: string;
  theme: string;
  tagline?: string;
};

export type StoryAxisResult = {
  roundedScore: number;
  status: StatusId;
};

type Props = {
  persona: StoryPersona;
  axisResult: Record<"F" | "C" | "W", StoryAxisResult>;
  logoDataUrl?: string;
};

const AXIS_TH: Record<string, string> = { F: "การเงิน", C: "อาชีพ", W: "สุขภาพ" };
const AXIS_EN: Record<string, string> = {
  F: "Financial Security",
  C: "Career Path",
  W: "Well-being",
};

const THEME_COLOR: Record<string, string> = {
  green:  "#4F9B45",
  orange: "#C96F3B",
  red:    "#E66A2C",
};

function scoreToColor(score: number): string {
  return `hsl(${(score * 1.2).toFixed(0)}, 68%, 42%)`;
}

function scoreLabel(score: number): string {
  if (score >= 67) return "Stable";
  if (score >= 33) return "At Risk";
  return "Crisis";
}

function scoreDescription(score: number): string {
  if (score >= 67) return "You're in a good place. Keep doing what works.";
  if (score >= 33) return "Early signs of pressure. Small adjustments can help.";
  return "High stress detected. Time to take action.";
}

const PAPER     = "#F7F6F3";
const PAPER_ALT = "#F0EDE8";
const BORDER    = "#E2DDD6";
const INK       = "#0A0A0A";
const INK_SOFT  = "#1C1C1C";
const ASH       = "#6E6E6E";

// Use embedded font family names so html-to-image picks them up
const THAI_FONT = "'Prompt', system-ui, sans-serif";
const NUM_FONT  = "'CardInter', 'Prompt', system-ui, sans-serif";

const StoryCard = forwardRef<HTMLDivElement, Props>(function StoryCard(
  { persona, axisResult, logoDataUrl },
  ref
) {
  const accent = THEME_COLOR[persona.theme] ?? "#C96F3B";

  const overallScore = Math.round(
    (axisResult.F.roundedScore + axisResult.C.roundedScore + axisResult.W.roundedScore) / 3
  );
  const overallColor = scoreToColor(overallScore);

  const sectionCard: React.CSSProperties = {
    background: PAPER_ALT,
    border: `1px solid ${BORDER}`,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
  };

  const sectionHeader: React.CSSProperties = {
    padding: "11px 20px",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: ASH,
    fontFamily: THAI_FONT,
  };

  return (
    <div
      ref={ref}
      style={{
        width: 540,
        minHeight: 960,
        background: PAPER,
        display: "flex",
        flexDirection: "column",
        fontFamily: THAI_FONT,
        padding: "0 0 48px",
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 32px 28px",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {logoDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logoDataUrl} alt="QGEN" style={{ height: 32, objectFit: "contain" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: INK, fontFamily: NUM_FONT }}>Q</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: accent, fontFamily: NUM_FONT }}>GEN</span>
          </div>
        )}
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: ASH, textTransform: "uppercase", marginTop: 8, fontFamily: THAI_FONT }}>
          The Survival Shift
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "24px 28px 0", flex: 1 }}>

        {/* Persona card */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Your Persona</div>
          <div style={{ padding: "20px 20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: INK, lineHeight: 1.2, marginBottom: 8, fontFamily: THAI_FONT }}>
              {persona.name}
            </div>
            {persona.tagline && (
              <div style={{ fontSize: 13, fontStyle: "italic", color: accent, marginBottom: 12, fontFamily: THAI_FONT }}>
                "{persona.tagline}"
              </div>
            )}
            <div style={{ fontSize: 12.5, color: ASH, lineHeight: 1.75, fontFamily: THAI_FONT }}>
              {persona.description}
            </div>
          </div>
        </div>

        {/* Your Survival Score card */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Your Survival Score</div>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            {/* SVG ring */}
            <svg width={100} height={100} viewBox="0 0 160 160" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="80" cy="80" r="62" stroke={BORDER} strokeWidth="12" />
              <circle
                cx="80" cy="80" r="62"
                stroke={overallColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${((overallScore / 100) * 389.6).toFixed(1)} ${(389.6 - (overallScore / 100) * 389.6).toFixed(1)}`}
                transform="rotate(-90 80 80)"
              />
              <text x="80" y="82" textAnchor="middle"
                fontFamily={NUM_FONT}
                fontSize="50" fontWeight="700" fill={INK}
                dominantBaseline="middle">
                {overallScore}
              </text>
              <text x="80" y="112" textAnchor="middle"
                fontFamily={NUM_FONT}
                fontSize="14" fill={ASH}>
                /100
              </text>
            </svg>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: overallColor, lineHeight: 1.2, fontFamily: NUM_FONT }}>
                {scoreLabel(overallScore)}
              </div>
              <div style={{ fontSize: 12, color: ASH, lineHeight: 1.65, marginTop: 6, maxWidth: 190, fontFamily: THAI_FONT }}>
                {scoreDescription(overallScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Axis Scores card */}
        <div style={sectionCard}>
          <div style={sectionHeader}>Axis Scores</div>
          <div>
            {(["F", "C", "W"] as const).map((axis, i) => {
              const r = axisResult[axis];
              const barColor = scoreToColor(r.roundedScore);
              return (
                <div
                  key={axis}
                  style={{
                    padding: "16px 20px",
                    borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: INK_SOFT, fontFamily: THAI_FONT }}>
                        {AXIS_EN[axis]}
                      </span>
                      <span style={{ fontSize: 12, color: ASH, marginLeft: 7, fontFamily: THAI_FONT }}>
                        {AXIS_TH[axis]}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 26, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums", fontFamily: NUM_FONT }}>
                        {r.roundedScore}
                        <span style={{ fontSize: 12, fontWeight: 400, color: ASH, marginLeft: 1, fontFamily: NUM_FONT }}>%</span>
                      </span>
                      <div style={{
                        padding: "3px 10px", borderRadius: 100,
                        backgroundColor: barColor,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: NUM_FONT }}>
                          {scoreLabel(r.roundedScore)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 5, background: BORDER, borderRadius: 3 }}>
                    <div style={{
                      height: "100%", width: `${r.roundedScore}%`,
                      background: barColor, borderRadius: 3,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
});

export default StoryCard;
