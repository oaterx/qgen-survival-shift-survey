interface Props {
  value: number;
}

export default function SignalProgress({ value }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3 px-5 py-2.5">
      {/* 3px track */}
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 3, background: "#EAE6DD" }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "#C96F3B",
            borderRadius: 999,
            transition: "width 400ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
      {/* % label */}
      <span
        className="font-ui text-qgen-gray-ash flex-shrink-0 tabular-nums"
        style={{ fontSize: 11, minWidth: 32, textAlign: "right" }}
      >
        {Math.round(pct)}%
      </span>
    </div>
  );
}
