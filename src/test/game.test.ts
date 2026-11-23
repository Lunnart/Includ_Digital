import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { ROUNDS, finalMessage, isCorrect } from "@/lib/game";
import { routeTree } from "@/routeTree.gen";

describe("jogo golpe ou seguro", () => {
  it("has rounds of both kinds, so the answer is never always the same", () => {
    expect(ROUNDS.some((r) => r.answer === "golpe")).toBe(true);
    expect(ROUNDS.some((r) => r.answer === "seguro")).toBe(true);
  });

  it("gives every round a unique id", () => {
    expect(new Set(ROUNDS.map((r) => r.id)).size).toBe(ROUNDS.length);
  });

  it("marks asking for a code by phone as a scam", () => {
    const round = ROUNDS.find((r) => r.id === "central-codigo");
    expect(round && isCorrect(round, "golpe")).toBe(true);
    expect(round && isCorrect(round, "seguro")).toBe(false);
  });

  it("never ends with a losing message, even with zero right answers", () => {
    expect(finalMessage(0, 10)).toContain("ensina algo novo");
    expect(finalMessage(10, 10)).toContain("todas");
  });

  it("opens the game page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/jogo").at(-1)?.routeId).toBe("/jogo");
  });
});
