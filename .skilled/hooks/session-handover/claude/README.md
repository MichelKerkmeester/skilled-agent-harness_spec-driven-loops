---
title: "Claude Session Handover: PostToolUse, PreToolUse, SessionStart, Stop and UserPromptSubmit Adapters"
description: "Claude Code adapters that nudge near the context threshold, arm the relaunch record at Stop, point a compacted session at its note and guard sub-agent commands."
trigger_phrases:
  - "claude session handover"
  - "claude context nudge"
  - "claude relaunch arm"
version: 1.0.0.0
---

# Claude Session Handover: PostToolUse, PreToolUse, SessionStart, Stop and UserPromptSubmit Adapters

---

## 1. OVERVIEW

`claude/` holds the four Claude Code adapters for the session handover concern. The nudge measures transcript fill and asks for a hand-off near the threshold. The Stop arm turns a prepared record into an armed one and starts the process that ends the session. The compact pointer sends a compacted session back to its note. The guard refuses a hand-over lifecycle command from a sub-agent and holds a question dialog while the record can still arm.

`.claude/settings.json` registers all four. `handover-context-nudge.mjs` runs at `UserPromptSubmit` and again at `PostToolUse`, each with an empty matcher and a 5 second timeout. `handover-compact-pointer.mjs` runs at `SessionStart` with a 5 second timeout. `handover-stop-arm.mjs` runs at `Stop` with a 10 second timeout and `"async": true`. `handover-subagent-guard.mjs` runs twice at `PreToolUse`, once under the `Bash` matcher and once under `AskUserQuestion`, each with a 5 second timeout.

Every registration carries the same drift fallback. When the adapter is missing or `node` fails, it prints `mk-hook-drift host=claude event=<Event> adapter=<file>` on stderr and one JSON line that tells Claude to rebuild the runtime. A checkout with no `.skilled/hooks` tree exits 0 before either runs.

Each adapter checks its switch before it reads stdin. The compact pointer is the exception: only the master and kill switches stop it before stdin, so with the enable switch off it still reads the payload and delivers the claim for a session started on the goal command. Each adapter parses the payload with `readStdin` and `parseJsonFailOpen` from `.skilled/hooks/shared/hook-adapter-shared.cjs`. All four reach the shared resolver in `.skilled/hooks/shared/hook-flags.mjs`, so `SYSTEM_HOOKS_DISABLED` is the master switch for this folder. The concern key is `session-handover`. Its kill switch is `SYSTEM_SESSION_HANDOVER_DISABLED` and its enable switch is `SYSTEM_SESSION_HANDOVER_ENABLED`. Claude is the one runtime where the concern runs with no switch set, so the default here is on.

Every quiet path exits 0 with no output. A thrown error reaches `main().catch(done)` and exits 0 as well. Errors go to the relaunch log, not the terminal. The Stop arm is the one adapter that prints on a failure. Its single `systemMessage` line names the cause and the next step.

---

## 2. DIRECTORY TREE

The folder is flat, so this table names every entry beside the README.

| File | Event | Responsibility |
|---|---|---|
| `handover-compact-pointer.mjs` | `SessionStart` | Resets the nudge level after a compaction and points the session at its open note. It also delivers the claim for a receiver started on the goal command. |
| `handover-context-nudge.mjs` | `UserPromptSubmit`, `PostToolUse` | Withdraws a deferred or armed record when the operator types a prompt. Above the threshold it emits the handoff text. |
| `handover-stop-arm.mjs` | `Stop` | Arms this session's pending record and spawns `.skilled/hooks/session-handover/lib/killer.cjs` with the transcript path. |
| `handover-subagent-guard.mjs` | `PreToolUse` | Denies a lifecycle command from a sub-agent and holds a question dialog while the record can arm. |

It holds no test file. The suites live in `../tests/`, and the folder has no subfolder or symlink.

---

## 3. VALIDATION

Run the commands from the repository root.

```bash
env -u AI_SESSION_CHILD -u SKILLED_LOOP_CLAIM_SEED node --test .skilled/hooks/session-handover/tests/claude-adapters.test.cjs
```

Expected result: every test passes, the summary reports `fail 0` and the command exits 0. The suite runs the nudge and the pointer as child processes and imports the Stop arm.

The test sandbox strips the relaunch switches it reads, but a dispatched worker shell also carries `AI_SESSION_CHILD`, and a Claude session that `skilled-loop` started on the goal command carries the loop's claim seed. The command clears both, so such a shell gives the same result as a plain one.

```bash
node --test .skilled/hooks/session-handover/tests/subagent-guard.test.cjs
```

Expected result: every test passes and the command exits 0. These cases drive the guard.

---

## 4. RELATED

- [the session handover README](../README.md): the concern overview with its runtime matrix and switch table.
- [the nudge core](../lib/nudge.cjs): the threshold rule and the message text these adapters share.
- [the relaunch core](../lib/relaunch-core.cjs): record state and the nested-loop drop.
- [the killer](../lib/killer.cjs): the detached process the Stop arm starts.
- [the Claude hook registration](../../../../.claude/settings.json): the entry for every adapter here.
- [the Claude adapter suite](../tests/claude-adapters.test.cjs): the cases for the adapters in this folder.
