import { describe, expect, it } from "vitest";

import { ASSISTANT_LIMITS } from "@/lib/assistant-rules";
import { createRateLimiter } from "@/lib/rate-limit";

describe("assistant request frequency", () => {
  const rules = [
    { limit: ASSISTANT_LIMITS.perMinute, windowMs: 60_000 },
    { limit: ASSISTANT_LIMITS.perHour, windowMs: 3_600_000 },
  ];

  it("allows 5 messages per minute and blocks the 6th", () => {
    const check = createRateLimiter(rules);
    for (let i = 0; i < 5; i++) expect(check("pessoa", 1000 + i).allowed).toBe(true);
    expect(check("pessoa", 1010).allowed).toBe(false);
    expect(check("outra-pessoa", 1010).allowed).toBe(true);
  });

  it("frees up again after a minute", () => {
    const check = createRateLimiter(rules);
    for (let i = 0; i < 5; i++) check("pessoa", i);
    expect(check("pessoa", 61_000).allowed).toBe(true);
  });

  it("allows at most 40 messages per hour", () => {
    const check = createRateLimiter(rules);
    for (let i = 0; i < 40; i++) expect(check("pessoa", i * 61_000).allowed).toBe(true);
    expect(check("pessoa", 40 * 61_000).allowed).toBe(false);
  });
});
