"use client";

import { useEffect, useState } from "react";

const BAR_COLOR: Record<string, string> = {
  stable: "bg-green-500",
  atRisk: "bg-orange-500",
  crisis: "bg-red-500",
};

interface Props {
  score: number;
  status: "stable" | "atRisk" | "crisis";
  delay?: number;
}

export default function ScoreBar({ score, status, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mt-2.5">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${BAR_COLOR[status]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
