---
title: "Session Handover: Codex Adapters"
description: "Codex CLI adapters for the mid-session nudge, the prompt seed and the Stop arm, sharing one event dispatcher over the relaunch core."
trigger_phrases:
  - "codex session handover"
  - "codex prompt seed"
  - "codex relaunch arm"
version: 1.0.0.0
---

# Session Handover: Codex Adapters

---

## 1. OVERVIEW

`codex/` holds the Codex CLI adapters for session handover. `.codex/hooks.json` wires `handover-prompt-seed.mjs` to `UserPromptSubmit` and `handover-context-nudge.mjs` to `PostToolUse`. The same file wires `handover-stop-arm.mjs` to `Stop` and `handover-compact-pointer.mjs` to `SessionStart`. The Codex hook installer allows each script under one event only, so seed detection and the mid-session nudge are separate entry points over `shared.mjs`. Fill comes from the rollout's latest `token_count` event. The nudge reaches the model as `hookSpecificOutput.additionalContext`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `handover-compact-pointer.mjs` | Resets the nudge level on `source: compact` and points the session at its open note. |
| `handover-context-nudge.mjs` | Runs `runCodexAdapter('PostToolUse')` from `shared.mjs`. |
| `handover-prompt-seed.mjs` | Runs `runCodexAdapter('UserPromptSubmit')` from `shared.mjs`. |
| `handover-stop-arm.mjs` | Arms the pending record at `Stop` and spawns `../lib/killer.cjs`. |
| `shared.mjs` | Parses the payload, reads Codex usage, applies the threshold and emits the seed or handoff text. |

The pointer acts only on `source: compact`, which Codex sends after it compacts a root session. It resets the nudge level, then points the session at its open note. A prepared hop already owns that note, so the pointer exits without claiming it. A withdrawn note gets the stale-note text instead, because the work since is not in it. A state write error is logged and the pointer carries on.

The seed answers a `[session-handover]` prompt with the claim instructions. Any other prompt withdraws an armed record when `SKILLED_LOOP_ID` is set and then answers with the withdrawn notice alone. A prompt that withdrew nothing runs the same threshold check as the nudge. The nudge reads the rollout's latest `token_count` event through `../lib/context-usage.cjs`. The window is `SESSION_HANDOVER_WINDOW_TOKENS`, then the event's `model_context_window`. A fill at the threshold emits the handoff text with the planned note path.

The stop arm accepts only a `Stop` payload and needs `SKILLED_LOOP_ID` in the environment. It reads the relaunch record, checks that the record is armable and requires a transcript path. It resolves the target pid, arms the record and spawns `../lib/killer.cjs` with `--loop-id`, `--target-pid` and `--transcript <transcript_path>`. A spawn failure logs `stop-arm-error` and leaves the record armed for the next Stop.

Each adapter ends a quiet path with exit 0. The stop arm logs `stop-arm-error` at the read, target-pid, arm and spawn stages. `shared.mjs` logs `context-nudge-error` at the usage, state and withdraw stages. The compact pointer logs `compact-pointer-error` and `compact-pointer-stale-note`.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the Codex trigger notes.
- [`../lib/context-usage.cjs`](../lib/context-usage.cjs): the Codex rollout reader.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the hook registration.
