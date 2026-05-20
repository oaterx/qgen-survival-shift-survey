export const axes = [
  {
    "id": "F",
    "name": "Financial Security",
    "objective": "วัดแรงกดดันด้านการเงินและค่าครองชีพ",
    "measures": "รายได้ เงินสำรอง หนี้สิน ภาระครอบครัว ต้นทุนเดินทาง",
    "paperMeaning": "พนักงานกำลังรอดทางการเงิน หรือเริ่มเปราะบาง",
    "colorToken": "financialGreen"
  },
  {
    "id": "C",
    "name": "Career Path",
    "objective": "วิเคราะห์ความเสี่ยงด้าน Retention และ Career Gap",
    "measures": "เส้นทางเติบโต ทักษะ ความผูกพัน ความเสี่ยงลาออก",
    "paperMeaning": "พนักงานยังอยากสู้ไปกับองค์กร หรือพร้อมย้ายแล้ว",
    "colorToken": "careerBlue"
  },
  {
    "id": "W",
    "name": "Well-being",
    "objective": "ประเมินผลกระทบด้านสุขภาพกายและจิตจากความเครียดสะสม",
    "measures": "สมาธิ ความเหนื่อยล้า สุขภาพกาย พลังงาน การฟื้นตัว",
    "paperMeaning": "ต้นทุนแฝงที่ทำให้ Productivity ลดและ Presenteeism เพิ่ม",
    "colorToken": "wellbeingPurple"
  }
] as const;
