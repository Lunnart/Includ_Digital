import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

import { TextSizeControl } from "@/components/text-size-control";

const NAV_ITEMS = [
  { to: "/", label: "Início" },
  { to: "/duvidas", label: "Dúvidas" },
  { to: "/golpes", label: "Golpes" },
] as const;

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
      <nav aria-label="Menu principal" className="border-t-2 border-border">
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-1 px-3 py-3 sm:gap-2 sm:px-5">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="inline-flex min-h-12 items-center rounded-xl px-3 text-lg sm:px-4 font-bold text-foreground no-underline hover:bg-accent aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
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
