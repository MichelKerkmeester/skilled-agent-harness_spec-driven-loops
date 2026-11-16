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

`codex/` holds the Codex CLI adapters for session handover. `.codex/hooks.json` wires `handover-prompt-seed.mjs` to `UserPromptSubmit`, `handover-context-nudge.mjs` to `PostToolUse`, `handover-stop-arm.mjs` to `Stop` and `handover-compact-pointer.mjs` to `SessionStart`. The Codex hook installer allows each script under one event only, so seed detection and the mid-session nudge are separate entry points over `shared.mjs`. Fill comes from the rollout's latest `token_count` event, and the nudge reaches the model as `hookSpecificOutput.additionalContext`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`handover-compact-pointer.mjs`](./handover-compact-pointer.mjs) | `SessionStart` | On `source: compact`, which Codex sends after it compacts a root session, resets the nudge level and points the session at its open note, or sends the stale-note text for a withdrawn one. Any other source adds nothing. | Exits quietly. State errors are logged. |
| [`handover-context-nudge.mjs`](./handover-context-nudge.mjs) | `PostToolUse` | Runs `runCodexAdapter('PostToolUse')` from `shared.mjs`. | Exits quietly. |
| [`handover-prompt-seed.mjs`](./handover-prompt-seed.mjs) | `UserPromptSubmit` | Runs `runCodexAdapter('UserPromptSubmit')`, which answers a `[session-handover]` prompt with the claim instructions and withdraws a prepared record on an operator prompt. | Exits quietly. |
| [`shared.mjs`](./shared.mjs) | Shared dispatcher | Parses the payload, checks the event name, reads Codex usage, applies the threshold and emits the seed or handoff text. | Exits quietly. Usage and nudge errors are logged. |
| [`handover-stop-arm.mjs`](./handover-stop-arm.mjs) | `Stop` | Accepts only a `Stop` payload, arms the pending record and spawns `../lib/killer.cjs` with `--transcript <transcript_path>`. A spawn failure leaves the record armed for the next Stop. | Exits quietly. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the Codex trigger notes.
- [`../lib/context-usage.cjs`](../lib/context-usage.cjs): the Codex rollout reader.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the hook registration.
