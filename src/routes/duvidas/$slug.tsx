import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Lightbulb, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORIES, getGuide } from "@/lib/guides";

export const Route = createFileRoute("/duvidas/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    const title = guide
      ? `${guide.title} — Passo a Passo Digital`
      : "Explicação não encontrada — Passo a Passo Digital";
    const description = guide ? `${guide.summary} ${guide.intro}` : "Esta explicação não existe.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(guide ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: GuideNotFound,
});

function BackLink() {
  return (
    <Button asChild variant="outline" size="xl">
      <Link to="/duvidas">
        <ArrowLeft aria-hidden="true" />
        Voltar para as dúvidas
      </Link>
    </Button>
  );
}

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const category = CATEGORIES.find((c) => c.id === guide.category);

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <BackLink />
      <p className="mt-8 text-lg font-bold uppercase tracking-wide text-primary">
        {category?.title}
      </p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{guide.title}</h1>
      <p className="mt-5 text-xl sm:text-2xl">{guide.intro}</p>

      <section aria-labelledby="passos" className="mt-10">
        <h2 id="passos" className="text-3xl font-bold">
          Passo a passo
        </h2>
        <ol className="mt-6 space-y-5">
          {guide.steps.map((step, index) => (
            <li
              key={step.text}
              className="flex gap-5 rounded-2xl border-2 border-border bg-card p-5 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground"
              >
                {index + 1}
              </span>
              <div>
                <p className="text-xl font-bold">
                  <span className="sr-only">Passo {index + 1}: </span>
                  {step.text}
                </p>
                {step.detail && <p className="mt-2 text-lg">{step.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {guide.warning && (
        <aside
          aria-label="Atenção"
          className="mt-8 flex gap-4 rounded-2xl border-2 border-safety-border bg-safety p-6 text-safety-foreground"
        >
          <ShieldAlert aria-hidden="true" className="size-10 shrink-0" />
          <p className="text-xl">
            <strong>Atenção: </strong>
            {guide.warning}
          </p>
        </aside>
      )}

      {guide.tip && (
        <aside aria-label="Dica" className="mt-8 flex gap-4 rounded-2xl bg-accent p-6 text-accent-foreground">
          <Lightbulb aria-hidden="true" className="size-10 shrink-0" />
          <p className="text-xl">
            <strong>Dica: </strong>
            {guide.tip}
          </p>
        </aside>
      )}

      {guide.terms && guide.terms.length > 0 && (
        <section aria-labelledby="palavras" className="mt-10">
          <div className="flex items-center gap-3">
            <BookOpen aria-hidden="true" className="size-9 text-primary" />
            <h2 id="palavras" className="text-3xl font-bold">
              O que quer dizer
            </h2>
          </div>
          <dl className="mt-5 space-y-4">
            {guide.terms.map((item) => (
              <div key={item.term} className="rounded-2xl border-2 border-border bg-card p-5">
                <dt className="font-display text-2xl font-bold">{item.term}</dt>
                <dd className="mt-1 text-lg">{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-12 rounded-2xl border-2 border-border bg-muted p-6">
        <p className="text-xl">
          Não deu certo? Tudo bem. Tente de novo com calma ou peça ajuda a alguém de confiança.
        </p>
        <div className="mt-5">
          <BackLink />
        </div>
      </div>
    </article>
  );
}

function GuideNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold">Não encontramos esta explicação</h1>
      <p className="mt-4 text-xl">Ela pode ter mudado de lugar. Veja a lista completa de dúvidas.</p>
      <div className="mt-8">
        <BackLink />
      </div>
    </div>
  );
}
