import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { chatInputSchema } from "@/lib/assistant-rules";
import { runAssistant } from "@/lib/assistant.server";

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => chatInputSchema.parse(input))
  .handler(async ({ data }) => {
    const clientKey =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonimo";
    return runAssistant(data.messages, clientKey);
  });
