import { Link } from "@tanstack/react-router";
import { HeartHandshake, LogIn, LogOut } from "lucide-react";

import { TextSizeControl } from "@/components/text-size-control";
import { Button } from "@/components/ui/button";
import { useAuth, useSignOut } from "@/lib/auth";

const NAV_ITEMS = [
  { to: "/", label: "Início" },
  { to: "/duvidas", label: "Dúvidas" },
  { to: "/golpes", label: "Golpes" },
  { to: "/jogo", label: "Jogo" },
  { to: "/assistente", label: "Assistente" },
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
        <div className="flex flex-wrap items-center gap-3">
          <TextSizeControl />
          <AccountControl />
        </div>
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

function AccountControl() {
  const { user, ready } = useAuth();
  const signOut = useSignOut();
  if (!ready) return null;
  if (user) {
    return (
      <Button type="button" variant="outline" size="touch" onClick={() => void signOut()}>
        <LogOut aria-hidden="true" />
        Sair da conta
      </Button>
    );
  }
  return (
    <Button asChild variant="outline" size="touch">
      <Link to="/entrar">
        <LogIn aria-hidden="true" />
        Entrar
      </Link>
    </Button>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-border bg-card">
      <div className="mx-auto max-w-5xl space-y-2 px-5 py-8 text-lg text-muted-foreground">
        <p>Feito com cuidado para quem está começando no mundo digital.</p>
        <p>Este site nunca pede senhas, códigos ou dados do banco.</p>
      </div>
    </footer>
  );
}
