import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  RotateCcw,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputController,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ConfirmAction } from "@/components/assistant/confirm-action";
import { HistoryPanel, type HistoryMode } from "@/components/assistant/history-panel";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { askAssistant } from "@/lib/assistant.functions";
import { useAuth } from "@/lib/auth";
import {
  askSavedAssistant,
  clearSavedConversation,
  deleteMyAccount,
  getSavedConversation,
  giveHistoryConsent,
  stopSavingHistory,
  type SavedMessage,
} from "@/lib/history.functions";
import { ASSISTANT_LIMITS, describeSensitive, detectSensitiveData } from "@/lib/assistant-rules";

const TITLE = "Converse com o assistente — Passo a Passo Digital";
const DESCRIPTION =
  "Escreva sua dúvida sobre celular, internet ou golpes e receba uma resposta simples, passo a passo.";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistentePage,
});

type ChatEntry = { id: string; role: "user" | "assistant"; content: string };
type Notice = { kind: "error" | "sensitive" | "info"; text: string };
type SavedConversation = { consented: boolean; messages: SavedMessage[] };

const SUGGESTIONS = [
  "Como faço uma chamada de vídeo pelo WhatsApp?",
  "Recebi uma mensagem dizendo que ganhei um prêmio. É golpe?",
  "Como deixo as letras do celular maiores?",
  "Como conecto o celular no Wi-Fi de casa?",
];

let nextId = 0;
const newId = () => `m${Date.now()}-${nextId++}`;

class BlockedSubmit extends Error {}

function AssistentePage() {
  return (
    <PromptInputProvider>
      <AssistantChat />
    </PromptInputProvider>
  );
}

function AssistantChat() {
  const ask = useServerFn(askAssistant);
  const askSaved = useServerFn(askSavedAssistant);
  const fetchSaved = useServerFn(getSavedConversation);
  const consent = useServerFn(giveHistoryConsent);
  const clearSaved = useServerFn(clearSavedConversation);
  const stopSaving = useServerFn(stopSavingHistory);
  const deleteAccount = useServerFn(deleteMyAccount);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const controller = usePromptInputController();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [pending, setPending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const loadedFor = useRef<string | null>(null);

  const savedKey = ["saved-conversation", user?.id ?? "nobody"] as const;
  const saved = useQuery({
    queryKey: savedKey,
    queryFn: () => fetchSaved(),
    enabled: !!user,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const mode: HistoryMode = !ready
    ? "loading"
    : !user || saved.isError
      ? "guest"
      : saved.isPending
        ? "loading"
        : saved.data.consented
          ? "saved"
          : declined
            ? "declined"
            : "consent";
  const saving = mode === "saved";

  // Show the saved conversation once per signed-in person; clear the page when they leave.
  useEffect(() => {
    if (!user) {
      if (loadedFor.current) {
        loadedFor.current = null;
        setMessages([]);
      }
      return;
    }
    if (!saved.data?.consented || loadedFor.current === user.id) return;
    loadedFor.current = user.id;
    setMessages(saved.data.messages);
  }, [user, saved.data]);

  const text = controller.textInput.value;
  const userCount = messages.filter((m) => m.role === "user").length;
  const remaining = ASSISTANT_LIMITS.maxUserMessagesPerConversation - userCount;
  const limitReached = !saving && remaining <= 0;
  const tooLong = text.length > ASSISTANT_LIMITS.maxMessageChars;
  const inputLocked = limitReached || mode === "loading" || mode === "consent" || busy;

  function setSaved(next: SavedConversation) {
    queryClient.setQueryData<SavedConversation>(savedKey, next);
  }

  async function runAction(action: () => Promise<void>, failure: string) {
    setBusy(true);
    setNotice(null);
    try {
      await action();
    } catch {
      showNotice({ kind: "error", text: failure });
    } finally {
      setBusy(false);
    }
  }

  function giveConsent() {
    void runAction(async () => {
      await consent();
      loadedFor.current = null;
      setSaved({ consented: true, messages: [] });
    }, "Não foi possível registrar sua escolha. Tente de novo.");
  }

  function clearConversation() {
    void runAction(async () => {
      await clearSaved();
      setMessages([]);
      setSaved({ consented: true, messages: [] });
      controller.textInput.clear();
      showNotice({ kind: "info", text: "A conversa guardada foi apagada." });
    }, "Não foi possível apagar a conversa. Tente de novo.");
  }

  function stopSavingAll() {
    void runAction(async () => {
      await stopSaving();
      setMessages([]);
      setDeclined(true);
      setSaved({ consented: false, messages: [] });
      showNotice({
        kind: "info",
        text: "Tudo foi apagado. A partir de agora, suas conversas não são guardadas.",
      });
    }, "Não foi possível apagar tudo. Tente de novo.");
  }

  function removeAccount() {
    void runAction(async () => {
      await deleteAccount();
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut({ scope: "local" });
      setMessages([]);
      await navigate({ to: "/assistente", replace: true });
      showNotice({
        kind: "info",
        text: "Sua conta e sua conversa guardada foram apagadas. Você pode continuar usando o site sem conta.",
      });
    }, "Não foi possível apagar a conta. Tente de novo.");
  }

  function showNotice(next: Notice) {
    setNotice(next);
    requestAnimationFrame(() => noticeRef.current?.focus());
  }

  /** Validates in the browser first; throwing keeps the typed text in the box. */
  function validate(raw: string): string {
    const value = raw.trim();
    if (!value || pending || inputLocked) throw new BlockedSubmit();
    if (limitReached) {
      showNotice({
        kind: "error",
        text: "Esta conversa chegou ao limite de mensagens. Toque em Começar nova conversa.",
      });
      throw new BlockedSubmit();
    }
    if (value.length > ASSISTANT_LIMITS.maxMessageChars) {
      showNotice({
        kind: "error",
        text: `Sua mensagem está longa demais. Use até ${ASSISTANT_LIMITS.maxMessageChars} letras.`,
      });
      throw new BlockedSubmit();
    }
    const sensitive = detectSensitiveData(value);
    if (sensitive.length > 0) {
      showNotice({ kind: "sensitive", text: describeSensitive(sensitive) });
      throw new BlockedSubmit();
    }
    return value;
  }

  async function send(value: string) {
    const userEntry: ChatEntry = { id: newId(), role: "user", content: value };
    const history = [...messages, userEntry];
    setMessages(history);
    setNotice(null);
    setPending(true);

    const restore = (next: Notice) => {
      setMessages((current) => current.filter((m) => m.id !== userEntry.id));
      controller.textInput.setInput(value);
      showNotice(next);
    };

    try {
      const result = saving
        ? await askSaved({ data: { message: value } })
        : await ask({
            data: {
              messages: history.map((m) => ({
                role: m.role,
                content:
                  m.role === "assistant"
                    ? m.content.slice(0, ASSISTANT_LIMITS.maxAssistantContextChars)
                    : m.content,
              })),
            },
          });
      if (result.ok) {
        const content = result.truncated
          ? `${result.text}\n\n_A resposta ficou longa e foi cortada. Se quiser, peça para continuar._`
          : result.text;
        setMessages((current) => [...current, { id: newId(), role: "assistant", content }]);
        if ("saved" in result && !result.saved) {
          showNotice({
            kind: "error",
            text: "A resposta chegou, mas não foi possível guardar esta parte da conversa.",
          });
        }
      } else if (result.code === "no_consent") {
        restore({ kind: "error", text: result.message });
        void saved.refetch();
      } else {
        restore({
          kind: result.code === "sensitive" ? "sensitive" : "error",
          text: result.message,
        });
      }
    } catch {
      restore({
        kind: "error",
        text: "Não foi possível falar com o assistente. Confira sua internet e tente de novo.",
      });
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(message: PromptInputMessage) {
    const value = validate(message.text);
    void send(value);
  }

  function pickSuggestion(suggestion: string) {
    try {
      const value = validate(suggestion);
      void send(value);
    } catch {
      // Notice already shown.
    }
  }

  function restart() {
    setMessages([]);
    setNotice(null);
    controller.textInput.clear();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Brand mark of the site; no generated identity image yet. */}
          <span
            aria-hidden="true"
            className="hidden size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:flex"
          >
            <HeartHandshake className="size-9" />
          </span>
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl">Converse com o assistente</h1>
            <p className="mt-1 text-xl text-muted-foreground">
              Pergunte com suas palavras, sem pressa.
            </p>
          </div>
        </div>
        {messages.length > 0 &&
          (saving ? (
            <ConfirmAction
              trigger={
                <>
                  <RotateCcw aria-hidden="true" />
                  Apagar conversa e começar de novo
                </>
              }
              title="Apagar a conversa guardada?"
              description="A conversa guardada será apagada para sempre. As próximas perguntas continuam sendo guardadas."
              confirmLabel="Sim, apagar a conversa"
              onConfirm={clearConversation}
              disabled={pending || busy}
            />
          ) : (
            <Button type="button" variant="outline" size="xl" onClick={restart} disabled={pending}>
              <RotateCcw aria-hidden="true" />
              Começar nova conversa
            </Button>
          ))}
      </div>

      <HistoryPanel
        mode={mode}
        busy={busy || pending}
        onConsent={giveConsent}
        onDecline={() => setDeclined(true)}
        onReconsider={() => setDeclined(false)}
        onStopSaving={stopSavingAll}
        onDeleteAccount={removeAccount}
      />

      {saved.isError && user && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-destructive bg-card p-5 text-xl">
          <AlertCircle aria-hidden="true" className="size-8 shrink-0 text-destructive" />
          <p className="flex-1">
            Não foi possível abrir sua conversa guardada. Por enquanto, esta conversa não será
            guardada.
          </p>
          <Button type="button" variant="outline" size="touch" onClick={() => void saved.refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      <section
        aria-label="Conversa"
        className="mt-6 flex min-h-[24rem] flex-col rounded-2xl border-2 border-border bg-card"
      >
        <Conversation
          className="max-h-[60vh] min-h-[24rem]"
          aria-live="polite"
          aria-label="Mensagens"
        >
          <ConversationContent className="gap-6 p-5 sm:p-6">
            {messages.length === 0 ? (
              <div className="py-4">
                <h2 className="text-2xl font-bold">Comece por uma destas perguntas</h2>
                <p className="mt-1 text-lg text-muted-foreground">
                  Ou escreva a sua no espaço abaixo.
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <li key={suggestion}>
                      <Button
                        type="button"
                        variant="outline"
                        size="xl"
                        className="h-full w-full justify-start text-left text-lg"
                        onClick={() => pickSuggestion(suggestion)}
                        disabled={pending || inputLocked}
                      >
                        {suggestion}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <p className="sr-only">
                    {m.role === "user" ? "Você disse:" : "O assistente respondeu:"}
                  </p>
                  <MessageContent
                    className={
                      m.role === "user"
                        ? "text-xl group-[.is-user]:rounded-2xl group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                        : "text-xl leading-relaxed [&_li]:my-1 [&_ol]:pl-7 [&_ul]:pl-7"
                    }
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <MessageResponse>{m.content}</MessageResponse>
                    )}
                  </MessageContent>
                </Message>
              ))
            )}
            {pending && (
              <Message from="assistant">
                <MessageContent className="text-xl">
                  <Shimmer>Escrevendo a resposta…</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton
            aria-label="Ir para a última mensagem"
            className="min-h-12 min-w-12"
          />
        </Conversation>
      </section>

      {notice && (
        <div
          ref={noticeRef}
          tabIndex={-1}
          role={notice.kind === "info" ? "status" : "alert"}
          className={
            notice.kind === "sensitive"
              ? "mt-5 flex gap-3 rounded-2xl border-2 border-safety-border bg-safety p-5 text-xl text-safety-foreground"
              : notice.kind === "info"
                ? "mt-5 flex gap-3 rounded-2xl border-2 border-primary bg-card p-5 text-xl text-foreground"
                : "mt-5 flex gap-3 rounded-2xl border-2 border-destructive bg-card p-5 text-xl text-foreground"
          }
        >
          {notice.kind === "sensitive" ? (
            <ShieldAlert aria-hidden="true" className="size-8 shrink-0" />
          ) : notice.kind === "info" ? (
            <CheckCircle2 aria-hidden="true" className="size-8 shrink-0 text-primary" />
          ) : (
            <AlertCircle aria-hidden="true" className="size-8 shrink-0 text-destructive" />
          )}
          <p>{notice.text}</p>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="pergunta" className="text-xl font-bold">
          Sua pergunta
        </label>
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-2 [&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:border-2 [&_[data-slot=input-group]]:border-input [&_[data-slot=input-group]]:bg-card"
        >
          <PromptInputTextarea
            id="pergunta"
            placeholder="Escreva aqui. Exemplo: como mando uma foto pelo WhatsApp?"
            className="min-h-28 px-4 text-xl placeholder:text-muted-foreground md:text-xl"
            aria-describedby="contador-letras dica-enviar"
            disabled={inputLocked}
          />
          <PromptInputFooter className="flex-wrap justify-between gap-3 px-4 pb-3">
            <p
              id="contador-letras"
              className={
                tooLong ? "text-lg font-bold text-destructive" : "text-lg text-muted-foreground"
              }
            >
              {text.length} de {ASSISTANT_LIMITS.maxMessageChars} letras
            </p>
            <PromptInputSubmit
              status={pending ? "submitted" : "ready"}
              disabled={pending || inputLocked || !text.trim()}
              className="h-12 w-auto gap-2 rounded-xl px-5 text-lg font-bold has-[>svg]:px-5 [&_svg]:size-6"
              aria-label="Enviar pergunta"
            >
              {pending ? (
                "Aguarde…"
              ) : (
                <>
                  Enviar
                  <Send aria-hidden="true" />
                </>
              )}
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
        <p id="dica-enviar" className="mt-3 text-lg text-muted-foreground">
          {mode === "consent"
            ? "Primeiro escolha, logo acima, se quer guardar suas conversas."
            : mode === "loading"
              ? "Aguarde um instante, estamos abrindo o assistente."
              : limitReached
                ? "Esta conversa chegou ao limite. Toque em Começar nova conversa para continuar."
                : saving
                  ? "Cada pergunta e resposta fica guardada na sua conta. No computador, a tecla Enter envia e Shift + Enter pula linha."
                  : `Você ainda pode enviar ${remaining} ${remaining === 1 ? "mensagem" : "mensagens"} nesta conversa. No computador, a tecla Enter envia e Shift + Enter pula linha.`}
        </p>
      </div>
    </div>
  );
}
