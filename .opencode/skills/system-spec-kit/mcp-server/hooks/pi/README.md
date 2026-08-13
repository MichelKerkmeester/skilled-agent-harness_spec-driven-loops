---
title: "Pi Hooks: Spec-Gate + Session-Lifecycle Bridges"
description: "Pi extension factories for Gate-3 spec-gate enforcement and session-lifecycle context, discovered through relative symlinks in .pi/extensions/."
trigger_phrases:
  - "pi spec gate"
  - "pi session lifecycle"
---

# Pi Hooks: Spec-Gate + Session-Lifecycle Bridges

---

## 1. OVERVIEW

`hooks/pi/` holds the real files behind the `.pi/extensions/` symlinks for this skill's Pi hooks. Pi discovers them through the symlinks and resolves their relative imports against the symlink path, so every import in these files is written for the `.pi/extensions/` base, not this folder.

---

## 2. WHAT EACH ONE DOES AND INJECTS

| File | Pi event | Behavior and injected text |
|---|---|---|
| `spec-gate-classify.ts` | `input` | Runs the shared core's `classifyIntent()` and, on a mutation-shaped turn, appends the bounded Gate-3 A-E documentation question to the user's own prompt text via Pi's input-transform — uniquely **operator-visible** in Pi's chat, unlike every other runtime's invisible context channel. |
| `spec-gate-enforce.ts` | `tool_call` (bash/write/edit) | Runs `evaluateMutation()`; a denied write/edit blocks the tool call with the core's reason, bash is advise-only. Fails open. |
| `session-start-context.ts` | `session_start` | Bridges `session-prime.js`'s startup context (memory brief, resume state) into the session via `pi.sendMessage()`. |
| `session-start-advisories.ts` | `session_start` | Runs the 4 warn-only CLI checks (worktree guard, git-hooks check, dist staleness, codex-hooks drift) and surfaces failures via `ctx.ui.notify()` (a no-op in print mode). |
| `session-stop-context.ts` | `session_shutdown` (`quit`) | Fire-and-forget bridge to `session-stop.js`'s autosave/state cleanup. Injects nothing. |
| `session-compact-context.ts` | `session_compact` | Rehydrates spec-folder continuity after a compaction (summary retention, shared state file, bounded CLI fallback) and injects the recovered context. |
| `lib/claude-hook-adapter.ts` | (library) | `spawnSync` proxy into this skill's compiled `dist/hooks/claude/*.js` plus the JSON-envelope parser; imported by the session bridges and the advisor's `prompt-advisor.ts`. |

Exact injected strings and per-runtime visibility: [`injection-contract.md`](../../../../../hooks/injection-contract.md).

---

## 3. RELATED

- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md): the shared Gate-3 policy core these bridges call.
- [`../../../../../../.pi/extensions/README.md`](../../../../../../.pi/extensions/README.md): the discovery mirror and symlink map.
