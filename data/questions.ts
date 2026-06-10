export const questions = [
  {
    "id": "F1",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ในช่วงปีที่ผ่านมา รายได้ของคุณเทียบกับค่าครองชีพแล้ว เป็นอย่างไรบ้าง",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "รายได้เพิ่มขึ้น และพอสู้กับค่าครองชีพได้" },
      { "label": "B", "value": 2, "text": "รายได้เพิ่มขึ้นบ้าง แต่ยังตามค่าครองชีพไม่ทัน" },
      { "label": "C", "value": 3, "text": "รายได้เท่าเดิม ทั้งที่ค่าครองชีพแพงขึ้นชัดเจน" },
      { "label": "D", "value": 4, "text": "รายได้ลดลงสวนทางกับค่าครองชีพที่แพงขึ้นเรื่อย ๆ" }
    ]
  },
  {
    "id": "F2",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ถ้าวันนี้เกิดเหตุฉุกเฉินขึ้น คุณมีเงินสำรองพอรับมือได้นานแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "มีเงินสำรองมากกว่า 3 เดือน" },
      { "label": "B", "value": 2, "text": "มีพอ 1–3 เดือน" },
      { "label": "C", "value": 3, "text": "มีไม่ถึง 1 เดือน" },
      { "label": "D", "value": 4, "text": "แทบไม่มีเงินสำรองเลย" }
    ]
  },
  {
    "id": "F3",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "หลังจากหักค่าใช้จ่ายทุกอย่างในแต่ละเดือนแล้ว ปกติเหลือเงินแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "มีเงินเหลือให้ออมหรือใช้จ่ายส่วนตัวได้สบาย ๆ" },
      { "label": "B", "value": 2, "text": "เหลือนิดหน่อย พอประคองไปได้" },
      { "label": "C", "value": 3, "text": "เงินแทบไม่เหลือเลย" },
      { "label": "D", "value": 4, "text": "ไม่พออยู่ถึงสิ้นเดือน" }
    ]
  },
  {
    "id": "F4",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ค่าเดินทางมาทำงานในแต่ละเดือน กระทบกระเป๋าตังค์คุณมากน้อยแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ชิล ๆ ไม่ค่อยกระทบเท่าไหร่" },
      { "label": "B", "value": 2, "text": "กระทบบ้าง แต่ยังพอรับได้" },
      { "label": "C", "value": 3, "text": "กระทบเยอะ เริ่มกลายเป็นภาระหนักในแต่ละเดือน" },
      { "label": "D", "value": 4, "text": "ค่าเดินทางสูง จนรู้สึกไม่อยากมาทำงานเลย" }
    ]
  },
  {
    "id": "F5",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "หนี้สิน หรือภาระครอบครัว สร้างความกดดันให้คุณขนาดไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "สบาย ๆ ไม่ค่อยรู้สึกกดดันเท่าไหร่" },
      { "label": "B", "value": 2, "text": "มีกดดันบ้าง แต่รวม ๆ ยังรับมือไหว" },
      { "label": "C", "value": 3, "text": "กดดันมาก จะใช้เงินแต่ละบาทต้องคิดแล้วคิดอีก" },
      { "label": "D", "value": 4, "text": "หนักหนาสาหัสมาก รู้สึกตันจนหาทางออกไม่เจอ" }
    ]
  },
  {
    "id": "F6",
    "axis": "F",
    "axisName": "Financial Security",
    "question": "ค่าใช้จ่ายในช่วง 6 เดือนที่ผ่านมา เป็นอย่างไรบ้าง",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "รายได้ยังครอบคลุมค่าใช้จ่ายได้สบาย ๆ" },
      { "label": "B", "value": 2, "text": "ค่าใช้จ่ายเพิ่มขึ้น แต่ยังพอไหว" },
      { "label": "C", "value": 3, "text": "ค่าใช้จ่ายเพิ่มขึ้นเยอะ จนรู้สึกตึงมือ" },
      { "label": "D", "value": 4, "text": "รายจ่ายเกินรายรับ จนต้องหยิบยืมหรือกู้หนี้มาเพิ่ม" }
    ]
  },
  {
    "id": "C1",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ตอนนี้คุณรู้สึกผูกพันกับองค์กรแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ผูกพันมาก อยากเติบโตไปพร้อม ๆ กัน" },
      { "label": "B", "value": 2, "text": "ยังโอเค แต่มีข้อกังวลเรื่องอนาคตบ้าง" },
      { "label": "C", "value": 3, "text": "เริ่มรู้สึกไม่ค่อยผูกพัน" },
      { "label": "D", "value": 4, "text": "ไม่ผูกพันเลย ยังอยู่เพราะความจำเป็น" }
    ]
  },
  {
    "id": "C2",
    "axis": "C",
    "axisName": "Career Path",
    "question": "เหตุผลหลักที่ทำให้คุณยังเลือกทำงานอยู่ที่นี่คืออะไร",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "เชื่อมั่นในองค์กรและอยากโตไปด้วยกันยาว ๆ" },
      { "label": "B", "value": 2, "text": "ผลตอบแทนและเงื่อนไขลงตัว" },
      { "label": "C", "value": 3, "text": "ความเคยชิน แต่ไม่ได้รู้สึกอยากทำขนาดนั้น" },
      { "label": "D", "value": 4, "text": "ยังไม่มีทางไป หรือยังหางานใหม่ที่ดีกว่านี้ไม่ได้" }
    ]
  },
  {
    "id": "C3",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ตอนนี้คุณเห็นเส้นทางการเติบโต (Career Path) ในงานที่ทำชัดแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ชัดเจนมาก รู้ว่าต้องทำยังไงถึงจะได้เลื่อนขั้นหรือเติบโต" },
      { "label": "B", "value": 2, "text": "พอเห็นบ้าง แต่ยังไม่ค่อยเคลียร์เท่าไหร่" },
      { "label": "C", "value": 3, "text": "ค่อนข้างมืดมน ไม่ค่อยรู้ว่าจะโตไปในทิศทางไหนต่อ" },
      { "label": "D", "value": 4, "text": "มองไม่เห็นอนาคตเลย ไม่รู้ว่าอยู่ที่นี่แล้วได้อะไร" }
    ]
  },
  {
    "id": "C4",
    "axis": "C",
    "axisName": "Career Path",
    "question": "คุณมองเห็นภาพตัวเองในอีก 2–3 ปีข้างหน้าเป็นอย่างไรบ้าง",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "เติบโตหรือรับผิดชอบงานที่ใหญ่ขึ้นในองค์กรเดิม" },
      { "label": "B", "value": 2, "text": "ยังคงทำงานอยู่ที่เดิม ไม่ได้มีการขยับตำแหน่ง" },
      { "label": "C", "value": 3, "text": "ไปเติบโตในที่ใหม่ ๆ หรือได้ลองย้ายไปทำสายงานอื่น" },
      { "label": "D", "value": 4, "text": "มองไม่เห็นภาพเลย รู้สึกมืดมนและตันมาก" }
    ]
  },
  {
    "id": "C5",
    "axis": "C",
    "axisName": "Career Path",
    "question": "คุณรู้สึกว่าตัวเองได้พัฒนาทักษะใหม่ ๆ ในการทำงานบ้างไหม",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ได้เรียนรู้และพัฒนาทักษะใหม่ ๆ เยอะมาก" },
      { "label": "B", "value": 2, "text": "ได้พัฒนาบ้างนิดหน่อย แต่ไม่ได้บ่อยหรือสม่ำเสมอ" },
      { "label": "C", "value": 3, "text": "น้อยมาก แทบไม่ได้เรียนรู้อะไรใหม่" },
      { "label": "D", "value": 4, "text": "ไม่ได้พัฒนาเลย รู้สึกชีวิตการทำงานหยุดนิ่งอยู่กับที่" }
    ]
  },
  {
    "id": "C6",
    "axis": "C",
    "axisName": "Career Path",
    "question": "ช่วง 6 เดือนที่ผ่านมา คุณเคยคิดจะหางานใหม่บ้างไหม",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ไม่เคยคิดเลย ยังแฮปปี้และโอเคกับที่นี่ดี" },
      { "label": "B", "value": 2, "text": "มีแวบเข้ามาในหัวบ้าง แต่ยังไม่ได้ลงมือทำอะไร" },
      { "label": "C", "value": 3, "text": "เริ่มส่งใบสมัคร หรือหาโอกาสใหม่ ๆ ให้ตัวเองแล้ว" },
      { "label": "D", "value": 4, "text": "กำลังหางานใหม่อย่างจริงจัง" }
    ]
  },
  {
    "id": "W1",
    "axis": "W",
    "axisName": "Well-being",
    "question": "คุณมีพลังกายพอสำหรับการทำงานแต่ละวันแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "พลังเต็มเปี่ยม ฟิตพร้อมลุย เฟรชสุด ๆ" },
      { "label": "B", "value": 2, "text": "เหนื่อยบ้าง แต่พอได้พักผ่อนก็หาย" },
      { "label": "C", "value": 3, "text": "เหนื่อยง่าย รู้สึกแบตหมดเกลี้ยงตั้งแต่ยังไม่เลิกงาน" },
      { "label": "D", "value": 4, "text": "หมดสภาพแทบทุกวัน ขนาดนอนเต็มอิ่มตื่นมาก็ยังเพลีย" }
    ]
  },
  {
    "id": "W2",
    "axis": "W",
    "axisName": "Well-being",
    "question": "การเดินทางไปทำงานในแต่ละวัน สูบพลังชีวิตคุณไปมากน้อยแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "สบายมาก เดินทางชิล ๆ ไม่เหนื่อยเลย" },
      { "label": "B", "value": 2, "text": "มีเหนื่อย ๆ เพลีย ๆ บ้าง แต่ยังพอไหว" },
      { "label": "C", "value": 3, "text": "เหนื่อยมาก แค่เดินทางก็กินพลังชีวิตไปมากกว่าครึ่งแล้ว" },
      { "label": "D", "value": 4, "text": "สาหัสมาก หมดตั้งแต่ยังไม่ทันก้าวเท้าเข้าออฟฟิศ" }
    ]
  },
  {
    "id": "W3",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ในช่วงเดือนที่ผ่านมา คุณมีอาการทางกาย เช่น ปวดหลัง ปวดหัว หรือนอนไม่หลับ บ้างไหม",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ไม่มีเลย ร่างกายยังแข็งแรงดีมาก" },
      { "label": "B", "value": 2, "text": "มีบ้าง แต่ไม่ได้รบกวนการใช้ชีวิตเท่าไหร่" },
      { "label": "C", "value": 3, "text": "เป็นบ่อย และเริ่มกระทบกับชีวิตประจำวันแล้ว" },
      { "label": "D", "value": 4, "text": "เป็นปัญหาเรื้อรังรุนแรง จนพังไปหมด" }
    ]
  },
  {
    "id": "W4",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ทุกวันนี้คุณยังมีเวลาและพลังเหลือพอที่จะดูแลตัวเองไหม (เช่น นอนเต็มอิ่ม กินของดี ๆ ออกกำลังกาย)",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "มีเหลือเฟือ ดูแลตัวเองได้ดีและสม่ำเสมอสุด ๆ" },
      { "label": "B", "value": 2, "text": "มีบ้าง แต่ไม่สม่ำเสมอ" },
      { "label": "C", "value": 3, "text": "มีน้อย แทบไม่มีเวลาดูแลตัวเอง" },
      { "label": "D", "value": 4, "text": "แทบเป็นศูนย์ ปล่อยเนื้อปล่อยตัวจนสุขภาพแย่ลงเรื่อย ๆ" }
    ]
  },
  {
    "id": "W5",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ช่วงนี้สภาพจิตใจของคุณเป็นอย่างไรบ้าง เช่น มีความรู้สึกเศร้า ดิ่ง หดหู่ หรือหมดไฟ",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "สุขภาพจิตใจดีเยี่ยม ยังยิ้มได้ มีพลังใจเต็มร้อย" },
      { "label": "B", "value": 2, "text": "มีบางวันหน่วง ๆ ดิ่ง ๆ บ้าง แต่ก็ยังฮึบสู้และผ่านมาได้" },
      { "label": "C", "value": 3, "text": "พังบ่อย รู้สึกหดหู่จนเริ่มไม่อยากทำอะไรเลย" },
      { "label": "D", "value": 4, "text": "ดิ่งยาวต่อเนื่อง รู้สึกหมดหวังและหมดพลังใจแบบกู่ไม่กลับ" }
    ]
  },
  {
    "id": "W6",
    "axis": "W",
    "axisName": "Well-being",
    "question": "ความเครียดสะสมในชีวิต ส่งผลต่อสมาธิและการโฟกัสในงานของคุณแค่ไหน",
    "scale": { "min": 1, "max": 4, "direction": "1 = best / 4 = most pressured" },
    "reverse": false,
    "options": [
      { "label": "A", "value": 1, "text": "ไม่กระทบ ยังโฟกัสได้เต็มที่" },
      { "label": "B", "value": 2, "text": "มีกวนใจบ้าง แต่ยังจัดการได้" },
      { "label": "C", "value": 3, "text": "กระทบชัดเจน สมองเบลอ ๆ จนทำงานได้ไม่เต็มประสิทธิภาพ" },
      { "label": "D", "value": 4, "text": "กระทบหนักมาก สมาธิหลุดลอยจนงานผิดพลาดบ่อย" }
    ]
  }
] as const;
