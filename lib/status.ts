import type { StatusId } from "../data/types";

export const STATUS_LABELS: Record<StatusId, {
  label: string; labelTH: string; color: string;
  description: string; descriptionTH: string;
  range: string;
}> = {
  stable: {
    label: "Stable", labelTH: "ปลอดภัย", color: "#4F9B45",
    range: "80–100",
    description: "You're in a good place. Keep doing what works.",
    descriptionTH: "คุณอยู่ในจุดที่ดี รักษาสิ่งที่ได้ผลไว้",
  },
  atRisk: {
    label: "At Risk", labelTH: "ตึง", color: "#E1A300",
    range: "60–79",
    description: "Early signs of pressure. Small changes can help.",
    descriptionTH: "มีสัญญาณแรกของแรงกดดัน การปรับเล็กน้อยช่วยได้",
  },
  crisisVisible: {
    label: "Crisis or Visible", labelTH: "วิกฤต", color: "#E66A2C",
    range: "40–59",
    description: "Stress is affecting your flow. Time to reset.",
    descriptionTH: "ความเครียดกำลังกระทบการทำงาน ถึงเวลาปรับตัว",
  },
  emerging: {
    label: "Emerging", labelTH: "สัญญาณแรก", color: "#D9471E",
    range: "20–39",
    description: "High stress is taking a toll. Action is essential.",
    descriptionTH: "แรงกดดันสูงกำลังส่งผล ต้องลงมือทำตอนนี้",
  },
  deepeningSevere: {
    label: "Deepening / Severe", labelTH: "วิกฤตหนัก", color: "#A72F1D",
    range: "0–19",
    description: "Severe stress detected. Seek support now.",
    descriptionTH: "ตรวจพบความเครียดรุนแรง ควรขอความช่วยเหลือ",
  },
};

export function getStatusFromScore(score: number): StatusId {
  if (score >= 80) return "stable";
  if (score >= 60) return "atRisk";
  if (score >= 40) return "crisisVisible";
  if (score >= 20) return "emerging";
  return "deepeningSevere";
}
