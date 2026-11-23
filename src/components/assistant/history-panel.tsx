import { Link } from "@tanstack/react-router";
import { BookmarkCheck, ShieldAlert } from "lucide-react";

import { ConfirmAction } from "@/components/assistant/confirm-action";
import { Button } from "@/components/ui/button";

export type HistoryMode = "loading" | "guest" | "declined" | "consent" | "saved";

const NO_SECRETS = (
  <p>
    <strong>Não escreva</strong> senhas, códigos recebidos por mensagem, número do cartão, CPF ou
    dados do banco.
  </p>
);

/** Explains, per situation, whether the conversation is saved and what the person can do. */
export function HistoryPanel({
  mode,
  busy,
  onConsent,
  onDecline,
  onReconsider,
  onStopSaving,
  onDeleteAccount,
}: {
  mode: HistoryMode;
  busy: boolean;
  onConsent: () => void;
  onDecline: () => void;
  onReconsider: () => void;
  onStopSaving: () => void;
  onDeleteAccount: () => void;
}) {
  if (mode === "consent") {
    return (
      <section
        aria-labelledby="titulo-guardar"
        className="mt-6 rounded-2xl border-2 border-primary bg-card p-6"
      >
        <h2 id="titulo-guardar" className="text-2xl font-bold">
          Quer guardar suas conversas?
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-7 text-xl">
          <li>
            Ficam guardadas suas perguntas e as respostas do assistente, ligadas à sua conta Google.
          </li>
          <li>Assim você pode continuar a conversa outro dia, até neste ou em outro aparelho.</li>
          <li>No site, só você vê a sua conversa.</li>
          <li>Ela fica guardada até você apagar. Você pode apagar tudo quando quiser.</li>
          <li>Mesmo assim, nunca escreva senhas, códigos ou dados do banco.</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" size="xl" onClick={onConsent} disabled={busy}>
            <BookmarkCheck aria-hidden="true" />
            Sim, guardar minhas conversas
          </Button>
          <Button type="button" variant="outline" size="xl" onClick={onDecline} disabled={busy}>
            Agora não
          </Button>
        </div>
      </section>
    );
  }

  return (
    <aside
      aria-label="Antes de começar"
      className="mt-6 flex gap-4 rounded-2xl border-2 border-safety-border bg-safety p-5 text-safety-foreground"
    >
      <ShieldAlert aria-hidden="true" className="size-9 shrink-0" />
      <div className="space-y-2 text-lg">
        {NO_SECRETS}
        {mode === "loading" && <p>Abrindo sua conversa guardada…</p>}
        {mode === "guest" && (
          <p>
            A conversa não fica salva: ao fechar ou recarregar a página, ela some. Quer continuar
            outro dia?{" "}
            <Link to="/entrar" className="font-bold text-safety-foreground underline">
              Entre com sua conta Google
            </Link>{" "}
            para guardar suas conversas.
          </p>
        )}
        {mode === "declined" && (
          <div className="space-y-3">
            <p>Você escolheu não guardar. A conversa some ao fechar ou recarregar a página.</p>
            <Button type="button" variant="outline" size="touch" onClick={onReconsider}>
              Quero guardar minhas conversas
            </Button>
          </div>
        )}
        {mode === "saved" && (
          <p>
            <strong>Sua conversa está sendo guardada</strong> na sua conta, até você apagar. No
            site, só você vê.
          </p>
        )}
        <p>As respostas são geradas por inteligência artificial e podem ter erros.</p>
        {mode === "saved" && (
          <details className="rounded-xl border-2 border-safety-border p-4">
            <summary className="flex min-h-12 cursor-pointer items-center text-lg font-bold">
              Opções da conversa guardada
            </summary>
            <div className="mt-3 flex flex-wrap gap-3">
              <ConfirmAction
                trigger="Parar de guardar e apagar tudo"
                title="Parar de guardar e apagar tudo?"
                description="Toda a conversa guardada será apagada para sempre, e as próximas não serão guardadas. Você continua com a conta."
                confirmLabel="Sim, apagar tudo"
                onConfirm={onStopSaving}
                disabled={busy}
              />
              <ConfirmAction
                trigger="Apagar minha conta"
                title="Apagar sua conta?"
                description="Sua conta e toda a conversa guardada serão apagadas para sempre. Você continua podendo usar o site sem conta."
                confirmLabel="Sim, apagar minha conta"
                onConfirm={onDeleteAccount}
                disabled={busy}
                variant="destructive"
              />
            </div>
          </details>
        )}
      </div>
    </aside>
  );
}
