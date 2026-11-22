<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- The site shell (skip link, header, single `<main>`, footer) lives in `src/routes/__root.tsx` via `src/components/site-shell.tsx`; pages render only their own content. Why: one consistent, accessible layout and exactly one `<main>` per page.
- Text size is scaled by changing the root `html` font-size from `src/lib/text-size.ts`, so all sizing must use rem-based Tailwind classes, never px. Why: the A+/A− control must enlarge every element.
- Large tap targets use the `xl` and `touch` Button sizes instead of ad-hoc sizing. Why: consistent minimum touch areas for older users.
- AI calls live only in `src/lib/assistant.server.ts` (Lovable AI Gateway SDK), exposed through the `askAssistant` server function in `src/lib/assistant.functions.ts`. Why: keys and prompts never reach the browser.
- Assistant limits and sensitive-data checks live in `src/lib/assistant-rules.ts`, shared by browser and server; the server always re-checks. Why: one source of truth, and the browser check is only for faster feedback.
- The assistant chat is single-session with no storage. Why: privacy (LGPD) until the owner decides history is needed.
- The per-person request limit (`src/lib/rate-limit.ts`) is in memory per server instance, so it is a best-effort brake. Why: avoids storing personal data; switch to a database-backed limit if abuse appears.
- The chat UI uses AI Elements (`src/components/ai-elements/`) with the streamdown extra plugins removed. Why: platform chat primitives, without heavy unused dependencies.
