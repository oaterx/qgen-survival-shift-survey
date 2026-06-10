export type AxisId = "F" | "C" | "W";
export type StatusId = "stable" | "atRisk" | "crisisVisible" | "emerging" | "deepeningSevere";

export type AxisScores = Record<AxisId, number>;
export type AxisAnswers = Record<AxisId, number[]>;

export type SurveyAnswer = {
  questionId: string;
  axis: AxisId;
  value: 1 | 2 | 3 | 4;
};

export type { DemographicAnswers, DemographicField, DemographicFieldId, DemographicOption } from "./demographics";
