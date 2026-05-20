type Props = {
  gender?: "male" | "female" | "unspecified";
  width?: number;
};

const SKIN = "#e8b49a";
const PANTS = "#1f2937";
const SHOE = "#111827";
const BAG = "#111827";
const HARDWARE = "#9ca3af";

export default function WalkingCharacter({ gender = "unspecified", width = 26 }: Props) {
  const female = gender === "female";
  // viewBox "0 0 46 84" → aspect ratio 84/46
  const height = Math.round(width * 84 / 46);

  const hairColor = female ? "#7b4429" : "#1a1a1a";
  const topColor  = female ? "#f2f2f2" : "#bfdbfe";

  return (
    <svg
      viewBox="0 0 46 84"
      width={width}
      height={height}
      overflow="visible"
      aria-hidden="true"
    >
      <g className="walk-bounce">

        {/* ── HEAD ── */}
        <ellipse cx="32" cy="10" rx="9" ry="10" fill={SKIN} />

        {/* ── HAIR ── */}
        {female ? (
          /* Brown bob — covers top + back, tapers at jaw */
          <path
            d="M23 13 Q22 1 32 1 Q41 1 41 10 Q41 17 39 20 Q34 23 30 21 Q24 19 23 22 Q22 18 23 13 Z"
            fill={hairColor}
          />
        ) : (
          /* Black short cap — sits on top, swept slightly */
          <path
            d="M24 10 Q23 1 32 1 Q41 1 41 10 Q39 7 34 5 Q28 4 24 8 Z"
            fill={hairColor}
          />
        )}

        {/* ── NECK ── */}
        <rect x="29" y="19" width="5" height="5" rx="1" fill={SKIN} />

        {/* ── BACK ARM — pivot at back shoulder (19, 26) ── */}
        <g className="walk-arm-l" style={{ transformOrigin: "19px 26px" }}>
          <line
            x1="19" y1="26" x2="15" y2="40"
            stroke={SKIN} strokeWidth="3.5" strokeLinecap="round"
          />
        </g>

        {/* ── TORSO ── */}
        <path
          d="M19 24 Q18 26 18 48 Q24 52 30 51 Q35 49 35 24 Q31 21 25 22 Z"
          fill={topColor}
        />

        {/* Collar (both) */}
        <path d="M28 22 L31 26 L29.5 23 Z" fill="white" />
        <path d="M31 22 L28 25 L29.5 23 Z" fill="white" />

        {/* Tie (male only) */}
        {!female && (
          <path
            d="M29.5 23 L28.5 38 L30 41 L31.5 38 L30.5 23 Z"
            fill="#1e3a8a"
          />
        )}

        {/* ── FRONT ARM + BAG — pivot at front shoulder (35, 26) ── */}
        <g className="walk-arm-r" style={{ transformOrigin: "35px 26px" }}>
          <line
            x1="35" y1="26" x2="38" y2="40"
            stroke={SKIN} strokeWidth="3.5" strokeLinecap="round"
          />
          {female ? (
            /* Rounded handbag */
            <>
              <rect x="34" y="40" width="9" height="7" rx="2" fill={BAG} />
              <path
                d="M36 40 Q38.5 37 41 40"
                fill="none" stroke="#2d2d2d" strokeWidth="1.2" strokeLinecap="round"
              />
              <rect x="36" y="43.5" width="1.6" height="1" rx="0.3" fill={HARDWARE} />
              <rect x="38" y="43.5" width="1.6" height="1" rx="0.3" fill={HARDWARE} />
            </>
          ) : (
            /* Flat briefcase */
            <>
              <rect x="34" y="40" width="10" height="8" rx="1" fill={BAG} />
              <path
                d="M36 40 Q39 37.5 42 40"
                fill="none" stroke="#2d2d2d" strokeWidth="1.2" strokeLinecap="round"
              />
              <rect x="38" y="43.5" width="2" height="1" rx="0.3" fill={HARDWARE} />
            </>
          )}
        </g>

        {/* ── CLOTHING BOTTOM ── */}
        {female ? (
          /* A-line skirt, waist to mid-thigh */
          <path
            d="M18 48 Q19 64 24 66 L30 66 Q35 64 34 48 Q30 51 24 51 Z"
            fill="#1a1a1a"
          />
        ) : (
          /* Belt only — legs drawn separately below */
          <rect x="18" y="47" width="17" height="2.5" rx="0.5" fill="#0d0d0d" />
        )}

        {/* ── LEGS ── */}
        {female ? (
          <>
            {/* Back leg — skin tone, pivot at back hip (24, 65) */}
            <g className="walk-leg-l" style={{ transformOrigin: "24px 65px" }}>
              <line
                x1="24" y1="65" x2="22" y2="77"
                stroke={SKIN} strokeWidth="4.5" strokeLinecap="round"
              />
              {/* Heel shoe — platform + post */}
              <rect x="19" y="76" width="6" height="2" rx="0.8" fill={SHOE} />
              <rect x="19" y="78" width="1.5" height="3.5" rx="0.5" fill={SHOE} />
            </g>
            {/* Front leg — pivot at front hip (28, 65) */}
            <g className="walk-leg-r" style={{ transformOrigin: "28px 65px" }}>
              <line
                x1="28" y1="65" x2="30" y2="77"
                stroke={SKIN} strokeWidth="4.5" strokeLinecap="round"
              />
              <rect x="27" y="76" width="6" height="2" rx="0.8" fill={SHOE} />
              <rect x="29" y="78" width="1.5" height="3.5" rx="0.5" fill={SHOE} />
            </g>
          </>
        ) : (
          <>
            {/* Back leg — dark pants, pivot at back hip (22, 50) */}
            <g className="walk-leg-l" style={{ transformOrigin: "22px 50px" }}>
              <line
                x1="22" y1="50" x2="20" y2="76"
                stroke={PANTS} strokeWidth="5.5" strokeLinecap="round"
              />
              <ellipse cx="19" cy="77" rx="4.5" ry="2" fill={SHOE} />
            </g>
            {/* Front leg — pivot at front hip (28, 50) */}
            <g className="walk-leg-r" style={{ transformOrigin: "28px 50px" }}>
              <line
                x1="28" y1="50" x2="30" y2="76"
                stroke={PANTS} strokeWidth="5.5" strokeLinecap="round"
              />
              <ellipse cx="31" cy="77" rx="5" ry="2" fill={SHOE} />
            </g>
          </>
        )}

      </g>
    </svg>
  );
}
