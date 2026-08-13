---
title: "Session Lifecycle Hooks: Continuity + Context Priming"
description: "Spec-Kit session-lifecycle adapters that prime, restore, and checkpoint continuity context at session start/stop and around compaction, across Claude, Codex, Cursor, Devin, and Pi."
trigger_phrases:
  - "session lifecycle hooks"
  - "session start context"
  - "compact inject"
  - "session continuity priming"
importance_tier: "important"
contextType: "reference"
---

# Session Lifecycle Hooks: Continuity + Context Priming

---

## 1. OVERVIEW

Index of the Spec-Kit session-lifecycle adapters, whose real code lives in `system-spec-kit/mcp-server/hooks/` and is symlinked here per runtime. These hooks fire on a runtime's session boundaries — start, stop/end, and the compaction boundary — to prime continuity context into a fresh session, checkpoint state on stop, and re-inject the recovered brief after a compaction so long sessions do not lose their spec-folder anchor.

They are advisory and model-context-only: they add recovery text, never block a session. Every adapter honors the `session-lifecycle` kill-switch (`isHookEnabled`; `MK_SESSION_LIFECYCLE_DISABLED` or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapters |
|---|---|
| `claude/` | `session-prime.ts`, `session-stop.ts`, `compact-inject.ts` |
| `codex/` | `session-start.ts`, `session-stop.ts`, `compact-inject.ts` |
| `cursor/` | `session-start.ts`, `session-end.ts`, `precompact.ts` |
| `devin/` | `session-start.ts`, `session-stop.ts`, `post-compaction.cjs` |
| `pi/` | `session-start-advisories.ts`, `session-stop-context.ts`, `session-compact-context.ts` |

Runtimes differ in their lifecycle-event vocabulary (Claude's `SessionStart`/`Stop`/`PreCompact` vs Pi's `session_start`/`session_shutdown`/`session_compact`), so each runtime carries its own adapter over the same shared continuity core.

## 3. BOUNDARIES

- **Advisory only.** These hooks inject recovery/continuity context; they never deny or halt a session.
- **Fail-open.** Any error resolves to a no-op, so a hook bug never breaks session startup.
- **Real code stays in the skill.** The files here are symlinks into `system-spec-kit`; edit the source there.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and kill-switch model.
- [`../../skills/system-spec-kit/mcp-server/hooks/README.md`](../../skills/system-spec-kit/mcp-server/hooks/README.md) — the owning skill's hook contract.
