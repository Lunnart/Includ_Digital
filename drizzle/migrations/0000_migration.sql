-- Etapa 4: saved assistant conversation, only with explicit consent, isolated per person.

CREATE TABLE public.history_consents (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  terms_version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.history_consents TO authenticated;
GRANT ALL ON public.history_consents TO service_role;

ALTER TABLE public.history_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own consent: read" ON public.history_consents
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own consent: give" ON public.history_consents
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own consent: withdraw" ON public.history_consents
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seq bigint GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 8000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX assistant_messages_user_seq_idx ON public.assistant_messages (user_id, seq);

GRANT SELECT, INSERT, DELETE ON public.assistant_messages TO authenticated;
GRANT ALL ON public.assistant_messages TO service_role;

ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own messages: read" ON public.assistant_messages
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own messages: save with consent" ON public.assistant_messages
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.history_consents c WHERE c.user_id = auth.uid())
  );
CREATE POLICY "Own messages: delete" ON public.assistant_messages
  FOR DELETE TO authenticated USING (user_id = auth.uid());