import type { StatusId } from "../data/types";

export const STATUS_LABELS: Record<StatusId, { label: string; labelTH: string; color: string }> = {
  stable: { label: "Stable", labelTH: "ปลอดภัย", color: "green" },
  atRisk: { label: "At Risk", labelTH: "ตึง", color: "orange" },
  crisis: { label: "Critical", labelTH: "วิกฤต", color: "red" },
};

export function getStatusFromScore(score: number): StatusId {
  if (score >= 67) return "stable";
  if (score <= 33) return "crisis";
  return "atRisk";
}
