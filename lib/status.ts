import type { StatusId } from "../data/types";

export const STATUS_LABELS: Record<StatusId, {
  label: string; labelTH: string; color: string;
  description: string; descriptionTH: string;
  range: string;
}> = {
  stable: {
    label: "Stable", labelTH: "ปลอดภัย", color: "#4F9B45",
    range: "67–100",
    description: "You're in a good place. Keep doing what works.",
    descriptionTH: "คุณอยู่ในจุดที่ดี รักษาสิ่งที่ได้ผลไว้",
  },
  atRisk: {
    label: "At Risk", labelTH: "ตึง", color: "#E1A300",
    range: "34–66",
    description: "Early signs of pressure. Small changes can help.",
    descriptionTH: "มีสัญญาณแรกของแรงกดดัน การปรับเล็กน้อยช่วยได้",
  },
  crisis: {
    label: "Crisis", labelTH: "วิกฤต", color: "#E66A2C",
    range: "0–33",
    description: "Stress is affecting your flow. Time to reset.",
    descriptionTH: "ความเครียดกำลังกระทบการทำงาน ถึงเวลาปรับตัว",
  },
};

export function getStatusFromScore(score: number): StatusId {
  if (score >= 67) return "stable";
  if (score >= 34) return "atRisk";
  return "crisis";
}
