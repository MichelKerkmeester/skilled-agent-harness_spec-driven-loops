---
title: "421 -- MCP Launcher Owner Disposal Relaunch Gate"
description: "Manual check for the automated-test-backed launcher guard that aborts daemon relaunch after the owning MCP runtime exits, while preserving crash and recycle recovery."
---

# 421 -- MCP Launcher Owner Disposal Relaunch Gate

## 1. OVERVIEW

This scenario verifies the launcher guard that stops a relaunch timer from starting a fresh mk-spec-memory daemon after the owning MCP runtime has exited. Without the guard, a session ending sent SIGTERM to the shared daemon and the launcher respawned it under the disposing runtime, so every bridged session lost its MCP transport.

The check is automated-test-backed. A human runs the launcher syntax checks, the launcher watchdog unit suite, and targeted greps that prove the predicate is defined, exported, wired into the timer callback, and does not block crash or recycle recovery while the owner is alive.

## 2. SCENARIO CONTRACT

- Objective: Confirm owner disposal aborts a delayed daemon relaunch while normal crash and recycle recovery still relaunch under a live owner.
- Real user request: `Why did every bridged session lose mk-spec-memory transport when one owning session ended, and is it fixed without breaking crash recovery?`
- Prompt: `Validate the mk-spec-memory launcher owner-disposal relaunch gate and confirm crash and recycle recovery remain active.`
- Expected execution process: Run the launcher syntax checks, run the launcher watchdog unit tests, grep for the predicate definition/export/call site, and inspect the crash and recycle relaunch wiring.
- Expected signals: `node --check` exits cleanly for both launcher files. `launcher-watchdog.vitest.ts` passes including the `shouldAbortRelaunchOnFire` cases. The predicate appears at its lib definition, the launcher re-export and the timer call site. `recycleDaemonInPlace` and the crash relaunch path still reach `launchServer`.
- Desired user-visible outcome: The MCP daemon no longer flaps after owner-session disposal, and live-owner recovery behavior is unchanged.
- Pass/fail: PASS only when syntax, unit tests, predicate wiring, and recovery-path evidence all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the mk-spec-memory launcher owner-disposal relaunch gate and confirm crash and recycle recovery remain active.
```

### Commands

1. `node --check .opencode/bin/mk-spec-memory-launcher.cjs`
2. `node --check .opencode/bin/lib/model-server-supervision.cjs`
3. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-watchdog.vitest.ts`
4. `rg -n "shouldAbortRelaunchOnFire" .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/lib/model-server-supervision.cjs`
5. `rg -n "recycleDaemonInPlace|scheduleRelaunch|launchServer\(" .opencode/bin/mk-spec-memory-launcher.cjs`

### Expected

- Commands 1 and 2 exit with no syntax errors.
- Command 3 passes the launcher watchdog suite, including the five `shouldAbortRelaunchOnFire` cases.
- Command 4 shows the predicate definition in the supervision lib, the launcher re-export, and the timer-callback call site.
- Command 5 shows the recycle and crash relaunch paths still present and still connected to `launchServer`.

### Evidence

Shell transcript for all commands: the two `node --check` exit statuses, the vitest pass summary for `tests/launcher-watchdog.vitest.ts`, and the grep output showing the predicate wiring plus the recovery-path lines.

### Pass / Fail

- **Pass**: both syntax checks pass, the watchdog suite passes, the predicate is defined/exported/called, and the live-owner recovery paths still reach `launchServer`.
- **Fail**: any syntax check fails, any `shouldAbortRelaunchOnFire` case fails, the predicate is missing from grep output, the timer callback does not call it, or the crash/recycle relaunch paths no longer reach `launchServer`.

### Failure Triage

If a syntax check fails, inspect the helper placement and the CommonJS exports first. If a predicate case fails, compare the implementation to the required true-states: shutdown in progress, a changed parent pid, and reparent to pid 1. If grep cannot find the predicate, confirm the lib definition, the launcher re-export, and the timer call site all exist. If the recovery wiring is unclear, read the `superviseChildExit`, `scheduleRelaunch`, `recycleDaemonInPlace`, and `launchServer` lines together.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Primary implementation anchor |
| `.opencode/bin/lib/model-server-supervision.cjs` | Pure relaunch-gate predicate anchor |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Regression or validation anchor |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 421
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md`
