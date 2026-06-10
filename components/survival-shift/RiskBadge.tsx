import type { StatusId } from "../../data/types";

const STATUS_STYLE: Record<StatusId, { bg: string; text: string; border: string }> = {
  stable:          { bg: "bg-qgen-status-stable/10",           text: "text-qgen-status-stable",          border: "border-qgen-status-stable/30" },
  atRisk:          { bg: "bg-qgen-signal-soft",                text: "text-qgen-signal-deep",             border: "border-qgen-signal/30" },
  crisisVisible:   { bg: "bg-qgen-status-crisis-visible/10",   text: "text-qgen-status-crisis-visible",   border: "border-qgen-status-crisis-visible/30" },
  emerging:        { bg: "bg-qgen-status-emerging/10",         text: "text-qgen-status-emerging",         border: "border-qgen-status-emerging/30" },
  deepeningSevere: { bg: "bg-qgen-status-deepening-severe/10", text: "text-qgen-status-deepening-severe", border: "border-qgen-status-deepening-severe/30" },
};

interface Props {
  status: StatusId;
  label: string;
  className?: string;
}

export default function RiskBadge({ status, label, className = "" }: Props) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-ui text-xs font-bold ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
