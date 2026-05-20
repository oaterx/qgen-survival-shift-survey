export const questions = [
  {
    "id": "F1",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "หลังจ่ายค่าใช้จ่ายทุกอย่างในแต่ละเดือน คุณเหลือเงินแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "เหลือพอออมได้สบาย"
      },
      {
        "label": "B",
        "value": 2,
        "text": "เหลือนิดหน่อย พอวันต่อวัน"
      },
      {
        "label": "C",
        "value": 3,
        "text": "แทบไม่เหลือ บางเดือนก็ขาด"
      },
      {
        "label": "D",
        "value": 4,
        "text": "ไม่พอถึงสิ้นเดือน"
      }
    ]
  },
  {
    "id": "F2",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ถ้าเกิดเหตุฉุกเฉินวันนี้ เช่น ป่วยกะทันหัน หรือรถเสีย คุณรับมือได้ไหม?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "มีเงินสำรองมากกว่า 3 เดือน"
      },
      {
        "label": "B",
        "value": 2,
        "text": "มีพอ 1–3 เดือน"
      },
      {
        "label": "C",
        "value": 3,
        "text": "มีไม่ถึง 1 เดือน"
      },
      {
        "label": "D",
        "value": 4,
        "text": "แทบไม่มีเงินสำรองเลย"
      }
    ]
  },
  {
    "id": "F3",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ช่วง 6 เดือนที่ผ่านมา ค่าใช้จ่ายของคุณเป็นยังไงเทียบกับรายได้?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "รายได้ยังตามทันได้"
      },
      {
        "label": "B",
        "value": 2,
        "text": "ค่าใช้จ่ายเพิ่มขึ้นบ้าง แต่ยังพอไหว"
      },
      {
        "label": "C",
        "value": 3,
        "text": "ค่าใช้จ่ายเพิ่มจนรู้สึกตึงมือ"
      },
      {
        "label": "D",
        "value": 4,
        "text": "รายจ่ายเกินรายรับ ต้องก่อหนี้"
      }
    ]
  },
  {
    "id": "F4",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "หนี้สิน หรือภาระครอบครัว เช่น ดูแลพ่อแม่หรือลูก กดดันคุณแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่ค่อยกดดัน"
      },
      {
        "label": "B",
        "value": 2,
        "text": "มีบ้าง แต่ยังรับมือได้"
      },
      {
        "label": "C",
        "value": 3,
        "text": "กดดันมาก ต้องระวังทุกบาท"
      },
      {
        "label": "D",
        "value": 4,
        "text": "หนักมาก รู้สึกหลุดออกไม่ได้"
      }
    ]
  },
  {
    "id": "F5",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ค่าเดินทางไปทำงาน เช่น น้ำมัน รถไฟฟ้า ค่าทางด่วน กระทบเงินในกระเป๋าคุณแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่กระทบมาก"
      },
      {
        "label": "B",
        "value": 2,
        "text": "กระทบบ้าง แต่ยังพอรับได้"
      },
      {
        "label": "C",
        "value": 3,
        "text": "กระทบมาก เป็นภาระชัดเจน"
      },
      {
        "label": "D",
        "value": 4,
        "text": "สูงจนรู้สึกไม่คุ้มที่จะเดินทางมา"
      }
    ]
  },
  {
    "id": "C1",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ตอนนี้คุณเห็นเส้นทางการเติบโตในงานที่ทำชัดแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ชัดมาก รู้ว่าต้องทำอะไรเพื่อก้าวต่อไป"
      },
      {
        "label": "B",
        "value": 2,
        "text": "พอเห็นบ้าง แต่ยังไม่ครบ"
      },
      {
        "label": "C",
        "value": 3,
        "text": "ไม่ค่อยชัด ไม่รู้จะไปต่อยังไง"
      },
      {
        "label": "D",
        "value": 4,
        "text": "ไม่เห็นเลย ไม่รู้ว่าอยู่ที่นี่แล้วได้อะไร"
      }
    ]
  },
  {
    "id": "C2",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ในปีที่ผ่านมา คุณได้พัฒนาทักษะใหม่หรือเรียนรู้สิ่งใหม่จากการทำงานแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "พัฒนาได้ชัดเจน มีทักษะใหม่เพิ่มขึ้นจริงๆ"
      },
      {
        "label": "B",
        "value": 2,
        "text": "มีบ้าง แต่ไม่สม่ำเสมอ"
      },
      {
        "label": "C",
        "value": 3,
        "text": "น้อยมาก แทบไม่ได้เรียนรู้อะไรใหม่"
      },
      {
        "label": "D",
        "value": 4,
        "text": "ไม่ได้พัฒนาเลย รู้สึกหยุดนิ่ง"
      }
    ]
  },
  {
    "id": "C3",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ช่วง 6 เดือนที่ผ่านมา คุณเคยคิดจะหางานใหม่บ้างไหม?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่เคย ยังโอเคกับที่นี่"
      },
      {
        "label": "B",
        "value": 2,
        "text": "คิดบ้าง แต่ยังไม่ได้ทำอะไร"
      },
      {
        "label": "C",
        "value": 3,
        "text": "เริ่มส่งใบสมัครหรือเปิดรับ offer บ้างแล้ว"
      },
      {
        "label": "D",
        "value": 4,
        "text": "กำลังหาอย่างจริงจัง"
      }
    ]
  },
  {
    "id": "C4",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ตอนนี้คุณรู้สึกผูกพันกับองค์กรแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ผูกพันมาก อยากอยู่และโตไปด้วยกัน"
      },
      {
        "label": "B",
        "value": 2,
        "text": "ยังโอเค แต่มีข้อกังวลบ้าง"
      },
      {
        "label": "C",
        "value": 3,
        "text": "ห่างออกมาเรื่อยๆ"
      },
      {
        "label": "D",
        "value": 4,
        "text": "แทบไม่ผูกพัน ทำงานอยู่เพราะจำเป็น"
      }
    ]
  },
  {
    "id": "C5",
    "axis": "C",
    "axisName": "Career Path",
    "question": "คุณมองเห็นตัวเองอยู่ที่นี่ในอีก 2–3 ปีข้างหน้าไหม?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "เห็นชัด มีเป้าหมายร่วมกับองค์กร"
      },
      {
        "label": "B",
        "value": 2,
        "text": "พอมองเห็น แต่ยังไม่แน่ใจ"
      },
      {
        "label": "C",
        "value": 3,
        "text": "ไม่ค่อยเห็น เริ่มมองหาทางเลือกอื่น"
      },
      {
        "label": "D",
        "value": 4,
        "text": "ไม่เห็นเลย"
      }
    ]
  },
  {
    "id": "W1",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ความเครียดในชีวิต เช่น เรื่องเงินหรือภาระต่างๆ กระทบสมาธิการทำงานของคุณแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่กระทบ ยังโฟกัสได้เต็มที่"
      },
      {
        "label": "B",
        "value": 2,
        "text": "กระทบบ้าง แต่ยังจัดการได้"
      },
      {
        "label": "C",
        "value": 3,
        "text": "กระทบชัด รู้สึกทำงานได้ไม่เต็มที่"
      },
      {
        "label": "D",
        "value": 4,
        "text": "กระทบมาก งานแย่ลงเห็นได้ชัด"
      }
    ]
  },
  {
    "id": "W2",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ภาระชีวิตโดยรวมทำให้คุณเหนื่อยจนกระทบการทำงานแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "แทบไม่เคย ยังมีพลังงานดี"
      },
      {
        "label": "B",
        "value": 2,
        "text": "เป็นบางช่วง แต่ยังฟื้นตัวได้"
      },
      {
        "label": "C",
        "value": 3,
        "text": "เป็นบ่อย รู้สึกหมดแรงก่อนวันหมด"
      },
      {
        "label": "D",
        "value": 4,
        "text": "หมดแรงเกือบทุกวัน"
      }
    ]
  },
  {
    "id": "W3",
    "axis": "W",
    "axisName": "Well-being",
    "question": "การเดินทางไปทำงานแต่ละวันทำให้คุณเหนื่อยแค่ไหน?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่เหนื่อย รับมือได้ดี"
      },
      {
        "label": "B",
        "value": 2,
        "text": "เหนื่อยบ้าง แต่ยังโอเค"
      },
      {
        "label": "C",
        "value": 3,
        "text": "เหนื่อยมาก กินพลังงานไปเยอะ"
      },
      {
        "label": "D",
        "value": 4,
        "text": "หมดแรงตั้งแต่ก่อนเริ่มงานทุกวัน"
      }
    ]
  },
  {
    "id": "W4",
    "axis": "W",
    "axisName": "Well-being",
    "question": "เดือนที่ผ่านมา คุณมีอาการทางร่างกาย เช่น ปวดหลัง ปวดหัว หรือนอนไม่หลับ บ้างไหม?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "ไม่มี สุขภาพโดยรวมยังดี"
      },
      {
        "label": "B",
        "value": 2,
        "text": "มีบ้าง แต่ยังไม่รบกวนชีวิตมาก"
      },
      {
        "label": "C",
        "value": 3,
        "text": "มีบ่อย เริ่มกระทบชีวิตประจำวัน"
      },
      {
        "label": "D",
        "value": 4,
        "text": "เป็นปัญหาชัดเจน กระทบทั้งงานและชีวิต"
      }
    ]
  },
  {
    "id": "W5",
    "axis": "W",
    "axisName": "Well-being",
    "question": "คุณมีเวลาและพลังงานพอสำหรับดูแลสุขภาพตัวเอง เช่น ออกกำลังกาย นอนหลับ หรือกินอาหารครบไหม?",
    "scale": {
      "min": 1,
      "max": 4,
      "direction": "1 = best / 4 = most pressured"
    },
    "reverse": false,
    "options": [
      {
        "label": "A",
        "value": 1,
        "text": "มีพอ ดูแลตัวเองได้สม่ำเสมอ"
      },
      {
        "label": "B",
        "value": 2,
        "text": "มีบ้าง แต่ไม่สม่ำเสมอ"
      },
      {
        "label": "C",
        "value": 3,
        "text": "น้อยมาก แทบไม่มีเวลาดูแลตัวเอง"
      },
      {
        "label": "D",
        "value": 4,
        "text": "ไม่มีเลย สุขภาพถูกละเลยไปเรื่อยๆ"
      }
    ]
  }
] as const;
