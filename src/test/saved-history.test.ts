import { describe, expect, it } from "vitest";

import {
  ASSISTANT_LIMITS,
  HISTORY_RULES,
  buildSavedContext,
  savedMessageInputSchema,
} from "@/lib/assistant-rules";

type Msg = { role: "user" | "assistant"; content: string };

const exchange = (n: number): Msg[] =>
  Array.from({ length: n }, (_, i) => [
    { role: "user" as const, content: `pergunta ${i}` },
    { role: "assistant" as const, content: `resposta ${i}` },
  ]).flat();

describe("saved conversation sent to the AI", () => {
  it("sends only the last 14 saved messages plus the new question", () => {
    const context = buildSavedContext(exchange(20), "nova pergunta");
    expect(HISTORY_RULES.contextMessages).toBe(14);
    expect(context).toHaveLength(15);
    expect(context[0]).toEqual({ role: "user", content: "pergunta 13" });
    expect(context.at(-1)).toEqual({ role: "user", content: "nova pergunta" });
  });

  it("never starts the context with an answer", () => {
    const previous: Msg[] = [{ role: "assistant", content: "resposta solta" }, ...exchange(1)];
    expect(buildSavedContext(previous, "oi")[0]?.role).toBe("user");
  });

  it("shortens long saved answers to the context limit", () => {
    const long = "a".repeat(ASSISTANT_LIMITS.maxAssistantContextChars + 500);
    const context = buildSavedContext(
      [
        { role: "user", content: "p" },
        { role: "assistant", content: long },
      ],
      "nova",
    );
    expect(context[1]?.content).toHaveLength(ASSISTANT_LIMITS.maxAssistantContextChars);
  });

  it("rejects a saved-conversation message over 800 letters", () => {
    expect(savedMessageInputSchema.safeParse({ message: "a".repeat(801) }).success).toBe(false);
    expect(savedMessageInputSchema.safeParse({ message: "a".repeat(800) }).success).toBe(true);
  });
});
