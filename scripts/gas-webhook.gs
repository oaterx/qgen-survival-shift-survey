/**
 * QGEN Survival Shift Survey — Google Apps Script
 *
 * HOW TO USE:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Replace ALL existing code with this entire file
 * 3. Run formatResponseSheet() once to set up headers + formatting
 * 4. Deploy as Web App: Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL → paste into .env as GOOGLE_SHEET_WEBHOOK_URL
 */

const HEADERS = [
  "timestamp", "personaId",
  "f", "c", "w",
  "positionLevel", "industry", "ageRange", "incomeRange", "email",
  "consentAccepted", "marketingConsent", "consentTimestamp",
  "F1", "F2", "F3", "F4", "F5", "F6",
  "C1", "C2", "C3", "C4", "C5", "C6",
  "W1", "W2", "W3", "W4", "W5", "W6",
];

// ── Receive POST from Next.js and append a row ───────────────────────────────
function doPost(e) {
  // Serialize concurrent writes. At ~1000 users, bursts of simultaneous POSTs
  // can interleave appendRow() and drop/overwrite rows without a lock.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // wait up to 20s for other writers to finish
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "lock_timeout" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "no_body" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);

    // Use the first sheet explicitly, not getActiveSheet() (which depends on
    // whatever tab the script owner last had open — fragile in production).
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    const row = HEADERS.map(key => {
      const val = data[key];
      return val !== undefined && val !== null ? val : "";
    });

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ── Format as table (run once manually) ─────────────────────────────────────
function formatResponseSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const numCols = HEADERS.length;
  const lastRow = Math.max(sheet.getLastRow(), 2);
  const totalRows = Math.max(lastRow, 50); // pre-format 50 rows for incoming data

  // ── 1. Headers ──────────────────────────────────────────────────────────────
  sheet.getRange(1, 1, 1, numCols).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 40);

  // ── 2. Header color groups ──────────────────────────────────────────────────
  function headerGroup(startCol, endCol, bg) {
    sheet.getRange(1, startCol, 1, endCol - startCol + 1)
      .setBackground(bg)
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setFontSize(11)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
  }
  headerGroup(1,  2,  "#1A1A1A"); // Meta         — near-black
  headerGroup(3,  5,  "#C96F3B"); // Scores       — burnt orange
  headerGroup(6,  10, "#374151"); // Demographics — dark slate
  headerGroup(11, 13, "#5B21B6"); // Consent      — violet
  headerGroup(14, 19, "#1D5E54"); // Financial    — deep teal
  headerGroup(20, 25, "#1E3A8A"); // Career       — deep blue
  headerGroup(26, 31, "#4C1D95"); // Well-being   — deep purple

  // ── 3. Outer border (table look) ────────────────────────────────────────────
  const tableRange = sheet.getRange(1, 1, totalRows, numCols);
  tableRange.setBorder(
    true, true, true, true, false, false,
    "#9CA3AF", SpreadsheetApp.BorderStyle.SOLID
  );

  // Inner horizontal lines between rows
  sheet.getRange(1, 1, totalRows, numCols).setBorder(
    null, null, null, null, false, true,
    "#E5E7EB", SpreadsheetApp.BorderStyle.SOLID
  );

  // Vertical dividers between column groups
  [[3,1],[6,1],[11,1],[14,1],[20,1],[26,1]].forEach(([col]) => {
    sheet.getRange(1, col, totalRows, 1).setBorder(
      null, true, null, null, null, null,
      "#6B7280", SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  });

  // ── 4. Data row banding (alternating white / light gray) ────────────────────
  sheet.getBandings().forEach(b => b.remove());
  if (totalRows > 1) {
    sheet.getRange(2, 1, totalRows - 1, numCols)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY)
      .setFirstRowColor("#FFFFFF")
      .setSecondRowColor("#F9FAFB")
      .setHeaderColor(null)
      .setFooterColor(null);
  }

  // ── 5. Alignments ───────────────────────────────────────────────────────────
  // All data rows: middle vertical align
  sheet.getRange(2, 1, totalRows - 1, numCols).setVerticalAlignment("middle");
  // Numeric: center
  sheet.getRange(2, 3, totalRows - 1, 3).setHorizontalAlignment("center");   // f c w
  sheet.getRange(2, 14, totalRows - 1, 18).setHorizontalAlignment("center"); // F1–W6
  // Text: left
  sheet.getRange(2, 1, totalRows - 1, 2).setHorizontalAlignment("left");     // timestamp, personaId
  sheet.getRange(2, 6, totalRows - 1, 8).setHorizontalAlignment("left");     // demo + email + consent

  // ── 6. Column widths ────────────────────────────────────────────────────────
  sheet.setColumnWidth(1, 190);  // timestamp
  sheet.setColumnWidth(2, 120);  // personaId
  sheet.setColumnWidth(3, 45);   // f
  sheet.setColumnWidth(4, 45);   // c
  sheet.setColumnWidth(5, 45);   // w
  sheet.setColumnWidth(6, 130);  // positionLevel
  sheet.setColumnWidth(7, 130);  // industry
  sheet.setColumnWidth(8, 90);   // ageRange
  sheet.setColumnWidth(9, 110);  // incomeRange
  sheet.setColumnWidth(10, 180); // email
  sheet.setColumnWidth(11, 120); // consentAccepted
  sheet.setColumnWidth(12, 130); // marketingConsent
  sheet.setColumnWidth(13, 190); // consentTimestamp
  for (let col = 14; col <= 31; col++) sheet.setColumnWidth(col, 48);

  // ── 7. Row height for data rows ─────────────────────────────────────────────
  for (let r = 2; r <= totalRows; r++) sheet.setRowHeight(r, 32);

  // ── 8. Font for data area ───────────────────────────────────────────────────
  sheet.getRange(2, 1, totalRows - 1, numCols)
    .setFontFamily("Arial")
    .setFontSize(10)
    .setFontColor("#111827");

  // ── 9. Filter ───────────────────────────────────────────────────────────────
  try { sheet.getFilter().remove(); } catch(_) {}
  sheet.getRange(1, 1, totalRows, numCols).createFilter();

  // ── 10. Tooltips on question columns ────────────────────────────────────────
  const NOTES = {
    positionLevel: "ระดับตำแหน่งงาน",
    industry: "อุตสาหกรรม / ประเภทธุรกิจ",
    ageRange: "ช่วงอายุ",
    incomeRange: "ช่วงรายได้ต่อเดือน",
    email: "อีเมลล์ (optional)",
    consentAccepted: "ยินยอมให้เก็บ/ประมวลผลข้อมูล (บังคับ)",
    marketingConsent: "ยินยอมรับข่าวสารทางอีเมล (ไม่บังคับ)",
    consentTimestamp: "เวลาที่ให้ความยินยอม (เวลาไทย)",
    F1: "ในช่วงปีที่ผ่านมา รายได้ของคุณเทียบกับค่าครองชีพแล้ว เป็นอย่างไรบ้าง",
    F2: "ถ้าวันนี้เกิดเหตุฉุกเฉินขึ้น คุณมีเงินสำรองพอรับมือได้แค่ไหน",
    F3: "หลังจากหักค่าใช้จ่ายทุกอย่างในแต่ละเดือนแล้ว ปกติเหลือเงินไว้ออมหรือลงทุนได้บ้างไหม",
    F4: "ค่าเดินทางมาทำงานในแต่ละเดือน กระทบกระเป๋าตังค์คุณมากแค่ไหน",
    F5: "หนี้สิน หรือภาระครอบครัว สร้างความกดดันให้คุณขนาดไหน",
    F6: "ค่าใช้จ่ายในช่วง 6 เดือนที่ผ่านมา เป็นอย่างไรบ้าง",
    C1: "ตอนนี้คุณรู้สึกผูกพันกับองค์กรแค่ไหน",
    C2: "เหตุผลหลักที่ทำให้คุณยังเลือกทำงานอยู่ที่นี่คืออะไร",
    C3: "ตอนนี้คุณเห็นเส้นทางการเติบโต (Career Path) ในงานที่ทำชัดแค่ไหน",
    C4: "คุณมองเห็นภาพตัวเองในอีก 2–3 ปีข้างหน้าเป็นอย่างไรบ้าง",
    C5: "คุณรู้สึกว่าตัวเองได้พัฒนาทักษะใหม่ ๆ ในการทำงานบ้างไหม",
    C6: "ช่วง 6 เดือนที่ผ่านมา คุณเคยคิดจะหางานใหม่บ้างไหม",
    W1: "คุณมีพลังกายพอสำหรับการทำงานแต่ละวันแค่ไหน",
    W2: "การเดินทางไปทำงานในแต่ละวัน สูบพลังชีวิตคุณไปมากน้อยแค่ไหน",
    W3: "ในช่วงเดือนที่ผ่านมา คุณมีอาการทางกาย เช่น ปวดหลัง ปวดหัว หรือนอนไม่หลับ บ้างไหม",
    W4: "ทุกวันนี้คุณยังมีเวลาและพลังเหลือพอที่จะดูแลตัวเองไหม",
    W5: "ช่วงนี้สภาพจิตใจของคุณเป็นอย่างไรบ้าง",
    W6: "ความเครียดสะสมในชีวิต ส่งผลต่อสมาธิและการโฟกัสในงานแค่ไหน",
  };
  HEADERS.forEach((h, i) => {
    if (NOTES[h]) sheet.getRange(1, i + 1).setNote(NOTES[h]);
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✅ Sheet formatted! ตอนนี้ Deploy as Web App ได้เลย");
}
