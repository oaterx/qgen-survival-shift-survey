import { personas } from "../data/personas";
import type { AxisScores } from "../data/types";

const stable = (score: number) => score >= 67;
const atRisk = (score: number) => score > 33 && score < 67;
const crisis = (score: number) => score <= 33;
const notStable = (score: number) => score < 67;

export function routePersonaId(scores: AxisScores): string {
  const { F, C, W } = scores;

  // IMPORTANT: Check Persona 13 before Persona 12.
  if (crisis(F) && crisis(C) && crisis(W)) return "13";

  if (stable(F) && stable(C) && stable(W)) return "01";

  if (atRisk(F) && stable(C) && stable(W)) return "02";
  if (crisis(F) && stable(C) && stable(W)) return "03";

  if (stable(F) && atRisk(C) && stable(W)) return "04";
  if (stable(F) && crisis(C) && stable(W)) return "05";

  if (stable(F) && stable(C) && atRisk(W)) return "06";
  if (stable(F) && stable(C) && crisis(W)) return "07";

  if (notStable(F) && notStable(C) && stable(W)) return "08";
  if (notStable(F) && stable(C) && notStable(W)) return "09";
  if (stable(F) && notStable(C) && notStable(W)) return "10";

  if (atRisk(F) && atRisk(C) && atRisk(W)) return "11";

  if (notStable(F) && notStable(C) && notStable(W) && (crisis(F) || crisis(C) || crisis(W))) return "12";

  throw new Error(`No persona matched for scores F:${F}, C:${C}, W:${W}`);
}

export function routePersona(scores: AxisScores) {
  const id = routePersonaId(scores);
  const persona = personas.find((item) => item.id === id);
  if (!persona) throw new Error(`Persona ${id} not found`);
  return persona;
}
