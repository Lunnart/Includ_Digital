import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Globe, Smartphone, type LucideIcon } from "lucide-react";

import { CATEGORIES, guidesByCategory, type GuideCategory } from "@/lib/guides";

const TITLE = "Dúvidas sobre celular e internet — Passo a Passo Digital";
const DESCRIPTION =
  "Atalhos com explicações passo a passo para as dúvidas mais comuns sobre celular e internet.";

export const Route = createFileRoute("/duvidas/")({
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
  component: DuvidasPage,
});

const ICONS: Record<GuideCategory, LucideIcon> = { celular: Smartphone, internet: Globe };

function DuvidasPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-bold sm:text-5xl">Dúvidas comuns</h1>
      <p className="mt-4 max-w-3xl text-xl">
        Escolha um assunto. Cada explicação tem poucos passos, e você pode voltar quando quiser.
      </p>

      <nav aria-label="Escolha o assunto" className="mt-8 flex flex-wrap gap-4">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="inline-flex min-h-14 items-center rounded-xl border-2 border-primary px-6 text-xl font-bold text-primary hover:bg-accent"
          >
            Ir para {category.title}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((category) => {
        const Icon = ICONS[category.id];
        return (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`titulo-${category.id}`}
            className="mt-14 scroll-mt-6"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
              >
                <Icon className="size-8" />
              </span>
              <h2 id={`titulo-${category.id}`} className="text-3xl font-bold sm:text-4xl">
                {category.title}
              </h2>
            </div>
            <p className="mt-3 text-xl text-muted-foreground">{category.description}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {guidesByCategory(category.id).map((guide) => (
                <li key={guide.slug}>
                  <Link
                    to="/duvidas/$slug"
                    params={{ slug: guide.slug }}
                    className="group flex h-full items-center justify-between gap-4 rounded-2xl border-2 border-border bg-card p-6 text-foreground no-underline transition-colors hover:border-primary hover:bg-accent"
                  >
                    <span>
                      <span className="block font-display text-2xl font-bold">{guide.title}</span>
                      <span className="mt-2 block text-lg">{guide.summary}</span>
                    </span>
                    <ChevronRight aria-hidden="true" className="size-8 shrink-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
