---
title: "Codex Hooks: Lifecycle Adapters"
description: "Codex CLI hook adapters that normalize Codex lifecycle payloads and delegate to the existing Claude hook implementations."
---

# Codex Hooks: Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/codex/` adapts Codex CLI's `SessionStart`, `UserPromptSubmit`, `Stop` and `PreCompact` lifecycle events onto the existing Claude hook implementations in `../claude/`. Each adapter reads and validates its own Codex payload, spawns the matching compiled Claude adapter with a normalized input and translates the result back into Codex's hook response envelope. No lifecycle logic is duplicated: state and transcript semantics stay owned by the Claude adapters so the two command transports cannot drift apart.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Codex hook payload, spawns the matching `../claude/*.js` adapter and emits Codex's `hookSpecificOutput` response envelope. |
| `session-start.ts` | `SessionStart` adapter. Delegates to `session-prime.js` and emits the returned context. |
| `user-prompt-submit.ts` | `UserPromptSubmit` adapter. Delegates to `user-prompt-submit.js` and normalizes its JSON response into the Codex envelope. |
| `session-stop.ts` | `Stop` adapter. Delegates to `session-stop.js`. |
| `compact-inject.ts` | `PreCompact` adapter. Delegates to `compact-inject.js`. |
| `completion-evidence-stop.cjs` | Standalone Codex `Stop` sentinel. Reads the last-spec-folder state written by the lifecycle hooks, resolves the active packet and calls `../../lib/hooks/completion-evidence-sentinel.cjs` for an advisory-only completion-evidence check. Never blocks the turn. |

## 3. CONSUMERS

- `.codex/hooks.json` registers the compiled `dist/hooks/codex/*.js` outputs of `session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts` and `compact-inject.ts` against the matching Codex lifecycle events.
- `completion-evidence-stop.cjs` is a plain, directly runnable `.cjs` file with no build step and is registered the same way for the Codex `Stop` event.

## 4. TESTS

- `tests/hook-completion-evidence-stop.vitest.ts` covers the sentinel path shared with `completion-evidence-stop.cjs`.

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../lib/hooks/completion-evidence-sentinel.cjs`](../../lib/hooks/completion-evidence-sentinel.cjs)
