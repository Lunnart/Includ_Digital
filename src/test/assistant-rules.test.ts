import { describe, expect, it } from "vitest";

import {
  ASSISTANT_LIMITS,
  asksForCredentials,
  chatInputSchema,
  detectSensitiveData,
} from "@/lib/assistant-rules";

describe("sensitive data is blocked before reaching the AI", () => {
  it("detects a valid card number", () => {
    expect(detectSensitiveData("meu cartão é 4111 1111 1111 1111")).toContain("cartao");
  });

  it("detects a valid CPF", () => {
    expect(detectSensitiveData("meu cpf 529.982.247-25")).toContain("cpf");
  });

  it("detects a password being shared", () => {
    expect(detectSensitiveData("minha senha é 1234")).toContain("senha");
  });

  it("detects a verification code being shared", () => {
    expect(detectSensitiveData("chegou o código 482913, o que faço?")).toContain("codigo");
  });

  it("detects the card security code", () => {
    expect(detectSensitiveData("o cvv é 123")).toEqual(["cvv"]);
  });

  it("lets normal questions about passwords and codes through", () => {
    expect(detectSensitiveData("Como troco a senha do Wi-Fi?")).toEqual([]);
    expect(detectSensitiveData("Pediram o código do WhatsApp, é golpe?")).toEqual([]);
    expect(detectSensitiveData("Liguei para 11 98765-4321 e ninguém atendeu")).toEqual([]);
  });
});

describe("AI answers that ask for credentials are blocked", () => {
  it("blocks a request for the password", () => {
    expect(asksForCredentials("Para ajudar, me informe sua senha do banco.")).toBe(true);
  });

  it("allows warnings that say never to share", () => {
    expect(asksForCredentials("Nunca me passe sua senha nem o código.")).toBe(false);
  });
});

describe("message limits", () => {
  const userMsg = (content: string) => ({ role: "user" as const, content });

  it("rejects a message above 800 characters", () => {
    expect(ASSISTANT_LIMITS.maxMessageChars).toBe(800);
    expect(chatInputSchema.safeParse({ messages: [userMsg("a".repeat(801))] }).success).toBe(false);
    expect(chatInputSchema.safeParse({ messages: [userMsg("a".repeat(800))] }).success).toBe(true);
  });

  it("allows at most 15 messages from the person per conversation", () => {
    const turns = (n: number) =>
      Array.from({ length: n }, (_, i) => [
        userMsg(`pergunta ${i}`),
        { role: "assistant" as const, content: `resposta ${i}` },
      ]).flat();
    const fifteen = [...turns(14), userMsg("última")];
    const sixteen = [...turns(15), userMsg("demais")];
    expect(chatInputSchema.safeParse({ messages: fifteen }).success).toBe(true);
    expect(chatInputSchema.safeParse({ messages: sixteen }).success).toBe(false);
  });

  it("requires the last message to come from the person", () => {
    expect(
      chatInputSchema.safeParse({ messages: [{ role: "assistant", content: "oi" }] }).success,
    ).toBe(false);
  });
});
