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

## 5. SPEC-GATE (GATE-3) HOOKS

This folder also holds the Codex CLI side of the Gate-3 spec-folder discipline, mirroring the Claude pair in `../claude/` for the Codex tool vocabulary. Both files call into `../lib/spec-gate/spec-gate-core.mjs` so the core never changes for a new runtime. Every entrypoint fails open. Direct-run `.mjs`, no build step.

| File | Purpose |
|------|---------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn and surfaces the bounded Gate-3 question as `additionalContext`. Advisory only. |
| `spec-gate-enforce.mjs` | `PreToolUse` hook. Maps Codex's `exec`/`apply_patch`/`edit` tool names onto the core's `bash`/`write`/`edit` vocabulary, parses `*** Add/Update/Delete File:` and `*** Move to:` headers out of `apply_patch` patch bodies to find the real target path, then runs `evaluateMutation()`. |
| `spec-gate-codex.test.mjs` | Co-located tests, run with `node --test`. |

`.codex/hooks.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to the `exec|apply_patch|edit` `PreToolUse` matcher.

## 6. RELATED

- [`../README.md`](../README.md)
- [`../../lib/hooks/completion-evidence-sentinel.cjs`](../../lib/hooks/completion-evidence-sentinel.cjs)
- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md)
