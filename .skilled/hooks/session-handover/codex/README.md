---
title: "Codex Session Handover: UserPromptSubmit, PostToolUse, Stop and SessionStart Adapters"
description: "Codex adapters for the prompt seed, the mid-session nudge, the Stop arm and the compaction pointer, sharing one event dispatcher over the relaunch core."
trigger_phrases:
  - "codex session handover"
  - "codex prompt seed"
  - "codex relaunch arm"
version: 1.0.0.0
---

# Codex Session Handover: UserPromptSubmit, PostToolUse, Stop and SessionStart Adapters

---

## 1. OVERVIEW

`.skilled/hooks/session-handover/codex/` holds the Codex adapters for the session handover concern. `handover-prompt-seed.mjs` runs at `UserPromptSubmit` and answers the relaunch seed prompt with its claim instructions. `handover-context-nudge.mjs` runs at `PostToolUse` and asks for a handoff note once the session fill crosses the threshold. `handover-stop-arm.mjs` runs at `Stop`, arms the relaunch record and starts the killer. `handover-compact-pointer.mjs` runs at `SessionStart` and points a compacted session back at its open note. A quiet path prints nothing.

The prompt seed and the context nudge are separate entry points over one dispatcher, `shared.mjs`. `runCodexAdapter(expectedEvent)` takes the event the entry point serves. The seed passes `UserPromptSubmit` and the nudge passes `PostToolUse`. Both then run the same threshold check, so a non-seed prompt on the way in can raise the nudge as well. The stop arm exports `armPendingRecord()` and does not use the dispatcher.

`.codex/hooks.json` registers one script per event, under `UserPromptSubmit`, `PostToolUse`, `Stop` and `SessionStart`. The stop arm carries a 10 second timeout. Each of the other entries carries 5 seconds. Every entry wraps the command in a drift fallback. When a script is missing or `node` fails, the fallback prints `mk-hook-drift host=codex event=<Event> adapter=<file>` to stderr. It then prints a JSON message on stdout that asks the operator to build the spec-kit runtime or restore the adapter. That message is `hookSpecificOutput.additionalContext` for the `UserPromptSubmit`, `PostToolUse` and `SessionStart` entries and `systemMessage` for `Stop`.

Each adapter checks the concern switch before it reads stdin. A switch that is off returns at once. Otherwise the adapter reads the JSON payload on stdin and drops a payload that does not parse. It also returns at once when the payload names an event other than the one it expects or when the payload carries no usable session id.

The concern is off by default in Codex. `SYSTEM_SESSION_HANDOVER_CODEX_ENABLED=1` turns the adapters on for this runtime. `SYSTEM_SESSION_HANDOVER_ENABLED=1` turns the concern on for every runtime that has not set its own switch. `SYSTEM_HOOKS_DISABLED` is the master switch, because every adapter reaches the shared resolver in `.skilled/hooks/shared/hook-flags.mjs`. Every path ends at exit status 0. The one output a failure can add is the stop arm's `systemMessage` notice, which names why the hop could not arm.

---

## 2. DIRECTORY TREE

The folder is flat. The table names every entry beside this README.

| File | Responsibility |
|---|---|
| `handover-compact-pointer.mjs` | The `SessionStart` adapter. It acts only on `source: compact`, resets the nudge level and then points the session at its open note. |
| `handover-context-nudge.mjs` | The `PostToolUse` entry point. It calls `runCodexAdapter('PostToolUse')` in `shared.mjs`. |
| `handover-prompt-seed.mjs` | The `UserPromptSubmit` entry point. It calls `runCodexAdapter('UserPromptSubmit')` in `shared.mjs`. |
| `handover-stop-arm.mjs` | The `Stop` adapter. It arms the pending record and starts the killer at `.skilled/hooks/session-handover/lib/killer.cjs` against the session process. |
| `shared.mjs` | The dispatcher both prompt events use. It checks the switch, reads Codex usage from the rollout, applies the threshold and writes the seed or handoff text. |

The suite that drives all four adapters lives in the concern's tests folder, at `.skilled/hooks/session-handover/tests/codex-adapters.test.cjs`.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/codex-adapters.test.cjs
```

Expected result: `fail 0` in the summary and exit status 0. The suite starts each adapter, feeds it a payload and checks the envelope, the state file and the killer arguments. `AI_SESSION_CHILD=1` marks a dispatched child session, which owns no hand-over, so the prefix clears it for the run.

---

## 4. RELATED

- [The session handover concern](../README.md): the runtime matrix and the switches that cover every adapter.
- [The nudge core](../lib/nudge.cjs): the threshold, the level state and the seed and handoff text.
- [The relaunch core](../lib/relaunch-core.cjs): the relaunch record, the log and the payload event check.
- [The Codex usage reader](../lib/context-usage.cjs): the function that reads the rollout's latest `token_count` event.
- [The Codex registration](../../../../.codex/hooks.json): the four entries that run these adapters.
