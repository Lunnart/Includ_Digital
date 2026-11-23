import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

const TITLE = "Entrar com a conta Google — Passo a Passo Digital";
const DESCRIPTION =
  "Entre com sua conta Google para guardar suas conversas com o assistente e continuar outro dia.";

export const Route = createFileRoute("/entrar")({
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
  component: EntrarPage,
});

function EntrarPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/assistente`,
      extraParams: { prompt: "select_account" },
    });
    if (result.redirected) return;
    setBusy(false);
    if (result.error) {
      setError("Não foi possível entrar agora. Confira sua internet e tente de novo.");
      return;
    }
    await navigate({ to: "/assistente" });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-4xl font-bold sm:text-5xl">Entrar com a conta Google</h1>

      {ready && user ? (
        <div className="mt-6 space-y-5 text-xl">
          <p>
            Você já entrou com a conta <strong>{user.email}</strong>.
          </p>
          <Button asChild size="xl">
            <Link to="/assistente">Ir para o assistente</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-xl">
            Entrar serve só para <strong>guardar suas conversas</strong> com o assistente e
            continuar outro dia. Você não precisa entrar para usar o site.
          </p>

          <ol className="mt-6 list-decimal space-y-2 pl-7 text-xl">
            <li>Toque no botão abaixo.</li>
            <li>Vai abrir uma tela do Google. Escolha sua conta.</li>
            <li>Depois, você volta sozinho para o assistente.</li>
          </ol>

          <div className="mt-8">
            <GoogleSignInButton onClick={signIn} disabled={busy || !ready}>
              {busy ? "Abrindo o Google…" : "Continuar com o Google"}
            </GoogleSignInButton>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex gap-3 rounded-2xl border-2 border-destructive bg-card p-5 text-xl"
            >
              <AlertCircle aria-hidden="true" className="size-8 shrink-0 text-destructive" />
              <p>{error}</p>
            </div>
          )}

          <aside
            aria-label="Sua segurança"
            className="mt-8 flex gap-4 rounded-2xl border-2 border-safety-border bg-safety p-5 text-safety-foreground"
          >
            <ShieldCheck aria-hidden="true" className="size-9 shrink-0" />
            <div className="space-y-2 text-lg">
              <p>
                Este site <strong>nunca</strong> pede a senha do Google. Se o Google pedir a senha,
                ela é digitada só na tela do próprio Google.
              </p>
              <p>
                O Google envia para o site seu e-mail, seu nome e sua foto. O site usa só o e-mail,
                para saber que a conversa é sua.
              </p>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
