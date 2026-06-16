export type DemographicFieldId = "positionLevel" | "industry" | "ageRange" | "incomeRange";

export type DemographicOption = {
  value: string;
  label: string;
};

export type DemographicField = {
  id: DemographicFieldId;
  label: string;
  helperText?: string;
  required: boolean;
  options: DemographicOption[];
};

export type DemographicAnswers = Partial<Record<DemographicFieldId, string>>;

const opt = (value: string, label?: string): DemographicOption => ({
  value,
  label: label ?? value,
});

export const demographicFields: DemographicField[] = [
  {
    id: "positionLevel",
    label: "ระดับตำแหน่งงาน",
    required: true,
    options: [
      opt("student_intern",          "นักศึกษา / ฝึกงาน"),
      opt("entry_junior",            "พนักงานระดับเริ่มต้น"),
      opt("officer",                 "เจ้าหน้าที่"),
      opt("specialist",              "ผู้เชี่ยวชาญ"),
      opt("senior_officer",          "เจ้าหน้าที่อาวุโส"),
      opt("senior_specialist",       "ผู้เชี่ยวชาญอาวุโส"),
      opt("supervisor_teamlead",     "หัวหน้างาน"),
      opt("manager",                 "ผู้จัดการ"),
      opt("senior_manager_head",     "ผู้จัดการอาวุโส / หัวหน้าแผนก"),
      opt("director_vp",             "ผู้อำนวยการ / VP"),
      opt("c_level",                 "ผู้บริหารระดับสูง (C-Level)"),
      opt("owner",                   "เจ้าของกิจการ"),
      opt("freelancer",              "ฟรีแลนซ์"),
      opt("other",                   "อื่น ๆ"),
      opt("prefer_not_to_say",       "ไม่สะดวกตอบ"),
    ],
  },
  {
    id: "industry",
    label: "อุตสาหกรรม / ประเภทธุรกิจ",
    required: true,
    options: [
      opt("tech_it_software",        "เทคโนโลยี / ไอที"),
      opt("financial_banking",       "การเงิน / ธนาคาร / ประกัน"),
      opt("retail_ecommerce",        "ค้าปลีก / อีคอมเมิร์ซ"),
      opt("manufacturing",           "การผลิต / อุตสาหกรรม"),
      opt("fmcg",                    "สินค้าอุปโภคบริโภค (FMCG)"),
      opt("healthcare_pharma",       "สาธารณสุข / เภสัชกรรม"),
      opt("real_estate",             "อสังหาริมทรัพย์ / ก่อสร้าง"),
      opt("logistics",               "โลจิสติกส์ / ขนส่ง"),
      opt("energy_utilities",        "พลังงาน / สาธารณูปโภค"),
      opt("education",               "การศึกษา"),
      opt("hospitality_tourism",     "การบริการ / ท่องเที่ยว"),
      opt("media_marketing",         "สื่อ / การตลาด / ครีเอทีฟ"),
      opt("consulting",              "ที่ปรึกษา / บริการวิชาชีพ"),
      opt("government_ngo",          "ราชการ / รัฐวิสาหกิจ / NGO"),
      opt("other",                   "อื่น ๆ"),
      opt("prefer_not_to_say",       "ไม่สะดวกตอบ"),
    ],
  },
  {
    id: "ageRange",
    label: "ช่วงอายุ",
    required: true,
    options: [
      opt("under_22",   "ต่ำกว่า 22 ปี"),
      opt("22_25",      "22–25 ปี"),
      opt("26_30",      "26–30 ปี"),
      opt("31_35",      "31–35 ปี"),
      opt("36_40",      "36–40 ปี"),
      opt("41_45",      "41–45 ปี"),
      opt("46_50",      "46–50 ปี"),
      opt("51_plus",    "51 ปีขึ้นไป"),
      opt("prefer_not_to_say", "ไม่สะดวกตอบ"),
    ],
  },
  {
    id: "incomeRange",
    label: "ช่วงรายได้ต่อเดือน",
    helperText: "รายได้รวมต่อเดือนโดยประมาณก่อนหักค่าใช้จ่าย",
    required: false,
    options: [
      opt("under_15k",      "ต่ำกว่า 15,000 บาท"),
      opt("15k_24999",      "15,000–24,999 บาท"),
      opt("25k_34999",      "25,000–34,999 บาท"),
      opt("35k_49999",      "35,000–49,999 บาท"),
      opt("50k_74999",      "50,000–74,999 บาท"),
      opt("75k_99999",      "75,000–99,999 บาท"),
      opt("100k_149999",    "100,000–149,999 บาท"),
      opt("150k_plus",      "150,000 บาทขึ้นไป"),
      opt("prefer_not_to_say", "ไม่สะดวกตอบ"),
    ],
  },
];
