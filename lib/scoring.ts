import type { AxisAnswers, AxisId, SurveyAnswer } from "../data/types";
import { getStatusFromScore } from "./status";

export function calculateSurvivalScore(values: number[]): number {
  if (!values.length) throw new Error("calculateSurvivalScore requires at least one answer");
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return ((4 - average) / 3) * 100;
}

export function calculateAxisScores(answersByAxis: AxisAnswers): Record<AxisId, number> {
  return {
    F: calculateSurvivalScore(answersByAxis.F),
    C: calculateSurvivalScore(answersByAxis.C),
    W: calculateSurvivalScore(answersByAxis.W),
  };
}

export function groupAnswersByAxis(answers: SurveyAnswer[]): AxisAnswers {
  const grouped: AxisAnswers = { F: [], C: [], W: [] };
  for (const answer of answers) grouped[answer.axis].push(answer.value);
  return grouped;
}

export function getAxisResult(scores: Record<AxisId, number>) {
  return {
    F: { score: scores.F, roundedScore: Math.round(scores.F), status: getStatusFromScore(scores.F) },
    C: { score: scores.C, roundedScore: Math.round(scores.C), status: getStatusFromScore(scores.C) },
    W: { score: scores.W, roundedScore: Math.round(scores.W), status: getStatusFromScore(scores.W) },
  };
}
