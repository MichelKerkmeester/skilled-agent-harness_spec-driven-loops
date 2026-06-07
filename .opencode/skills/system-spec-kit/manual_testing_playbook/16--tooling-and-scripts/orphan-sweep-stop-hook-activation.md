---
title: "425 -- Orphan Sweep Stop-Hook Activation"
description: "Manual check for the automated-test-backed Stop-hook orphan-sweep fallback that stays off by default and only sweeps stray launcher processes when the operator opts in via the environment flag."
---

# 425 -- Orphan Sweep Stop-Hook Activation

## 1. OVERVIEW

This scenario verifies that the session-cleanup Stop hook ships an orphan-sweep fallback that is off by default and only runs when an operator explicitly opts in through the environment flag. The sweep reaps stray launcher processes that a previous session left behind, but it must stay opt-in so it never reaps a process that a concurrent live session still depends on.

The check is automated-test-backed. A human runs the shell syntax check, the Stop-hook orphan-sweep unit suite, and a grep that proves the fallback function and the controlling flag are defined and wired into the hook. Together they confirm the sweep defaults to off and activates only when the flag is set.

## 2. SCENARIO CONTRACT

- Objective: Confirm the Stop-hook orphan-sweep fallback defaults to off and only runs when the operator sets the activation flag.
- Real user request: `Stray launcher processes pile up after sessions end. Is there an opt-in cleanup on the Stop hook, and is it safely off by default so it doesn't kill a live session?`
- Prompt: `Validate the Stop-hook orphan-sweep fallback and confirm it is default-off and only activates when the environment flag is set.`
- Expected execution process: Run the shell syntax check, run the Stop-hook orphan-sweep unit tests, and grep for the fallback function and the controlling flag to confirm they are defined and the flag defaults to off.
- Expected signals: `bash -n` exits cleanly for the cleanup script. `launcher-stop-hook-orphan-sweep.vitest.ts` passes including the default-off and flag-enabled cases. `run_orphan_sweep_fallback` and `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` appear at the function definition, the default-off assignment and the activation guard.
- Desired user-visible outcome: Operators can opt into reaping leftover launcher processes on session end, while the default behavior leaves live sessions untouched.
- Pass/fail: PASS only when syntax, unit tests, and flag-gated wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the Stop-hook orphan-sweep fallback and confirm it is default-off and only activates when the environment flag is set.
```

### Commands

1. `bash -n .opencode/scripts/session-cleanup.sh`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-stop-hook-orphan-sweep.vitest.ts`
3. `rg -n "run_orphan_sweep_fallback|SPECKIT_STOP_HOOK_ORPHAN_SWEEP" .opencode/scripts/session-cleanup.sh`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the orphan-sweep suite, including the default-off case where no sweep runs and the flag-enabled case where the fallback runs.
- Command 3 shows `run_orphan_sweep_fallback` at its definition, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` defaulting to off, and the guard that only calls the fallback when the flag is set.

### Evidence

Shell transcript for all commands: the `bash -n` exit status, the vitest pass summary for `tests/launcher-stop-hook-orphan-sweep.vitest.ts`, and the grep output showing the fallback function, the default-off flag assignment, and the activation guard.

### Pass / Fail

- **Pass**: the syntax check passes, the orphan-sweep suite passes, the flag defaults to off, and the fallback only runs when the flag is set.
- **Fail**: the syntax check fails, any default-off or flag-enabled case fails, the flag does not default to off, or the fallback runs unconditionally.

### Failure Triage

If the syntax check fails, inspect the function placement and the shell quoting first. If the default-off case fails, confirm `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` resolves to `off` when unset and the guard skips the sweep. If the flag-enabled case fails, confirm the guard calls `run_orphan_sweep_fallback` only when the flag is set to an on value. If grep cannot find the tokens, confirm the function definition, the default assignment, and the activation guard all exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/16--tooling-and-scripts/orphan-sweep-stop-hook-activation.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/scripts/session-cleanup.sh` | Primary implementation anchor |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Orphan-only sweeper anchor |
| `mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Regression or validation anchor |

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 425
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/orphan-sweep-stop-hook-activation.md`
