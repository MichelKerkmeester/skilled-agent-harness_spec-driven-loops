---
title: "Session Relaunch: Claude Adapters"
description: "Claude Code adapters that nudge at the context threshold, arm the relaunch record at Stop, point a compacted session back at its note and guard sub-agent commands."
trigger_phrases:
  - "claude session relaunch"
  - "claude context nudge"
  - "claude relaunch arm"
version: 1.0.0.0
---

# Session Relaunch: Claude Adapters

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapters for session relaunch. `.claude/settings.json` wires `context-nudge.mjs` to `UserPromptSubmit` and `PostToolUse`, `compact-pointer.mjs` to `SessionStart`, `stop-arm.mjs` to `Stop` and `subagent-guard.mjs` to `PreToolUse` under the `Bash` matcher. The adapters measure transcript fill, emit a handoff request near the threshold, arm a record at Stop and start the detached killer. A nested runtime started from the loop's shell is dropped from the loop variables.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`compact-pointer.mjs`](./compact-pointer.mjs) | `SessionStart` | On `source: compact`, resets the nudge level and points the session at its open note, or emits a stale-note notice. On `startup`, claims a goal-command receiver's note from the claim seed. | Exits quietly. A fork compaction, a missing transcript or a failed state write is logged and ignored. |
| [`context-nudge.mjs`](./context-nudge.mjs) | `UserPromptSubmit` and `PostToolUse` | Reads the transcript fill, applies the threshold and hop cap, emits handoff text on a nudge, answers a seed prompt and withdraws a prepared note when the operator carries on. | Exits quietly. Usage, state and withdraw errors are logged. |
| [`stop-arm.mjs`](./stop-arm.mjs) | `Stop` | Arms this session's pending record and spawns `../lib/killer.cjs` with the transcript path. A spawn failure leaves the record pending for the next Stop. | Exits quietly. |
| [`subagent-guard.mjs`](./subagent-guard.mjs) | `PreToolUse` (`Bash`) | Denies a `session-relaunch.cjs` `claim`, `complete`, `keep`, `prepare`, `cancel`, `consume` or `hand-over` command from a sub-agent, because a sub-agent reports the parent's session id. | Allows every call that is not a lifecycle command from a sub-agent. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the handoff protocol.
- [`../lib/killer.cjs`](../lib/killer.cjs): the detached process `stop-arm.mjs` starts.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the hook registration.
