interface Props {
  rightLabel?: string;
  current?: number;
  currentEnd?: number;
  total?: number;
}

export default function SignalTopBar({ rightLabel, current, currentEnd, total }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const right =
    rightLabel !== undefined
      ? rightLabel
      : current !== undefined && total !== undefined
        ? currentEnd !== undefined
          ? `${pad(current)} – ${pad(currentEnd)} / ${pad(total)}`
          : `${pad(current)} / ${pad(total)}`
        : "";

  return (
    <header
      className="flex items-center justify-between px-5 bg-qgen-paper border-b border-qgen-gray-border"
      style={{ height: 44 }}
    >
      <div className="flex items-center gap-2.5">
        <img
          src="/Logo QGEN Black.png"
          alt="QGEN"
          style={{ height: 18, width: "auto" }}
        />
        <span
          className="font-ui font-bold text-qgen-black-soft"
          style={{ fontSize: 12.5, letterSpacing: "0.01em" }}
        >
          The Survival Shift
        </span>
      </div>
      {right && (
        <span
          className="font-ui text-qgen-gray-ash tabular-nums"
          style={{ fontSize: 12, letterSpacing: "0.06em" }}
        >
          {right}
        </span>
      )}
    </header>
  );
}
