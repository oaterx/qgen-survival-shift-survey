"use client";

import { useEffect, useState } from "react";

const CIRCUMFERENCE = 389.6; // 2π × r(62)

interface Props {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 160 }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fill = animated ? (score / 100) * CIRCUMFERENCE : 0;
  const gap = CIRCUMFERENCE - fill;
  const color = `hsl(${(score * 1.2).toFixed(0)}, 68%, 42%)`;
  const scale = size / 160;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="80" cy="80" r="62" stroke="#EAE6DD" strokeWidth="12" />
      <circle
        cx="80" cy="80" r="62"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${fill.toFixed(1)} ${gap.toFixed(1)}`}
        transform="rotate(-90 80 80)"
        style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text
        x="80" y="82"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize={Math.round(50 * scale)}
        fontWeight="700"
        fill="#0A0A0A"
        dominantBaseline="middle"
      >
        {score}
      </text>
      <text
        x="80" y="112"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="14"
        fill="#6E6E6E"
      >
        /100
      </text>
    </svg>
  );
}
