import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CHANNEL_LABEL,
  ROUNDS,
  finalMessage,
  isCorrect,
  type Channel,
  type Verdict,
} from "@/lib/game";

const TITLE = "Jogo: golpe ou seguro? — Passo a Passo Digital";
const DESCRIPTION =
  "Um jogo calmo, sem tempo e sem pressa, para treinar a reconhecer mensagens e ligações de golpe.";

export const Route = createFileRoute("/jogo")({
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
  component: JogoPage,
});

const CHANNEL_ICON: Record<Channel, LucideIcon> = {
  whatsapp: MessageCircle,
  ligacao: Phone,
  sms: MessageCircle,
  celular: Smartphone,
};

function JogoPage() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<Verdict | null>(null);
  const [correct, setCorrect] = useState(0);
  const [started, setStarted] = useState(false);
  const focusRef = useRef<HTMLHeadingElement>(null);

  const total = ROUNDS.length;
  const finished = index >= total;
  const round = ROUNDS[index];

  // Move keyboard and screen-reader focus to the new content after each step.
  useEffect(() => {
    if (started) focusRef.current?.focus();
  }, [index, choice, started]);

  function answer(verdict: Verdict) {
    if (!round || choice) return;
    setChoice(verdict);
    setStarted(true);
    if (isCorrect(round, verdict)) setCorrect((c) => c + 1);
  }

  function next() {
    setChoice(null);
    setIndex((i) => i + 1);
    setStarted(true);
  }

  function restart() {
    setIndex(0);
    setChoice(null);
    setCorrect(0);
    setStarted(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Jogo: golpe ou seguro?</h1>
      <p className="mt-4 text-xl sm:text-2xl">
        Leia cada mensagem com calma e escolha se é golpe ou se é seguro. Não tem tempo, não tem
        pressa e não tem como perder: cada resposta traz uma explicação.
      </p>

      {finished ? (
        <section
          aria-labelledby="fim-jogo"
          className="mt-10 rounded-2xl border-2 border-primary bg-card p-6 sm:p-8"
        >
          <h2
            id="fim-jogo"
            ref={focusRef}
            tabIndex={-1}
            className="text-3xl font-bold focus:outline-none"
          >
            Você reconheceu {correct} de {total} mensagens
          </h2>
          <p className="mt-4 text-xl">{finalMessage(correct, total)}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button size="xl" onClick={restart}>
              <RotateCcw aria-hidden="true" />
              Jogar de novo
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/golpes">
                <ShieldAlert aria-hidden="true" />
                Ler o guia contra golpes
              </Link>
            </Button>
          </div>
        </section>
      ) : round ? (
        <section aria-labelledby="rodada" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="rodada"
              ref={choice ? undefined : focusRef}
              tabIndex={-1}
              className="text-2xl font-bold focus:outline-none"
            >
              Mensagem {index + 1} de {total}
            </h2>
            <p className="text-lg text-muted-foreground">
              Acertos até agora: <strong className="text-foreground">{correct}</strong>
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Andamento do jogo"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index}
            className="mt-3 h-3 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(index / total) * 100}%` }}
            />
          </div>

          <MessageCard roundIndex={index} />

          {choice === null ? (
            <div className="mt-8">
              <p className="text-xl font-bold">O que você acha?</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Button size="xl" variant="destructive" onClick={() => answer("golpe")}>
                  <ShieldAlert aria-hidden="true" />É golpe
                </Button>
                <Button size="xl" onClick={() => answer("seguro")}>
                  <ShieldCheck aria-hidden="true" />É seguro
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`mt-8 rounded-2xl border-2 p-6 ${
                isCorrect(round, choice)
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-safety-border bg-safety text-safety-foreground"
              }`}
            >
              <h3
                ref={focusRef}
                tabIndex={-1}
                className="flex items-center gap-3 text-2xl font-bold focus:outline-none"
              >
                {isCorrect(round, choice) ? (
                  <CheckCircle2 aria-hidden="true" className="size-8 shrink-0" />
                ) : (
                  <Info aria-hidden="true" className="size-8 shrink-0" />
                )}
                {isCorrect(round, choice) ? "Isso mesmo!" : "Essa era difícil. Veja o porquê."}
              </h3>
              <p className="mt-3 text-xl">{round.explanation}</p>
              <Button size="xl" className="mt-6" onClick={next}>
                {index + 1 < total ? "Próxima mensagem" : "Ver resultado"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function MessageCard({ roundIndex }: { roundIndex: number }) {
  const round = ROUNDS[roundIndex];
  if (!round) return null;
  const Icon = CHANNEL_ICON[round.channel];
  return (
    <article className="mt-6 rounded-2xl border-2 border-border bg-card p-6">
      <p className="flex items-center gap-3 text-lg font-bold text-primary">
        <Icon aria-hidden="true" className="size-7 shrink-0" />
        {CHANNEL_LABEL[round.channel]}
      </p>
      <p className="mt-2 text-lg text-muted-foreground">De: {round.from}</p>
      {round.context && <p className="mt-3 text-lg italic">{round.context}</p>}
      <blockquote className="mt-4 rounded-xl rounded-tl-none bg-secondary p-5 text-xl text-secondary-foreground">
        “{round.message}”
      </blockquote>
    </article>
  );
}
