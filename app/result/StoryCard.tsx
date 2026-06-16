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
  headingDataUrl?: string;
  personaImageDataUrl?: string;
};

const THEME_COLOR: Record<string, string> = {
  green:  "#4F9B45",
  orange: "#C96F3B",
  red:    "#E66A2C",
};

const PAPER     = "#F7F6F3";
const INK       = "#0A0A0A";
const ASH       = "#6E6E6E";

// Use embedded font family names so html-to-image picks them up
const THAI_FONT = "'Prompt', system-ui, sans-serif";
const NUM_FONT  = "'CardInter', 'Prompt', system-ui, sans-serif";

const StoryCard = forwardRef<HTMLDivElement, Props>(function StoryCard(
  { persona, logoDataUrl, headingDataUrl, personaImageDataUrl },
  ref
) {
  const accent = THEME_COLOR[persona.theme] ?? "#C96F3B";

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
      {/* ── Header + Content (single layer, centered) ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "32px 24px",
        }}
      >
        {logoDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logoDataUrl} alt="QGEN" style={{ height: 46, objectFit: "contain", marginBottom: 14 }} />
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 14 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: INK, fontFamily: NUM_FONT }}>Q</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: accent, fontFamily: NUM_FONT }}>GEN</span>
          </div>
        )}
        {headingDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={headingDataUrl}
            alt="The Office Survivor"
            style={{ width: 338, height: 117, objectFit: "contain", marginBottom: 36 }}
          />
        ) : (
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.22em", color: accent, textTransform: "uppercase", marginBottom: 36, fontFamily: THAI_FONT }}>
            The Office Survivor
          </div>
        )}
        {personaImageDataUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={personaImageDataUrl}
            alt={persona.name}
            style={{ width: 280, height: 373, objectFit: "contain", marginBottom: 26 }}
          />
        )}
        <div style={{ fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2, marginBottom: 12, fontFamily: THAI_FONT, whiteSpace: "pre-line" }}>
          &ldquo;{persona.name}&rdquo;
        </div>
        <div style={{ width: 72, height: 3, borderRadius: 2, background: accent, marginBottom: 18 }} />
        <div style={{ fontSize: 14.5, color: ASH, lineHeight: 1.8, fontFamily: THAI_FONT, maxWidth: 360 }}>
          {persona.description}
        </div>
      </div>
    </div>
  );
});

export default StoryCard;
