# QGEN: The Survival Shift — Corporate Identity Spec
> อ้างอิงจาก QGEN Paper: The Survival Shift (Slides 05–09/10)
> ใช้เป็น source of truth สำหรับ survey app นี้

---

## 1. COLOR SYSTEM

### Palette

| Token | Hex | Role |
|---|---|---|
| Absolute Black | `#0A0A0A` | text หลัก, icon หนัก |
| Soft Black / Charcoal | `#1A1A1A` | body text, heading รอง |
| Ash Gray | `#6E6E6E` | label, caption, placeholder |
| Paper White | `#F4F4F0` | พื้นหลักทุกหน้า |
| Paper Alt | `#FAFAF0` | card surface, section bg |
| Paper Wash | `#EAE6DD` | border, divider, track bg |
| Accent Signal | `#C96F3B` | CTA, highlight, progress fill, selected state |
| Signal Soft | `#F3E2D8` | selected card bg, badge bg |
| Signal Deep | `#D8471A` | hover CTA, tagline |

### Usage Ratio (สำคัญมาก)

| สี | สัดส่วน | ใช้ที่ไหน |
|---|---|---|
| Paper White (#F4F4F0) | **60–70%** | background, card surface |
| Supportive Tones (gray, charcoal) | **30–40%** | text, border, structure |
| Accent Signal (#C96F3B) | **5–10% เท่านั้น** | CTA button, selected border, progress bar, overline label |

### Status Band Colors (5 ระดับ)

| Status | Hex | Range |
|---|---|---|
| Stable | `#4F9B45` | 80–100 |
| At Risk | `#E1A300` | 60–79 |
| Crisis or Visible | `#E66A2C` | 40–59 |
| Emerging | `#D9471E` | 20–39 |
| Deepening / Severe | `#A72F1D` | 0–19 |

> ❌ ห้ามใช้สี status นอก badge/ring/bar — ไม่ใช้เป็น background ขนาดใหญ่

---

## 2. TYPOGRAPHY SYSTEM

### Font Families

| Role | Font (Primary) | Fallback |
|---|---|---|
| Display / Headline | Playfair Display | Georgia, serif |
| Thai Body / UI | IBM Plex Sans Thai | Prompt, Noto Sans Thai, sans-serif |
| English UI / Label | Inter | IBM Plex Sans, sans-serif |

> ❌ Playfair Display ไม่มี Thai glyph — ใช้เฉพาะ Latin words ("The Survival Shift") และตัวเลข

### Type Scale

| Role | Font | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 Headline | Playfair Display | Bold (700) | **64px** | 72px | **-2%** |
| H2 Subheadline | Playfair Display | SemiBold (600) | **28px** | 36px | 0% |
| Body Copy | Inter / IBM Plex Sans | Regular (400) | **16px** | 24px | 0% |
| Caption / Label | Inter / IBM Plex Sans | Regular (400) | **12px** | 16px | 0% |
| Overline / Signal | Inter / IBM Plex Sans | Medium (500) | **12px** | 16px | **+6%** (uppercase) |
| Score Number | Playfair Display | Bold (700) | **52px** (ring) / **40px** (card) | — | 0% |

### Editorial Rhythm (ตัวอย่าง)

```
H1 Headline          64/72px   Financial Stress Echoes in Every Decision.
H2 Subheadline       28/36px   When stress lingers, productivity fades.
Body Copy            16/24px   Stress doesn't clock out when employees do...
Caption              12/16px   Source: QGEN Research (2024)
Signal / Overline    12/16px   DATA INSIGHT ACTION  (uppercase +6% LS)
```

---

## 3. KEY VISUAL SYSTEM

### Shadow Collage — องค์ประกอบ (4 Layers)

```
Layer 1 — Texture / Paper     กระดาษ นิ่งยาด ลอยเป็น
Layer 2 — Shadow / Wash       เงา เทกซ์เจอร์ พื้นผิว
Layer 3 — Collage / Data      เมือง เอกสาร ตัวเลข แผนภูมิ
Layer 4 — Subject / Focus     บุคคล + จังหวะทำ + สัญญาณ
```

### Photography Direction

- **ภาพคน**: Semi-silhouette ชาวเอเชีย, backlit, ไม่เห็นหน้าชัด (face not dominant)
- **โทนสี**: ขาวดำ คอนทราสต์สูง, เงาหนัก, อารมณ์จริงเมืองสารคดี
- **Signal Line**: เส้น heartbeat สีส้ม (`#C96F3B`) ลากผ่านภาพด้านล่าง
- **Data overlay**: ตัวเลข %, กราฟ, เอกสาร OVERDUE ซ้อนเบาๆ

### ✅ Do / ❌ Don't

| ✅ Do | ❌ Don't |
|---|---|
| ใช้แสงย้อน (backlight) | ภาพพื้นหลังสว่างจ้า |
| ใบหน้าไม่เด่น | ภาพประกอบการ์ตูน / เด็ก |
| คอนทราสต์สูง ขาวดำ | icon สีสันฉูดฉาด |
| อารมณ์จริง เมือง/สารคดี | คอลเลจยุ่งเหยิงไร้จุดโฟกัส |

---

## 4. SURVEY PAGE SPEC (Slide 08)

### Layout Structure

```
┌─────────────────────────────────┐
│ QGEN Survey          Step 2/18  │  ← TopBar: left brand / right counter
│ ▓▓▓▓▓▓░░░░░░░░░░░░░ 25%        │  ← Progress: orange fill + % label
├─────────────────────────────────┤
│                                  │
│  [Question Card]                 │  ← White card, generous padding
│  How often do you feel anxious   │    16px body, Playfair heading
│  about your financial situation? │
│                                  │
│  [A] เหลือพอออมได้สบาย           │  ← Option cards: horizontal
│  [B] เหลือนิดน้อย พอวันต่อวัน   │    border gray → orange when selected
│  [C] แทบไม่เหลือ                 │    NO letter badge coloring
│  [D] ไม่พอถึงสิ้นเดือน           │
│                                  │
├─────────────────────────────────┤
│ ← ย้อนกลับ                      │  ← Back button only (no Next button)
└─────────────────────────────────┘
```

### TopBar
- Left: `QGEN Paper · The Survival Shift` — font-ui, 11px, ash gray
- Right: `01 / 18` — font-ui, 12px, soft black, tabular nums
- ไม่มี background fill, เพียงบาง border-bottom หรือ shadow เบามาก

### Progress Bar
- **Thin**: height 3–4px
- **Track**: `#EAE6DD` (paper-wash)
- **Fill**: `#C96F3B` (signal orange) — ไม่มี gradient
- **Label**: `25%` — font-ui 11px ash gray, ขวาของ bar
- **วางตำแหน่ง**: ใต้ TopBar, full width, ไม่มี border radius ใหญ่

### Question Card
- Background: `#FAFAF0` / white
- Border: 1px `#DDD9D0`
- Padding: 24px
- Border radius: 16px
- Shadow: `0 4px 16px rgba(0,0,0,0.04)`
- Question text: **16px** Inter/IBM Plex, Soft Black, line-height 24px
- Section label (overline): 11px, `#C96F3B`, uppercase, +6% LS (เช่น "F · FINANCIAL SECURITY")

### Option Cards
- Background: `#FAFAF0`
- Border: 1px `#DDD9D0`
- Border radius: 10–12px
- Padding: 14px 16px
- Letter badge (A/B/C/D): font-display, 14px, **ash gray** — ไม่มีสีพื้นหลัง
- Text: 14px, soft black
- **Selected state**: border `2px #C96F3B`, background `#F3E2D8`, letter badge สีส้ม
- Height: ไม่ fixed, wrap text ได้

### Fixed Bottom Progress
- ❌ ไม่ใช้ walking character
- ✅ Signal Line (heartbeat SVG) สีส้ม opacity 40–60%
- พื้นหลัง: `bg-qgen-paper-alt/92` + backdrop-blur
- border-top: 1px `#DDD9D0`

---

## 5. RESULT PAGE SPEC (Slide 08)

### Layout Order (top → bottom)

```
1. Header — QGEN logo + "RESULT SIGNAL" label
2. Your Survival Signal section
   - Label: "Your Survival Signal" (overline) + signal line ~~~
   - Score Ring (donut SVG, animated)
   - Status label: 28px Playfair, status color
   - Description: 13–14px body
3. Signal Card System (5 cards)
4. Axis Scores (F/C/W)
5. Your Persona
6. Recommended Actions (30/90/365)
7. Share buttons + Back
```

### Score Ring (SVG Donut)
- Outer radius: 62, stroke-width: 12
- Track color: `#EAE6DD`
- Fill color: status color (animated on mount, duration 0.9s ease-out)
- Center number: Playfair Display Bold 52px, `#0A0A0A`
- Sub label: `/100` Inter 14px, `#6E6E6E`
- ขนาดแสดง: 120×120px บน result page

### Signal Card System
- 5 cards เรียงแนวตั้ง
- แต่ละ card: icon (mono, stroke 1.5) + label bold + description + range right-aligned
- Active card (user's status): background `#F3E2D8`, icon+label ใช้ status color, badge "คุณอยู่ที่นี่"
- Divider: 1px `#DDD9D0` ระหว่าง card
- Icon ขนาด 20×20px, stroke-only, ไม่ fill

### Status Icons
| Status | Icon |
|---|---|
| Stable | Shield + checkmark |
| At Risk | Eye |
| Crisis or Visible | Warning triangle |
| Emerging | Trending up arrow |
| Deepening / Severe | Bell |

---

## 6. LANDING PAGE SPEC

### Layout Order

```
1. Hero Collage — full-width image, fade bottom to paper
2. Logo overlay บน hero
3. Overline: "WORKPLACE DIAGNOSTIC · QGEN PAPER" — 11px, ash gray
4. H1: "The Survival Shift" — 64px Playfair Bold, -2% LS
5. Accent rule: 64px wide, 3px, signal orange
6. Body: Thai subtitle — 16px, ash gray, line-height 24px
7. Axis cards (F/C/W)
8. Meta strip (18 คำถาม · 5–8 นาที · ไม่ระบุตัวตน)
9. CTA button: full-width, signal orange, 48px height
10. Signal Line motif ด้านล่าง
```

### H1 Typography (ต้องตรง spec)
- Font: Playfair Display Bold
- Size: **64px** (desktop) / `clamp(44px, 14vw, 64px)` (mobile)
- Line height: 1.1
- Letter spacing: **-0.02em** (-2%)
- Color: `#0A0A0A`

### CTA Button
- Background: `#C96F3B`
- Height: **48px**
- Border radius: 12px
- Text: Thai, font-ui bold, 15px, white
- Hover: `#D8471A`
- Shadow: `0 12px 32px rgba(201,111,59,0.25)`
- ❌ ไม่มี icon ใหญ่มากเกินไป — arrow → เล็กเหมาะสม

---

## 7. SPACING SYSTEM

### ระยะห่างหลัก (Generous Spacing)

| Context | Value |
|---|---|
| Page horizontal padding | 20–24px |
| Section gap | 20px |
| Card internal padding | 20–24px |
| Between question & options | 24px |
| Between option cards | 10–12px |
| TopBar height | 44px |
| CTA button height | 48px |

> หลักการ: **"หายใจได้"** — ทุก element ต้องมี white space รอบตัว ไม่อัดแน่น

---

## 8. COMPONENT RULES

### Cards
- Background: `#FAFAF0` หรือ white
- Border: 1px `#DDD9D0`
- Border radius: 16px (card ใหญ่), 10–12px (option card)
- Shadow: เบามาก `0 4px 16px rgba(0,0,0,0.04)`
- ❌ ไม่มี drop shadow หนัก

### Icons
- **Mono / stroke only** — ไม่ fill สี
- Stroke width: 1.5–1.6px
- ขนาด: 20×20px (standard)
- สี: ash gray (#6E6E6E) ทั่วไป, signal orange เมื่อ active

### Badges / Pills
- Border radius: 100px (pill)
- Padding: 4px 12px
- Font: font-ui 10–11px, bold, uppercase
- Active: background = status color, text white
- Inactive: background = signal-soft, text = signal-deep

### Progress Bar (Survey)
- Height: **3px**
- Track: `#EAE6DD`
- Fill: `#C96F3B`
- ไม่มี border radius ใหญ่ (max 2px)

### Dividers
- 1px solid `#DDD9D0`
- ❌ ไม่ใช้ hr สีเข้ม

---

## 9. ANIMATION RULES

| Element | Animation |
|---|---|
| Page entry | fade-up 0.55s cubic-bezier(0.16,1,0.3,1) |
| Score Ring fill | stroke-dasharray transition 0.9s ease-out |
| Signal Line draw | stroke-dashoffset 1.6s ease-out |
| Option card select | border + bg transition 150ms |
| Progress bar | width transition เมื่อ answer (300ms) |

---

## 10. PAGES CHECKLIST

### Landing Page
- [ ] H1 = 64px Playfair, letter-spacing -2%
- [ ] Body Thai = 16px / 24px line-height
- [ ] Hero collage full-width with bottom fade
- [ ] Logo overlay บน collage
- [ ] Overline uppercase 11px +6% LS
- [ ] Accent rule สีส้ม 64px × 3px
- [ ] CTA 48px height, shadow ถูกต้อง

### Survey Page
- [ ] TopBar: brand left + counter right, ไม่มี background
- [ ] Progress bar: 3px orange fill + % label
- [ ] Question card: 24px padding, generous spacing
- [ ] Option cards: letter badge gray (ไม่มีสี), selected = orange border + soft bg
- [ ] No walking character
- [ ] Fixed bottom: SignalLine เบา + blur backdrop

### Result Page
- [ ] Score Ring animated, ขนาด 120px
- [ ] Status label Playfair 28px สีตาม band
- [ ] Signal Card System 5 levels พร้อม icon
- [ ] "คุณอยู่ที่นี่" badge บน active card
- [ ] Axis scores พร้อม status badge inline
- [ ] Persona card sections ชัดเจน
- [ ] Action plan 30/90/365 วัน

---

## 11. THINGS TO AVOID

- ❌ ส้มมากเกิน 10% ของพื้นที่
- ❌ Font ขนาดต่ำกว่า spec (H1 < 64px, body < 16px)
- ❌ Option cards มี background badge สีสัน
- ❌ Shadow หนัก
- ❌ Icon fill สี (ต้องเป็น stroke only)
- ❌ Progress bar สูงเกิน 4px
- ❌ ข้อความอัดแน่น ไม่มี whitespace
- ❌ ภาพ hero สว่างจ้า หรือ cartoon
