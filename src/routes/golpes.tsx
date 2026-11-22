import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, LifeBuoy, ShieldCheck, XCircle } from "lucide-react";

import { GOLDEN_RULES, IF_SCAMMED, SCAMS, WARNING_SIGNS } from "@/lib/scams";

const TITLE = "Como se proteger de golpes — Passo a Passo Digital";
const DESCRIPTION =
  "Guia prático para reconhecer golpes por telefone, WhatsApp e internet, e o que fazer se cair em um.";

export const Route = createFileRoute("/golpes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GolpesPage,
});

const SECTIONS = [
  { id: "regras", label: "Regras de ouro" },
  { id: "golpes-comuns", label: "Golpes mais comuns" },
  { id: "sinais", label: "Sinais de alerta" },
  { id: "se-cair", label: "Se você caiu em um golpe" },
];

function GolpesPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Como se proteger de golpes</h1>
      <p className="mt-4 text-xl sm:text-2xl">
        Golpistas enganam pessoas de todas as idades. Conhecer os truques mais usados é a melhor
        proteção.
      </p>

      <nav
        aria-labelledby="nesta-pagina"
        className="mt-8 rounded-2xl border-2 border-border bg-card p-6"
      >
        <h2 id="nesta-pagina" className="text-2xl font-bold">
          Nesta página
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex min-h-14 items-center rounded-xl border-2 border-primary px-5 text-xl font-bold text-primary hover:bg-accent"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section
        id="regras"
        aria-labelledby="titulo-regras"
        className="mt-12 scroll-mt-6 rounded-2xl border-2 border-safety-border bg-safety p-6 text-safety-foreground sm:p-8"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="size-10 shrink-0" />
          <h2 id="titulo-regras" className="text-3xl font-bold">
            Regras de ouro
          </h2>
        </div>
        <ul className="mt-5 space-y-4">
          {GOLDEN_RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-xl">
              <CheckCircle2 aria-hidden="true" className="mt-1 size-7 shrink-0" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="golpes-comuns" aria-labelledby="titulo-golpes" className="mt-14 scroll-mt-6">
        <h2 id="titulo-golpes" className="text-3xl font-bold sm:text-4xl">
          Golpes mais comuns
        </h2>
        <div className="mt-6 space-y-6">
          {SCAMS.map((scam) => (
            <article
              key={scam.id}
              aria-labelledby={`golpe-${scam.id}`}
              className="rounded-2xl border-2 border-border bg-card p-6 sm:p-8"
            >
              <h3 id={`golpe-${scam.id}`} className="text-2xl font-bold sm:text-3xl">
                {scam.title}
              </h3>
              <p className="mt-4 text-lg font-bold uppercase tracking-wide text-muted-foreground">
                Como funciona
              </p>
              <p className="mt-1 text-xl">{scam.howItWorks}</p>
              <p className="mt-5 text-lg font-bold uppercase tracking-wide text-primary">
                O que fazer
              </p>
              <ol className="mt-2 list-decimal space-y-2 pl-7 text-xl marker:font-bold">
                {scam.whatToDo.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section id="sinais" aria-labelledby="titulo-sinais" className="mt-14 scroll-mt-6">
        <div className="flex items-center gap-3">
          <AlertTriangle aria-hidden="true" className="size-10 shrink-0 text-destructive" />
          <h2 id="titulo-sinais" className="text-3xl font-bold sm:text-4xl">
            Sinais de alerta
          </h2>
        </div>
        <p className="mt-3 text-xl">Se aparecer um destes sinais, pare e desconfie:</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {WARNING_SIGNS.map((sign) => (
            <li
              key={sign}
              className="flex gap-3 rounded-2xl border-2 border-border bg-card p-5 text-xl"
            >
              <XCircle aria-hidden="true" className="mt-1 size-7 shrink-0 text-destructive" />
              <span>{sign}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="se-cair" aria-labelledby="titulo-se-cair" className="mt-14 scroll-mt-6">
        <div className="flex items-center gap-3">
          <LifeBuoy aria-hidden="true" className="size-10 shrink-0 text-primary" />
          <h2 id="titulo-se-cair" className="text-3xl font-bold sm:text-4xl">
            Se você caiu em um golpe
          </h2>
        </div>
        <p className="mt-3 text-xl">
          Não sinta vergonha: isso acontece com muita gente. Agir rápido faz diferença.
        </p>
        <ol className="mt-6 space-y-5">
          {IF_SCAMMED.map((item, index) => (
            <li
              key={item.title}
              className="flex gap-5 rounded-2xl border-2 border-border bg-card p-5 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="sr-only">Passo {index + 1}: </span>
                  {item.title}
                </h3>
                <p className="mt-2 text-xl">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 rounded-2xl bg-muted p-6 text-xl">
          Em caso de ameaça ou perigo, ligue para a Polícia Militar no <strong>190</strong>.
        </p>
      </section>
    </div>
  );
}
