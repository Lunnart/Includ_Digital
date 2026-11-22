// Server-only: talks to the AI. Never import this from routes or components.
import { GatewayError, generateResponse } from "@lovable.dev/ai-gateway";

import {
  ASSISTANT_LIMITS,
  asksForCredentials,
  describeSensitive,
  detectSensitiveData,
  type ChatMessage,
} from "@/lib/assistant-rules";
import { createRateLimiter } from "@/lib/rate-limit";

export type AssistantResult =
  | { ok: true; text: string; truncated: boolean }
  | { ok: false; code: AssistantErrorCode; message: string };

export type AssistantErrorCode =
  "sensitive" | "rate_limited" | "busy" | "timeout" | "unavailable" | "blocked" | "empty";

const SYSTEM_PROMPT = `Você é o assistente do site "Passo a Passo Digital", que ajuda pessoas idosas a usar celular, internet e aplicativos com segurança.

Como responder:
- Sempre em português do Brasil, com respeito e calma. Trate a pessoa como adulta capaz. Nunca use diminutivos, tom infantil ou expressões como "vovô" e "vovó".
- Use frases curtas e palavras simples.
- Para ensinar uma tarefa, dê passos numerados, um por linha, no máximo 7 passos.
- Quando usar uma palavra técnica, explique em seguida entre parênteses. Exemplo: navegador (o aplicativo que abre os sites).
- Os menus mudam conforme o celular. Se não souber o modelo, explique o caminho geral para Android e iPhone e diga que os nomes podem variar. Se precisar, pergunte qual é o celular.
- Seja breve: no máximo uns 200 palavras por resposta.

Segurança, sempre:
- Nunca peça e nunca aceite senhas, PIN, códigos recebidos por mensagem, número do cartão, código de segurança do cartão, CPF ou dados bancários. Se a pessoa oferecer, diga para não compartilhar com ninguém.
- Se a situação parecer golpe (pressa, pedido de dinheiro, prêmio, link estranho, alguém dizendo ser do banco), avise com clareza e oriente: não clicar, não pagar, desligar e confirmar pelos canais oficiais, como o número atrás do cartão.
- Nunca diga para instalar aplicativos de acesso remoto ou enviar dinheiro.

Honestidade:
- Não invente informações, números de telefone, endereços de sites ou passos. Se não tiver certeza, diga que não sabe e sugira procurar o atendimento oficial da empresa ou uma pessoa de confiança.
- Para dúvidas de saúde, leis ou dinheiro que fujam do uso do celular e da internet, diga com gentileza que não é o assunto deste assistente e sugira procurar um profissional.`;

const MODEL = "openai/gpt-6-astra";

const checkRate = createRateLimiter([
  { limit: ASSISTANT_LIMITS.perMinute, windowMs: 60_000 },
  { limit: ASSISTANT_LIMITS.perHour, windowMs: 3_600_000 },
]);

function extractText(response: unknown): string {
  const output = (response as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object" || (item as { type?: unknown }).type !== "message")
      continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (part && typeof part === "object" && (part as { type?: unknown }).type === "output_text") {
        const text = (part as { text?: unknown }).text;
        if (typeof text === "string") parts.push(text);
      }
    }
  }
  return parts.join("").trim();
}

export async function runAssistant(
  messages: ChatMessage[],
  clientKey: string,
): Promise<AssistantResult> {
  for (const message of messages) {
    if (message.role !== "user") continue;
    const kinds = detectSensitiveData(message.content);
    if (kinds.length > 0) {
      return { ok: false, code: "sensitive", message: describeSensitive(kinds) };
    }
  }

  const rate = checkRate(clientKey);
  if (!rate.allowed) {
    const minutes = Math.max(1, Math.ceil(rate.retryAfterMs / 60_000));
    return {
      ok: false,
      code: "rate_limited",
      message: `Você enviou muitas mensagens em pouco tempo. Aguarde ${minutes} ${minutes === 1 ? "minuto" : "minutos"} e tente de novo.`,
    };
  }

  try {
    const response = await generateResponse(
      {
        model: MODEL,
        instructions: SYSTEM_PROMPT,
        input: messages.map((m) => ({ role: m.role, content: m.content })),
        max_output_tokens: ASSISTANT_LIMITS.maxOutputTokens,
        reasoning: { effort: "low" },
      },
      { signal: AbortSignal.timeout(ASSISTANT_LIMITS.timeoutMs) },
    );

    const text = extractText(response);
    if (!text) {
      console.error("assistant: empty answer", {
        status: (response as { status?: unknown }).status,
      });
      return {
        ok: false,
        code: "empty",
        message:
          "O assistente não conseguiu responder desta vez. Tente escrever a pergunta de outro jeito.",
      };
    }
    if (asksForCredentials(text)) {
      console.error("assistant: answer blocked by credential filter");
      return {
        ok: false,
        code: "blocked",
        message:
          "Por segurança, esta resposta foi bloqueada. Lembre-se: ninguém precisa da sua senha ou de códigos para ajudar você.",
      };
    }
    const truncated = (response as { status?: unknown }).status === "incomplete";
    return { ok: true, text, truncated };
  } catch (error) {
    if (error instanceof GatewayError) {
      // Log only diagnostic fields, never the conversation.
      console.error("assistant: gateway error", {
        code: error.code,
        status: error.httpStatus,
        ids: error.ids,
      });
      if (error.code === "rate_limited") {
        return {
          ok: false,
          code: "busy",
          message: "O assistente está com muitos pedidos agora. Aguarde um pouco e tente de novo.",
        };
      }
      if (error.code === "timeout" || error.code === "cancelled") {
        return {
          ok: false,
          code: "timeout",
          message: "O assistente demorou demais para responder. Tente de novo daqui a pouco.",
        };
      }
    } else {
      console.error(
        "assistant: unexpected error",
        error instanceof Error ? error.name : typeof error,
      );
    }
    return {
      ok: false,
      code: "unavailable",
      message: "O assistente está indisponível no momento. Tente de novo mais tarde.",
    };
  }
}
