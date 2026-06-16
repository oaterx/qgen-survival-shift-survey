interface Props {
  label: string;
  text: string;
  selected?: boolean;
  onSelect?: () => void;
}

export default function OptionCard({ label, text, selected = false, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-selected={selected ? "true" : undefined}
      className="w-full text-left flex items-center gap-3 rounded-[12px] border bg-qgen-paper-alt
        transition-all duration-150 cursor-pointer active:scale-[0.99]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qgen-signal"
      style={{
        minHeight: 48,
        padding: "10px 16px",
        borderColor: selected ? "#C96F3B" : "#DDD9D0",
        borderWidth: selected ? 2 : 1,
        backgroundColor: selected ? "#F3E2D8" : undefined,
        boxShadow: selected ? "0 4px 16px rgba(201,111,59,0.12)" : "0 1px 4px rgba(10,10,10,0.04)",
      }}
    >
      {/* Letter badge — gray, no bg color */}
      <span
        className="flex-shrink-0 font-display font-bold"
        style={{
          fontSize: 14,
          width: 20,
          textAlign: "center",
          color: selected ? "#C96F3B" : "#6E6E6E",
          transition: "color 150ms",
        }}
      >
        {label}
      </span>

      {/* Divider */}
      <span
        className="flex-shrink-0"
        style={{ width: 1, height: 20, background: selected ? "rgba(201,111,59,0.3)" : "#DDD9D0" }}
      />

      {/* Text */}
      <span
        className="flex-1 font-normal"
        style={{
          fontSize: 13,
          lineHeight: "19px",
          color: "#1A1A1A",
          minWidth: 0,
          overflowWrap: "break-word",
        }}
      >
        {text}
      </span>
    </button>
  );
}
