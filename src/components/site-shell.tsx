import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

import { TextSizeControl } from "@/components/text-size-control";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link
          to="/"
          className="flex min-h-12 items-center gap-3 rounded-xl text-foreground no-underline"
        >
          <span
            aria-hidden="true"
            className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            <HeartHandshake className="size-7" />
          </span>
          <span className="font-display text-xl font-bold leading-tight">
            Passo a Passo Digital
          </span>
        </Link>
        <TextSizeControl />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-border bg-card">
      <div className="mx-auto max-w-5xl space-y-2 px-5 py-8 text-lg text-muted-foreground">
        <p>Feito com cuidado para quem está começando no mundo digital.</p>
        <p>Este site não pede seus dados pessoais, senhas ou dados do banco.</p>
      </div>
    </footer>
  );
}
