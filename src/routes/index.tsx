import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  Globe,
  Gamepad2,
  Keyboard,
  LayoutGrid,
  MessageCircleQuestion,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Type,
  Hand,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Passo a Passo Digital — Ajuda com celular e internet" },
      {
        name: "description",
        content:
          "Explicações simples e passo a passo sobre celular, internet, aplicativos e como se proteger de golpes.",
      },
      { property: "og:title", content: "Passo a Passo Digital — Ajuda com celular e internet" },
      {
        property: "og:description",
        content:
          "Explicações simples e passo a passo sobre celular, internet, aplicativos e como se proteger de golpes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Topic = { icon: LucideIcon; title: string; text: string };
type TopicLink = { to: "/duvidas"; hash: string } | { to: "/golpes" } | { to: "/jogo" } | { to: "/assistente" };
type HomeTopic = Topic & { link?: TopicLink };

const TOPICS: HomeTopic[] = [
  {
    icon: Smartphone,
    title: "Celular",
    text: "Fazer e atender ligações, salvar contatos, aumentar as letras, tirar fotos e mais.",
    link: { to: "/duvidas", hash: "celular" },
  },
  {
    icon: Globe,
    title: "Internet",
    text: "Conectar no Wi-Fi (a internet sem fio de casa) e fazer pesquisas.",
    link: { to: "/duvidas", hash: "internet" },
  },
  {
    icon: LayoutGrid,
    title: "Aplicativos",
    text: "Usar o WhatsApp, fazer chamadas de vídeo e instalar aplicativos com segurança.",
  },
  {
    icon: ShieldAlert,
    title: "Segurança e golpes",
    text: "Reconhecer mensagens falsas e saber o que fazer quando algo parece estranho.",
    link: { to: "/golpes" },
  },
  {
    icon: Gamepad2,
    title: "Jogo: golpe ou seguro?",
    text: "Treine com calma, sem tempo e sem pressa, a reconhecer mensagens de golpe.",
    link: { to: "/jogo" },
  },
  {
    icon: MessageCircleQuestion,
    title: "Conversar com o assistente",
    text: "Escrever sua dúvida com suas palavras e receber uma resposta passo a passo.",
    link: { to: "/assistente" },
  },
];

const TIPS: Topic[] = [
  {
    icon: Type,
    title: "Letras maiores",
    text: "Use os botões A+ e A− no alto da página para aumentar ou diminuir as letras.",
  },
  {
    icon: Hand,
    title: "No celular",
    text: "Toque nos botões com calma. Eles são grandes de propósito, para facilitar.",
  },
  {
    icon: Keyboard,
    title: "No computador",
    text: "A tecla Tab passa de um item para o outro. A tecla Enter escolhe o item marcado.",
  },
];

function Index() {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <section aria-labelledby="boas-vindas" className="py-12 sm:py-16">
        <p className="text-lg font-bold uppercase tracking-wide text-primary">
          Bem-vindo e bem-vinda
        </p>
        <h1 id="boas-vindas" className="mt-3 text-4xl font-bold sm:text-5xl">
          Olá! Que bom ter você aqui.
        </h1>
        <p className="mt-6 max-w-3xl text-xl sm:text-2xl">
          Este é um lugar tranquilo para tirar dúvidas sobre celular, internet e aplicativos. As
          explicações são simples, em passos curtos, e você vai no seu tempo.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button asChild size="xl">
            <Link to="/duvidas" hash="celular">
              <Smartphone aria-hidden="true" />
              Dúvidas sobre o celular
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link to="/golpes">
              <ShieldAlert aria-hidden="true" />
              Proteger-se de golpes
            </Link>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="aviso-seguranca"
        className="rounded-2xl border-2 border-safety-border bg-safety p-6 text-safety-foreground sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ShieldCheck aria-hidden="true" className="size-12 shrink-0" />
          <div>
            <h2 id="aviso-seguranca" className="text-2xl font-bold sm:text-3xl">
              Um combinado importante
            </h2>
            <p className="mt-3 text-xl">
              Nós <strong>nunca</strong> vamos pedir sua senha, códigos que chegam por mensagem ou
              dados do banco. Se alguém pedir isso dizendo que é deste site, é golpe.
            </p>
          </div>
        </div>
      </section>

      <section id="o-que-tem-aqui" aria-labelledby="titulo-topicos" className="scroll-mt-6 py-14">
        <h2 id="titulo-topicos" className="text-3xl font-bold sm:text-4xl">
          O que você vai encontrar aqui
        </h2>
        <p className="mt-3 text-xl text-muted-foreground">
          Toque em um assunto para ver as explicações passo a passo.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {TOPICS.map(({ icon: Icon, title, text, link }) => {
            const content = (
              <>
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                >
                  <Icon className="size-8" />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-2xl font-bold">{title}</span>
                  <span className="mt-2 block text-lg">{text}</span>
                  {!link && (
                    <span className="mt-3 inline-block rounded-lg bg-muted px-3 py-1 text-base font-bold text-muted-foreground">
                      Em breve
                    </span>
                  )}
                </span>
                {link && (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-8 shrink-0 self-center text-primary"
                  />
                )}
              </>
            );
            const base = "flex h-full gap-4 rounded-2xl border-2 bg-card p-6 text-foreground";
            return (
              <li key={title}>
                {link ? (
                  <Link
                    {...link}
                    className={`${base} border-primary no-underline transition-colors hover:bg-accent`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className={`${base} border-border`}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="titulo-dicas" className="pb-4">
        <h2 id="titulo-dicas" className="text-3xl font-bold sm:text-4xl">
          Dicas para usar este site
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {TIPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border-2 border-border bg-card p-6">
              <Icon aria-hidden="true" className="size-10 text-primary" />
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-2 text-lg">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
