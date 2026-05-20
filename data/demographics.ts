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
      opt("student_intern",          "นักศึกษา / Intern"),
      opt("entry_junior",            "Entry Level / Junior Staff"),
      opt("officer_specialist",      "Officer / Specialist"),
      opt("senior_officer",          "Senior Officer / Senior Specialist"),
      opt("supervisor_teamlead",     "Supervisor / Team Lead"),
      opt("manager",                 "Manager"),
      opt("senior_manager_head",     "Senior Manager / Head of Department"),
      opt("director_vp_c",           "Director / VP / C-Level"),
      opt("owner_freelancer",        "เจ้าของกิจการ / Freelancer / Self-employed"),
      opt("other",                   "อื่น ๆ"),
      opt("prefer_not_to_say",       "ไม่สะดวกตอบ"),
    ],
  },
  {
    id: "industry",
    label: "อุตสาหกรรม / ประเภทธุรกิจ",
    required: true,
    options: [
      opt("tech_it_software",        "Technology / IT / Software"),
      opt("financial_banking",       "Financial Services / Banking / Insurance"),
      opt("retail_ecommerce",        "Retail / E-commerce"),
      opt("manufacturing",           "Manufacturing / Industrial"),
      opt("fmcg",                    "FMCG / Consumer Goods"),
      opt("healthcare_pharma",       "Healthcare / Pharma"),
      opt("real_estate",             "Real Estate / Construction"),
      opt("logistics",               "Logistics / Transportation"),
      opt("energy_utilities",        "Energy / Utilities"),
      opt("education",               "Education"),
      opt("hospitality_tourism",     "Hospitality / Tourism"),
      opt("media_marketing",         "Media / Marketing / Creative"),
      opt("consulting",              "Professional Services / Consulting"),
      opt("government_ngo",          "Government / State Enterprise / NGO"),
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
