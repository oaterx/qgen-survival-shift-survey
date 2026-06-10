"use client";

import { useEffect, useState } from "react";

interface Props {
  score: number;
  delay?: number;
}

export default function ScoreBar({ score, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const color = `hsl(${(score * 1.2).toFixed(0)}, 68%, 42%)`;

  return (
    <div className="w-full h-1.5 bg-qgen-paper-wash/60 rounded-full overflow-hidden mt-2.5">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
