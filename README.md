# QGEN — The Survival Shift Survey Data Package

แปลงจากไฟล์ Excel ล่าสุด: `Draft - The Survival Shift Survey.xlsx`

แพ็กนี้เตรียมไว้สำหรับนำไปใช้ใน web app survey / Claude Code ได้ทันที โดยแยกเป็น data และ logic หลักที่ควรใช้ซ้ำในแอป

## ไฟล์หลัก

- `survey-content.json` — ข้อมูลทั้งหมดในไฟล์เดียว: survey meta, scoring, axes, questions, personas
- `questions.csv` — ตารางคำถาม 15 ข้อ สำหรับตรวจ/แก้เร็ว
- `personas.csv` — ตาราง Persona 13 แบบ พร้อม description/action plan/icon concept
- `data/questions.ts` — questions สำหรับ Next.js/TypeScript
- `data/personas.ts` — persona copy + action plan + illustration prompt
- `data/axes.ts` — รายละเอียดแกน F/C/W
- `lib/scoring.ts` — สูตร Survival Score
- `lib/status.ts` — mapping Stable / At Risk / Crisis
- `lib/persona-router.ts` — logic routing Persona 01–13
- `__tests__/scoring.test.ts` — unit test ตัวอย่างสำหรับ Vitest

## กติกาสำคัญ

### Scoring

```ts
Survival Score = ((4 - averageAnswer) / 3) * 100
```

- A = 1 = ดีที่สุด / กดดันน้อยสุด
- D = 4 = หนักสุด / เปราะบางสุด
- ยิ่ง Survival Score สูง = ยังมีพื้นที่หายใจ
- ยิ่ง Survival Score ต่ำ = เปราะบาง

### Status ต่อแกน

```ts
score >= 67  => Stable
score > 33 && score < 67 => At Risk
score <= 33 => Crisis
```

### Result Page Rule

- ไม่ต้องโชว์ Survival Score รวม
- โชว์เฉพาะ F/C/W axis scores
- แต่ละแกนต้องมี status: Stable / At Risk / Crisis
- ใช้ persona description แทน tagline
- ใส่ Action Plan 30 / 90 / 365 วันด้านล่าง

### Persona Routing

ต้องตรวจ Persona 13 ก่อน Persona 12 เสมอ

```ts
if (F crisis && C crisis && W crisis) return "13";
...
if (all axes not stable && at least one crisis) return "12";
```

## วิธีใช้ใน Next.js

นำโฟลเดอร์ `data` และ `lib` ไปวางในโปรเจกต์ แล้ว import เช่น

```ts
import { questions } from "@/data/questions";
import { routePersona } from "@/lib/persona-router";
import { calculateAxisScores } from "@/lib/scoring";
```

