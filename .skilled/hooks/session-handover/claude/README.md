---
title: "Session Handover: Claude Adapters"
description: "Claude Code adapters that nudge near the context threshold, arm the relaunch record at Stop, point a compacted session at its note and guard sub-agent commands."
trigger_phrases:
  - "claude session handover"
  - "claude context nudge"
  - "claude relaunch arm"
version: 1.0.0.0
---

# Session Handover: Claude Adapters

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapters that drive session handover. `.claude/settings.json` registers every adapter here against a Claude Code event.

| Adapter | Event | Matcher |
|---|---|---|
| `handover-context-nudge.mjs` | `UserPromptSubmit`, `PostToolUse` | None |
| `handover-compact-pointer.mjs` | `SessionStart` | None |
| `handover-stop-arm.mjs` | `Stop` | None |
| `handover-subagent-guard.mjs` | `PreToolUse` | `Bash`, `AskUserQuestion` |

The nudge measures transcript fill and emits a handoff request near the threshold. At Stop an adapter arms the session's record and starts the detached killer.

A runtime started from a `skilled-loop` session's shell inherits the loop variables. The nudge, the Stop arm and the compact pointer's start claim drop those variables before they act. A nested runtime then acts as a session outside the loop.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `handover-compact-pointer.mjs` | Points a compacted session at its open note and claims a goal-command receiver's note. |
| `handover-context-nudge.mjs` | Measures transcript fill, emits the handoff request and withdraws a prepared note. |
| `handover-stop-arm.mjs` | Arms this session's pending record and spawns the detached killer. |
| `handover-subagent-guard.mjs` | Denies lifecycle commands from a sub-agent and holds a question dialog. |

`handover-compact-pointer.mjs` handles the `SessionStart` event on two sources, `compact` and `startup`. A `source: compact` payload resets the nudge level and points the session at its note. A withdrawn hand-over gets a stale-note notice instead of the claim. A `startup` payload claims a goal-command receiver's note from the claim seed.

A fork compaction or a missing transcript is logged and the hook exits. A failed state write is logged and the hook carries on. A prepared hop already owns the note, so the pointer claims nothing. The master switch and the concern kill switch silence the whole hook. An enable switch still leaves the start claim in place.

`handover-context-nudge.mjs` serves both of its events under the event name the payload carries. It skips a payload that carries an `agent_id`, because a sub-agent reports its parent's session. It answers a seed prompt with the claim instructions for that note.

A prompt the operator typed withdraws a deferred or armed record. The session then receives the withdrawn notice on that same event. A `<task-notification>` prompt never counts as the operator carrying on. An unknown context window stays quiet and logs the skip once per session.

A usage error is logged and the hook exits quietly. A withdraw error is logged and the fill check goes on as if nothing was withdrawn. A state write error is logged and the nudge still goes out.

`handover-stop-arm.mjs` arms this session's pending record and spawns `../lib/killer.cjs` with the transcript path. Three failures each print a notice that names the cause. A Stop whose payload carries no transcript path is one. A Stop that resolves no target pid below the loop is another. An arm that throws before the record is armed is the third. Each notice says the next prompt withdraws the hop and a later Stop tries again.

A spawn failure logs `stop-arm-error` with stage `spawn` and leaves the record armed. The next Stop starts a killer for that record again. Live background tasks defer the hop until the first Stop after they finish. The notice names the task count and the `cancel` command to run.

`handover-subagent-guard.mjs` answers `PreToolUse` for the two tools `Bash` and `AskUserQuestion`. It denies a `session-handover.cjs` `claim`, `complete`, `keep`, `prepare`, `cancel`, `consume` or `hand-over` call from sub-agents. A sub-agent reports the parent's session id, so the call reaches the parent's note.

It also denies a question dialog while this session's record can still be armed. That means a pending record or an armed record with no live killer. Only Stop arms the record and an open dialog keeps the turn from ending. The denial names the note and the `cancel` command to run. Every other call is allowed and so is a dialog when no record can arm.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the runtime matrix and the handoff protocol.
- [`../lib/killer.cjs`](../lib/killer.cjs): the detached process that `handover-stop-arm.mjs` starts once the record is armed.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the hook registration for every adapter in this folder.
