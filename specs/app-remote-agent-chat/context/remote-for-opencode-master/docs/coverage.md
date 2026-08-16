# OpenCode feature coverage

Audited 2026-08-03 against OpenCode 1.18.10's OpenAPI surface (162 paths)
by cross-referencing every endpoint against what `OpenCodeAdapter` actually
calls. Not from memory.

**Short answer: the core conversational loop is covered; the project- and
workspace-level surface largely isn't.** Everything needed to start, steer,
approve, and review an agent turn from a phone works. What's missing is
mostly *around* the conversation — modes, todos, session management, and
looking at the repo itself.

## Covered (20 operations)

| Area | Endpoints |
|---|---|
| Health & config | `/global/health`, `/config`, `/config/providers` |
| Streaming | `/event` (SSE), incl. `message.part.delta` token stream |
| Projects | `/project` (+ Mac-side git discovery) |
| Sessions | `/experimental/session`, `POST /session` |
| Prompting | `prompt_async`, `abort`, `message` (transcript + per-turn diffs) |
| Commands | `/command`, `POST /session/{id}/command` |
| Session ops | `summarize`, `share` (POST/DELETE), `revert`, `unrevert` |
| Approvals | `/permission`, `/permission/{id}/reply` |
| Questions | `/question`, `/question/{id}/reply` |

## Closed since this audit (2026-08-03)

Items 1–4 below are now implemented: agents/Plan mode, todos, session
delete+rename, and working-tree review. They are kept here with their
reasoning intact, since the reasoning is why they were chosen.

## Gaps as first audited, ranked by what they'd be worth on a phone

### 1. Agents — and Plan mode especially
`GET /agent` returns primary agents (`build`, `plan`) and subagents
(`explore`, `general`). **`plan` is described as "Plan mode. Disallows all
edit tools."** That is arguably the single most valuable mode for a remote
user: exploring and planning from a phone is safe in a way that editing
isn't. Both `prompt_async` and `POST /command` already accept an `agent`
parameter — the plumbing exists, we just never send it.
*Cost: small. Value: high.*

### 2. Todos
`GET /session/{id}/todo` plus the `todo.updated` event we already receive
and ignore. Agents plan their work as a checklist; watching it tick over is
exactly what someone checking in from away wants to see. Claude Code
surfaces this prominently.
*Cost: small. Value: high.*

### 3. Session management
`DELETE /session/{id}` and `PATCH /session/{id}` (rename). There is
currently no way to delete or retitle a session from the phone — the
launcher accumulates forever.
*Cost: small. Value: medium-high.*

### 4. Working-tree review
`/vcs/status`, `/vcs/diff`, `/file/status`. We show per-turn diffs from
message summaries, but there's no way to see the *accumulated* state of the
repo — what's changed overall, what's staged. "Review everything before I
approve the PR" isn't possible today.
*Cost: medium. Value: medium-high.*

### 5. File access
`/find/file`, `/find/symbol`, `/file/content`. "Open that file", "search
the project" — read-only, and it makes the phone useful for understanding
as well as steering.
*Cost: medium. Value: medium.*

### 6. Cross-session status
`GET /session/status`. The launcher could show which sessions are running
right now rather than listing them all as inert history.
*Cost: small. Value: medium.*

### 7. Smaller ones
- `POST /session/{id}/fork` + `/children` — branch a conversation.
- `GET /mcp`, `GET /lsp` — server/diagnostic status.
- `POST /global/upgrade` — the companion already manages the OpenCode
  process; offering "update OpenCode" in the menu bar is a natural fit.
- `DELETE /session/{id}/message/{id}` — surgical undo.
- `GET /skill` — we already get skills through `/command`.

## Deliberately out of scope

- **`/pty` terminal.** A full terminal on a phone is a different product,
  and it reopens the exposure surface this one exists to avoid.
- **Worktrees, workspaces, sandboxes** (`/experimental/worktree`,
  `/experimental/workspace`) — desktop workflows.
- **Console, enterprise, control-plane** (`/experimental/console/*`) — not
  applicable to a personal client.
- **TUI control** (`/tui/*`) — drives OpenCode's own terminal UI.
- **Provider OAuth** (`/provider/*/oauth/*`, `/auth/{providerID}`) —
  credential setup belongs on the machine holding the credentials.

## Coverage by weight, not by count

Counting endpoints understates it: `/tui/*` alone is 14 paths we will never
want, and `/experimental/console/*` another handful. Of the endpoints a
personal mobile client would plausibly use, we're at roughly **two thirds**,
with the missing third concentrated in items 1–4 above.
