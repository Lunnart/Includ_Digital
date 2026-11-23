import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

type AuthState = { user: User | null; ready: boolean };

const AuthContext = createContext<AuthState>({ user: null, ready: false });

/** The only session listener in the app; mounted once in the root route. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ user: null, ready: false });

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setState({ user: data.user ?? null, ready: true });
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setState((current) =>
        current.ready && current.user?.id === session?.user?.id && event === "SIGNED_IN"
          ? current
          : { user: session?.user ?? null, ready: true },
      );
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [router, queryClient]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Signs out and drops every cached private answer before leaving the page. */
export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useCallback(
    async (to: "/" | "/assistente" = "/") => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut({ scope: "local" });
      await navigate({ to, replace: true });
    },
    [queryClient, navigate],
  );
}
