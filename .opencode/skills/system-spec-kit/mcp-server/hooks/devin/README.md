---
title: "Devin Hooks: Lifecycle Adapters"
description: "Devin CLI lifecycle adapters that normalize payloads, delegate to existing Claude implementations and are verified live under devin -p with the documented registration schema."
---

# Devin Hooks: Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/devin/` adapts Devin CLI's `SessionStart` and `UserPromptSubmit` lifecycle events onto the existing Claude hook implementations in `../claude/`. Each adapter reads and validates its own Devin payload, spawns the matching compiled Claude adapter with a normalized input, and translates the result back into Devin's documented `hookSpecificOutput` response envelope (the same shape Codex uses -- confirmed by phase 001's citation that Devin's event-name set closely mirrors Claude Code's own hook contract). No lifecycle logic is duplicated: state and transcript semantics stay owned by the Claude adapters.

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

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Devin hook payload, spawns the matching `../claude/*.js` adapter, and emits Devin's `hookSpecificOutput` response envelope. |
| `session-start.ts` | `SessionStart` adapter. Delegates to `session-prime.js` and emits the returned context. |
| `user-prompt-submit.ts` | `UserPromptSubmit` adapter. Delegates to `user-prompt-submit.js` and normalizes its JSON response into the Devin envelope. |
| `session-stop.ts` | `Stop` adapter (phase 008). Delegates to the compiled `../claude/session-stop.js` via the same `shared.ts` pattern above -- no core change needed, `DevinHookEvent` already included `'Stop'`. |
| `completion-evidence-stop.cjs` | `Stop` adapter (phase 008), plain directly-runnable `.cjs` (no build step). Reads the Stop payload, resolves the active packet from the shared `lastSpecFolder` state file, and delegates policy to `../../lib/hooks/completion-evidence-sentinel.cjs`. Advisory only -- never emits a block/continue decision. |
| `post-compaction.cjs` | `PostCompaction` adapter (phase 008) -- **bespoke, not a port**. Devin fires `PostCompaction` *after* compaction with only `session_id` + a possibly-null `summary`, unlike Claude's before-compaction `PreCompact`. Implements a 5-step recovery chain: retain `summary` first, rehydrate spec-folder continuity from the shared `lastSpecFolder` state, a bounded `memory_context(mode=resume)` CLI fallback (only when `summary` is empty), provenance/length sanitization (4096-byte cap + control-char strip), then emits `additionalContext` directly. |

## 4. CONSUMERS

- The project's `.devin/hooks.v1.json` registers compiled `dist/hooks/devin/*.js` outputs against `SessionStart`, `UserPromptSubmit` and `Stop`, plus plain `.cjs` files against `Stop` and `PostCompaction`. The `.ts` adapters require `npm run build` in `mcp-server/` before their `dist/` paths resolve.

## 5. RELATED

- [`../README.md`](../README.md)
- [`../codex/README.md`](../codex/README.md) -- structural precedent; Devin's envelope shape matches Codex's, unlike Cursor's distinct `{permission, user_message, agent_message}` shape.
- [`../../runtime/hooks/devin/README.md`](../../runtime/hooks/devin/README.md)
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md`](../../../../../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md) -- canonical current and superseded test evidence.
- [`.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md`](../../../../../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/decision-record.md) -- ADRs for `session-stop.ts`, `completion-evidence-stop.cjs`, `post-compaction.cjs`.
