import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { HISTORY_RULES, buildSavedContext, savedMessageInputSchema } from "@/lib/assistant-rules";
import { runAssistant, type AssistantErrorCode } from "@/lib/assistant.server";

export type SavedMessage = { id: string; role: "user" | "assistant"; content: string };

export type SavedAssistantResult =
  | { ok: true; text: string; truncated: boolean; saved: boolean }
  | { ok: false; code: AssistantErrorCode | "no_consent"; message: string };

const asRole = (role: string): "user" | "assistant" =>
  role === "assistant" ? "assistant" : "user";

// Log only error codes, never the conversation.
function logDbError(where: string, error: { code?: string } | null) {
  if (error) console.error(`history: ${where} failed`, { code: error.code });
}

/** The signed-in person's consent and saved conversation (only their own rows, by RLS). */
export const getSavedConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [consent, rows] = await Promise.all([
      supabase.from("history_consents").select("user_id").eq("user_id", userId).maybeSingle(),
      supabase
        .from("assistant_messages")
        .select("id, role, content")
        .eq("user_id", userId)
        .order("seq", { ascending: false })
        .limit(HISTORY_RULES.shownMessages),
    ]);
    if (consent.error || rows.error) {
      logDbError("load consent", consent.error);
      logDbError("load messages", rows.error);
      throw new Error("Não foi possível abrir a conversa guardada.");
    }
    const messages: SavedMessage[] = (rows.data ?? [])
      .reverse()
      .map((r) => ({ id: r.id, role: asRole(r.role), content: r.content }));
    return { consented: consent.data !== null, messages };
  });

export const giveHistoryConsent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("history_consents")
      .insert({ user_id: context.userId, terms_version: HISTORY_RULES.termsVersion });
    // 23505: consent already given.
    if (error && error.code !== "23505") {
      logDbError("give consent", error);
      throw new Error("Não foi possível registrar sua escolha.");
    }
    return { ok: true as const };
  });

export const clearSavedConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("assistant_messages")
      .delete()
      .eq("user_id", context.userId);
    if (error) {
      logDbError("clear messages", error);
      throw new Error("Não foi possível apagar a conversa.");
    }
    return { ok: true as const };
  });

/** Withdraws consent: deletes every saved message, then the consent itself. */
export const stopSavingHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const messages = await supabase.from("assistant_messages").delete().eq("user_id", userId);
    if (messages.error) {
      logDbError("clear messages", messages.error);
      throw new Error("Não foi possível apagar a conversa.");
    }
    const consent = await supabase.from("history_consents").delete().eq("user_id", userId);
    if (consent.error) {
      logDbError("withdraw consent", consent.error);
      throw new Error("Não foi possível registrar sua escolha.");
    }
    return { ok: true as const };
  });

/** Deletes the person's saved data and their account. */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const messages = await supabase.from("assistant_messages").delete().eq("user_id", userId);
    const consent = await supabase.from("history_consents").delete().eq("user_id", userId);
    if (messages.error || consent.error) {
      logDbError("delete account messages", messages.error);
      logDbError("delete account consent", consent.error);
      throw new Error("Não foi possível apagar a conta.");
    }
    // Privileged step, only for the verified caller's own id.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("history: delete user failed", { status: error.status });
      throw new Error("Não foi possível apagar a conta.");
    }
    return { ok: true as const };
  });

/** Asks the assistant inside the saved conversation and stores the question and answer. */
export const askSavedAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => savedMessageInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<SavedAssistantResult> => {
    const { supabase, userId } = context;
    const unavailable: SavedAssistantResult = {
      ok: false,
      code: "unavailable",
      message: "Não foi possível abrir sua conversa guardada. Tente de novo daqui a pouco.",
    };

    const consent = await supabase
      .from("history_consents")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (consent.error) {
      logDbError("check consent", consent.error);
      return unavailable;
    }
    if (!consent.data) {
      return {
        ok: false,
        code: "no_consent",
        message: "Para guardar a conversa, primeiro confirme que você aceita guardar.",
      };
    }

    const previous = await supabase
      .from("assistant_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("seq", { ascending: false })
      .limit(HISTORY_RULES.contextMessages);
    if (previous.error) {
      logDbError("load context", previous.error);
      return unavailable;
    }

    const history = buildSavedContext(
      (previous.data ?? []).reverse().map((r) => ({ role: asRole(r.role), content: r.content })),
      data.message,
    );
    const result = await runAssistant(history, `user:${userId}`);
    if (!result.ok) return result;

    const { error } = await supabase.from("assistant_messages").insert([
      { user_id: userId, role: "user", content: data.message },
      {
        user_id: userId,
        role: "assistant",
        content: result.text.slice(0, HISTORY_RULES.maxStoredChars),
      },
    ]);
    if (error) logDbError("save exchange", error);
    return { ...result, saved: !error };
  });
