---
title: "Task Dispatch Library: Deep-Loop Dispatch Policy Core"
description: "Runtime-neutral core for deep-loop dispatch policy, target identity, loop-repeat state and the shared warning log."
trigger_phrases:
  - "dispatch guard core"
  - "deep loop policy core"
  - "loop repeat state"
version: 1.0.0.0
---

# Task Dispatch Library: Deep-Loop Dispatch Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy that the Task Dispatch adapters load. `subagent-dispatch-guard.cjs` is the only module here. An adapter hands it the dispatch it intercepted, then surfaces the returned decision in its own protocol. Cursor's own proxy, `../cursor/task-dispatch-guard.mjs`, spawns the Claude adapter instead of loading the core.

Current state:

- The core decides between `allow` and `warn`. A reject switch turns a warning into `reject`.
- The core persists the per-session hand-off counts and owns the path of the shared warning log. The adapter appends the lines.
- The core reads its reject switches from the environment it is handed and its tuning values from `process.env`. The kill switch belongs to the adapter.
- The core fails open. An unexpected internal error returns `allow` with no warnings and no audits.

---

## 2. ARCHITECTURE

An adapter that loads the core enters at `evaluateDispatch`. The mode check reads the deep-loop registry. The loop-repeat check reads and writes the session state file. The adapter then appends the warnings and audits through the core's logging helpers, so the policy and the log path stay in one module.

```text
╭──────────────────────────────────────────────────────────────╮
│ subagent-dispatch-guard/lib/                                 │
╰──────────────────────────────────────────────────────────────╯

┌─────────────────────────────────┐
│ Runtime adapters                │
│ claude, devin, dsh, pi,         │
│ opencode and vibe               │
└─────────────────────────────────┘
               │ evaluateDispatch(request)
               ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│ subagent-dispatch-guard.cjs     │ ─────▶ │ mode-registry.json              │
│ mode check                      │       │ agent to registered modes       │
│ loop-repeat check               │       └─────────────────────────────────┘
└─────────────────────────────────┘
               │ decision, detail, warnings, audits
               ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│ adapter surfaces decision       │ ─────▶ │ loop-guard state folder         │
│ appendWarningLog                │       │ session counts and log          │
│ appendRejectModeDegradedAudit   │       └─────────────────────────────────┘
└─────────────────────────────────┘
```

The registry lives in the system-deep-loop skill folder. Every adapter that loads the core shares one log path and one state folder for a project.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `subagent-dispatch-guard.cjs` | The whole policy core. It loads Node built-ins only and binds no runtime event. |

It exports the path constants for the registry and the state folder, the parsing helpers, the loop-state helpers and the maintenance helpers. `resolveGuardPaths` and `evaluateDispatch` are the entrypoints an adapter calls.

The state folder holds one JSON file per session, named from the hex-encoded session id, along with the warning log and its backup. A sweep archives an untouched session file into the archive folder and deletes an archived file past its retention window.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The core imports Node built-ins such as `node:fs` and `node:path`. It loads no adapter or hook helper. Nothing outside the standard library is imported. |
| Exports | Constants and helpers, plus the entrypoints an adapter calls. The module binds no runtime event. |
| Output | The core writes nothing to stdout or stderr. Warnings reach the log only through an adapter's call. |
| Ownership | Policy and loop state belong here, and the log maintenance with them. Runtime registration and the printed decision belong to each adapter. The kill switch is the adapter's too. |

Main flow:

```text
╭──────────────────────────────────────────────╮
│ adapter receives a Task dispatch             │
╰──────────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────────┐
│ resolveTargetIdentity                        │
│ target_agent=@name, Agent: @name, or the     │
│ subagent type unless it is "general"         │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│ Check 1: declared mode against the modes     │
│ registered for that agent                    │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│ Check 2: hand-offs that carry no command-    │
│ driven iteration evidence, per session       │
└──────────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────────╮
│ the decision and its detail                  │
│ reach the adapter                            │
╰──────────────────────────────────────────────╯
```

### The mode check

`declaredModeFromPrompt` reads a `mode=` value and prefers the one on a `Deep Route:` line. `loadRegistryAgents` indexes `.skilled/skills/system-deep-loop/mode-registry.json` by agent. A declared mode outside the agent's registered set warns. `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` turns that warning into a reject. An unreadable registry skips the check.

### The loop-repeat check

`isCommandDrivenIteration` accepts a prompt that carries an in-bounds `Iteration: N of M` line and a `Config:` path to a JSON file inside the project with a string `mode` and a numeric `maxIterations`. `recordLoopDispatch` counts the hand-offs that lack that evidence, per session and per target. Only `deep-research` and `deep-review` are counted. The check needs a session id. The second count warns. The third rejects when `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1`.

### Configuration

The core reads the reject switches from the environment it receives and the tuning values below from `process.env`. The adapter resolves the kill switch before it calls the core.

| Variable | Effect |
|---|---|
| `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` | Rejects a mode mismatch instead of warning. Only the value `1` turns it on. |
| `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` | Rejects the third non-command-driven hand-off. Only the value `1` turns it on. |
| `SYSTEM_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES` | Size cap for the warning log. The default is 256 KiB. |
| `SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` | Days before the sweep archives an untouched session file. The default is 2. |
| `SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` | Days before the sweep deletes an archived file. The default is 90. |
| `SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` | Minimum gap between sweeps. The default is one hour. |

The archive window also ages out the warning log and its backup file.

### State maintenance

`appendWarningLog` rotates the log to a single backup file before a line would pass the size cap. `sweepStaleLoopGuardStates` runs at most once per interval, holds a lock folder while it works, archives stale session files and prunes the archive. OpenCode calls it when a session starts.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `evaluateDispatch` | Function | Evaluate one dispatch and return the decision with its detail. |
| `resolveGuardPaths` | Function | Return the registry path and the state folder for a project root. |
| `appendWarningLog` | Function | Append one warning line to the bounded log, rotating it first. |
| `appendRejectModeDegradedAudit` | Function | Record a reject that could not be enforced, so the dispatch was allowed. |
| `sweepStaleLoopGuardStates` | Function | Archive stale session files and prune the archive, at most once per interval. |
| `resolveTargetIdentity` | Function | Resolve the agent a dispatch targets from the prompt or the subagent type. |

A request carries `subagentType`, `prompt`, `sessionID`, `projectDir` and an optional `env`. Without a target identity the core returns `allow` before it reads the registry or the state folder.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --check .skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs
```

Expected result: no output and exit 0.

```bash
node --test .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected result: the run exits 0 and the summary shows `pass 2` and `fail 0`. The parity test compares the core's decision with the DSH adapter's on one unknown identity. The throw test asserts the adapter allows and logs when its core throws.

The [Claude adapter suite](../../../../.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs) drives the core through the hook process. It prints `claude-task-dispatch-guard.test.cjs: all assertions passed` and exits 0.

---

## 7. RELATED

- [Task Dispatch Guard](../README.md): the concern overview, including its runtime table.
- [Task Dispatch Guard tests](../tests/README.md): the DSH adapter suite.
- [Claude adapter](../claude/task-dispatch-guard.cjs): one adapter over this core.
- [DSH adapter](../dsh/task-dispatch-guard.mjs): the bundle adapter the parity test drives.
- [shared switch resolver](../../shared/README.md): the kill-switch rules each adapter applies.
- [hooks index](../../README.md): the hook coverage matrix and switch index.
