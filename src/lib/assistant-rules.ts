// Shared (browser + server) rules for the AI assistant: limits and the
// sensitive-data checks. The server re-applies every check; the browser
// copy only gives faster, friendlier feedback.
import { z } from "zod";

export const ASSISTANT_LIMITS = {
  /** Characters per message the person types. */
  maxMessageChars: 800,
  /** Messages the person can send in one conversation. */
  maxUserMessagesPerConversation: 15,
  /** Characters kept per assistant reply when sent back as context. */
  maxAssistantContextChars: 4000,
  /** Requests per person (per connection) per minute and per hour. */
  perMinute: 5,
  perHour: 40,
  /** Longest wait for the AI before giving up. */
  timeoutMs: 30_000,
  /** Cap on the size of each AI answer. */
  maxOutputTokens: 900,
} as const;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1),
});

export const chatInputSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1)
      .max(ASSISTANT_LIMITS.maxUserMessagesPerConversation * 2),
  })
  .superRefine((value, ctx) => {
    const last = value.messages.at(-1);
    if (!last || last.role !== "user") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A última mensagem deve ser da pessoa.",
      });
    }
    const userCount = value.messages.filter((m) => m.role === "user").length;
    if (userCount > ASSISTANT_LIMITS.maxUserMessagesPerConversation) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Limite de mensagens atingido." });
    }
    value.messages.forEach((m, index) => {
      const max =
        m.role === "user"
          ? ASSISTANT_LIMITS.maxMessageChars
          : ASSISTANT_LIMITS.maxAssistantContextChars;
      if (m.content.length > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["messages", index, "content"],
          message: "Mensagem longa demais.",
        });
      }
    });
  });

export type ChatInput = z.infer<typeof chatInputSchema>;

/** Rules for the saved conversation (signed in with consent). */
export const HISTORY_RULES = {
  /** Version of the consent text the person accepted. Change it when the text changes. */
  termsVersion: "2026-11-23",
  /** Previous saved messages sent to the AI as context with each new question. */
  contextMessages: 14,
  /** Most recent saved messages shown on the page. */
  shownMessages: 300,
  /** Longest text stored per message. */
  maxStoredChars: 8000,
} as const;

export const savedMessageInputSchema = z.object({
  message: z.string().trim().min(1).max(ASSISTANT_LIMITS.maxMessageChars),
});

/**
 * Builds what the AI sees for a saved conversation: only the most recent saved
 * messages (starting with a question), long answers shortened, then the new question.
 */
export function buildSavedContext(
  previous: { role: "user" | "assistant"; content: string }[],
  message: string,
): { role: "user" | "assistant"; content: string }[] {
  const recent = previous.slice(-HISTORY_RULES.contextMessages);
  while (recent[0]?.role === "assistant") recent.shift();
  return [
    ...recent.map((m) =>
      m.role === "assistant"
        ? { role: m.role, content: m.content.slice(0, ASSISTANT_LIMITS.maxAssistantContextChars) }
        : m,
    ),
    { role: "user", content: message },
  ];
}
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export type SensitiveKind = "cartao" | "cpf" | "senha" | "codigo" | "cvv";

export const SENSITIVE_LABELS: Record<SensitiveKind, string> = {
  cartao: "um número de cartão",
  cpf: "um CPF",
  senha: "uma senha",
  codigo: "um código de verificação",
  cvv: "o código de segurança do cartão",
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

function isValidCpf(digits: string): boolean {
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(digits[9]) && calc(10) === Number(digits[10]);
}

/** Finds data a person should never share in the chat (cards, CPF, passwords, codes). */
export function detectSensitiveData(text: string): SensitiveKind[] {
  const found = new Set<SensitiveKind>();

  for (const match of text.matchAll(/(?:\d[ .-]?){13,19}/g)) {
    const digits = digitsOnly(match[0]);
    if (digits.length >= 13 && digits.length <= 19 && passesLuhn(digits)) found.add("cartao");
  }

  for (const match of text.matchAll(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g)) {
    if (isValidCpf(digitsOnly(match[0]))) found.add("cpf");
  }

  // "minha senha é 1234", "senha: abc123", "pin = 4321"
  if (/\b(?:senha|pin)\b\s*(?:é|eh|e|:|=|seria)\s*\S*\d\S*/i.test(text)) found.add("senha");

  // "o código é 123456", "codigo: 482913", "código que chegou 123 456"
  if (/\bc[oó]digo\b[^\d\n]{0,30}\d(?:[ -]?\d){3,7}\b/i.test(text)) found.add("codigo");

  if (/\b(?:cvv|cvc|c[oó]digo de seguran[cç]a)\b[^\d\n]{0,20}\d{3,4}\b/i.test(text)) {
    found.add("cvv");
    found.delete("codigo");
  }

  return [...found];
}

export function describeSensitive(kinds: SensitiveKind[]): string {
  const labels = kinds.map((k) => SENSITIVE_LABELS[k]);
  const list =
    labels.length <= 1 ? (labels[0] ?? "") : `${labels.slice(0, -1).join(", ")} e ${labels.at(-1)}`;
  return `Parece que sua mensagem tem ${list}. Por segurança, apague essa parte antes de enviar. Ninguém precisa desses dados para ajudar você, nem este assistente.`;
}

/**
 * Defense in depth on AI output: flags answers that ask the person to send
 * passwords, codes or card data. Warnings such as "nunca me passe sua senha" are allowed.
 */
export function asksForCredentials(text: string): boolean {
  const pattern =
    /\b(?:me|nos)\s+(?:envie|informe|passe|mande|diga|fale|conte|digite)\s+(?:aqui\s+)?(?:a\s+|o\s+|sua\s+|seu\s+)?(?:senha|c[oó]digo|n[uú]mero do cart[aã]o|cpf|dados banc[aá]rios)/gi;
  for (const match of text.matchAll(pattern)) {
    const before = text.slice(Math.max(0, (match.index ?? 0) - 15), match.index ?? 0);
    if (!/\b(?:nunca|não|nao|jamais)\s*$/i.test(before)) return true;
  }
  return false;
}
