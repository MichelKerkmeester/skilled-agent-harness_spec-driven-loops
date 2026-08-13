---
title: "Devin Hooks: Lifecycle Adapters"
description: "Devin CLI lifecycle adapters that normalize payloads, delegate to existing Claude implementations and are verified live under devin -p with the documented registration schema."
---

# Devin Hooks: Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/devin/` adapts Devin CLI's `SessionStart` and `UserPromptSubmit` lifecycle events onto the existing Claude hook implementations in `../claude/`. Each adapter reads and validates its own Devin payload, spawns the matching compiled Claude adapter with a normalized input, and translates the result back into Devin's documented `hookSpecificOutput` response envelope (the same shape Codex uses -- confirmed by phase 001's citation that Devin's event-name set closely mirrors Claude Code's own hook contract). No lifecycle logic is duplicated: state and transcript semantics stay owned by the Claude adapters.

---

## 2. STATUS: LIVE WITH EVENT-SPECIFIC CAVEATS

Live-probed 2026-07-24 against `devin 3000.2.17`. The registration must use top-level event arrays with nested `{matcher, hooks:[...]}` groups. The earlier wrapper-shaped file was silently discarded and produced a false packet-wide dormancy conclusion.

| Evidence | Result |
|---|---|
| Corrected `.devin/hooks.v1.json` | `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd` fired in one `devin -p` session. |
| Real adapter output | `session-start.js` delivered the genuine Spec Kit startup brief; Gate-3 context reached the model. |
| Captured payloads | Confirmed `hook_event_name`, IDs, `tool_name` values `exec`/`edit`/`read`, `tool_input.command`, `tool_input.file_path`, `tool_response`, `source` and `reason`. |
| Unobserved events | `PermissionRequest` and `PostCompaction` did not occur, so their live behavior remains unproven. |

**Conclusion**: project-level hooks are live under `devin -p`. A negative hook result is trustworthy only after both the probe and the registration schema are proven. True interactive mode remains untested, but it is no longer needed to establish headless support.

These adapters are built, typechecked (`tsc --noEmit`, 0 errors), compiled, directly tested and live-fire verified for events that occurred. Re-run the corrected-schema smoke test after material Devin CLI changes.

---

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Devin hook payload, spawns the matching `../claude/*.js` adapter, and emits Devin's `hookSpecificOutput` response envelope. |
| `session-start.ts` | `SessionStart` adapter. Delegates to `session-prime.js` and emits the returned context. |
| `user-prompt-submit.ts` | `UserPromptSubmit` adapter. Delegates to `user-prompt-submit.js` and normalizes its JSON response into the Devin envelope. |
| `session-stop.ts` | `Stop` adapter (phase 008). Delegates to the compiled `../claude/session-stop.js` via the same `shared.ts` pattern above -- no core change needed, `DevinHookEvent` already included `'Stop'`. |
| `completion-evidence-stop.cjs` | `Stop` adapter (phase 008), plain directly-runnable `.cjs` (no build step). Reads the Stop payload, resolves the active packet from the shared `lastSpecFolder` state file, and delegates policy to `../../lib/hooks/completion-evidence-sentinel.cjs`. Advisory only -- never emits a block/continue decision. |
| `post-compaction.cjs` | `PostCompaction` adapter (phase 008) -- **bespoke, not a port**. Devin fires `PostCompaction` *after* compaction with only `session_id` + a possibly-null `summary`, unlike Claude's before-compaction `PreCompact`. Implements a 5-step recovery chain: retain `summary` first, rehydrate spec-folder continuity from the shared `lastSpecFolder` state, a bounded `memory_context(mode=resume)` CLI fallback (only when `summary` is empty), provenance/length sanitization (4096-byte cap + control-char strip), then emits `additionalContext` directly. |

---

## 4. CONSUMERS

- The project's `.devin/hooks.v1.json` registers compiled `dist/hooks/devin/*.js` outputs against `SessionStart`, `UserPromptSubmit` and `Stop`, plus plain `.cjs` files against `Stop` and `PostCompaction`. The `.ts` adapters require `npm run build` in `mcp-server/` before their `dist/` paths resolve.

---

## 5. SPEC-GATE (GATE-3) AND PERMISSION HOOKS

This folder also holds the Devin CLI side of the Gate-3 spec-folder discipline (direct-run `.mjs`, no build step), calling into `../lib/spec-gate/spec-gate-core.mjs` alongside the Claude hook, the OpenCode plugin and the Codex hook so the core never changes for a new runtime. Both spec-gate entrypoints fail open. Live-probed against `devin 3000.2.17`: `spec-gate-classify.mjs` delivered Gate-3 context on `UserPromptSubmit` and `spec-gate-enforce.mjs` ran on observed `PreToolUse` events; the deny branch remains structurally verified only, since no block-severity fixture exists for an end-to-end denial.

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` and surfaces the bounded Gate-3 question as `additionalContext`. | **Live** — model-visible context observed. |
| `spec-gate-enforce.mjs` | `PreToolUse(^exec$\|^edit$)` hook. Calls `evaluateMutation()` directly; deny emits `permissionDecision: "deny"`, advise adds context. | **Live for observed tool paths** — deny branch unobserved end to end. |
| `permission-request-policy.mjs` | `PermissionRequest` hook. Combines the spec-gate mutation policy with the dispatch hard-rule engine (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`) to answer Devin permission prompts for write tools. | Registered; `PermissionRequest` unobserved in the live probe. |
| `spec-gate-devin.test.mjs`, `permission-request-policy.test.mjs` | Co-located tests, run with `node --test`. | — |

`.devin/hooks.v1.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit`, `spec-gate-enforce.mjs` to `PreToolUse` (`^exec$`, `^edit$` matchers), and `permission-request-policy.mjs` to `PermissionRequest`.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../codex/README.md`](../codex/README.md) -- structural precedent; Devin's envelope shape matches Codex's, unlike Cursor's distinct `{permission, user_message, agent_message}` shape.
- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md)
- [`specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md`](../../../../../../specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md) -- canonical current and superseded test evidence.
- [`specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md`](../../../../../../specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md) -- ADRs for `session-stop.ts`, `completion-evidence-stop.cjs`, `post-compaction.cjs`.
