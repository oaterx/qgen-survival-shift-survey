import { describe, expect, it } from "vitest";
import { calculateSurvivalScore } from "../lib/scoring";
import { getStatusFromScore } from "../lib/status";
import { routePersonaId } from "../lib/persona-router";

const scores = (F: number, C: number, W: number) => ({ F, C, W });

describe("Survival Shift scoring", () => {
  it("calculates survival score from 1-4 answers", () => {
    expect(calculateSurvivalScore([1, 1, 1, 1, 1])).toBe(100);
    expect(calculateSurvivalScore([4, 4, 4, 4, 4])).toBe(0);
  });

  it("maps score boundaries to 5 bands", () => {
    expect(getStatusFromScore(80)).toBe("stable");
    expect(getStatusFromScore(79)).toBe("atRisk");
    expect(getStatusFromScore(60)).toBe("atRisk");
    expect(getStatusFromScore(59)).toBe("crisisVisible");
    expect(getStatusFromScore(40)).toBe("crisisVisible");
    expect(getStatusFromScore(39)).toBe("emerging");
    expect(getStatusFromScore(20)).toBe("emerging");
    expect(getStatusFromScore(19)).toBe("deepeningSevere");
    expect(getStatusFromScore(0)).toBe("deepeningSevere");
  });
});

describe("Persona routing", () => {
  it("routes all stable to Persona 01", () => {
    expect(routePersonaId(scores(80, 80, 80))).toBe("01");
  });

  it("routes financial at risk to Persona 02", () => {
    expect(routePersonaId(scores(52, 75, 73))).toBe("02");
  });

  it("routes financial crisis to Persona 03", () => {
    expect(routePersonaId(scores(24, 74, 72))).toBe("03");
  });

  it("routes career crisis to Persona 05", () => {
    expect(routePersonaId(scores(76, 26, 75))).toBe("05");
  });

  it("routes well-being crisis to Persona 07", () => {
    expect(routePersonaId(scores(75, 72, 22))).toBe("07");
  });

  it("routes all crisis to Persona 13 before Persona 12", () => {
    expect(routePersonaId(scores(20, 20, 20))).toBe("13");
  });
});
