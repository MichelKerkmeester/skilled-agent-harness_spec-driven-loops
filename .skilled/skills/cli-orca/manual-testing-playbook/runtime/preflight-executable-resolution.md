---
title: "ORCA-004 -- Executable resolution and versioned preflight before any Orca operation"
description: "This scenario validates that the skill resolves one Orca executable in the documented order, captures version evidence and loads the version matched guide before any Orca operation runs."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-004 -- Executable resolution and versioned preflight before any Orca operation

This file is the canonical operator contract for resolving one Orca executable and loading the version matched guide before any Orca operation.

---

## 1. OVERVIEW

This scenario verifies that a session resolves exactly one Orca executable in the documented order, records which executable was selected and captures the version evidence and the version matched guide before relying on any flag.

### Why This Matters

The resolution order is `ORCA_CLI_COMMAND`, then `orca-dev`, then `orca-ide`, then `orca`, because on Linux outside an Orca-managed terminal the bare name normally resolves to the GNOME Orca screen reader. A session that falls through to a different executable after an execution error could silently target a different Orca build, changing the runtime, account, worktree or permission context under the task.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the skill resolves one executable in the documented order and loads the version matched guide before any Orca operation.
- Real user request: `Check which Orca CLI this shell will use, then load the Orca CLI guide for this version.`
- Prompt: `Check which Orca CLI this shell will use, then load the Orca CLI guide for this version.`
- Expected execution process: Resolve one executable with `command -v`, then capture the version, the local command-registry read and the version matched guide served by the binary, and record the selected executable for the whole session.
- Expected signals: Step 1 prints one path, or prints nothing when no executable resolves. When it resolves, steps 2 to 4 each exit zero, `--version` prints a version, `agent-context --json` prints a JSON object, and `skills get` prints the version matched guide rather than a stub. `ORCA_CLI_COMMAND` takes precedence over every discovered name, and a surprising path on Linux outside an Orca terminal is a fail signal rather than a curiosity.
- Desired user-visible outcome: The operator knows which executable every later Orca command uses, backed by the version output and the served guide, before any Orca operation runs.
- Pass/fail: PASS if one executable is recorded for the session and steps 2 to 4 exit zero with a printed version, a JSON object and the version matched guide. FAIL if the resolution order is not honored, if a step exits non zero without naming that exact error as the blocker, if the guide prints as a stub, or if a later command falls through to a different Orca executable. SKIP applies when `command -v orca` prints nothing, with the missing Orca executable in this environment named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order. `orca` stands for the resolved executable, and the resolution order is `ORCA_CLI_COMMAND`, then `orca-dev`, then `orca-ide`, then `orca`.

1. Run `command -v orca`. If nothing prints, record `SKIP` with the missing Orca executable as the blocker and stop.
2. Run `orca --version` and record the build identity.
3. Run `orca agent-context --json`, which reads the local command registry without a running Orca app.
4. Run `orca skills get orca-cli --full` and confirm the output is the version matched guide rather than a stub.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-004 | Executable resolution and versioned preflight | Prove one executable is resolved in the documented order and the guide loads before any operation. | `Check which Orca CLI this shell will use, then load the Orca CLI guide for this version.` | 1. `bash: command -v orca` -> 2. `bash: orca --version` -> 3. `bash: orca agent-context --json` -> 4. `bash: orca skills get orca-cli --full` | Step 1 prints one path or nothing when no executable resolves. Steps 2 to 4 exit zero with a printed version, a JSON object and the version matched guide rather than a stub. `ORCA_CLI_COMMAND` takes precedence over every discovered name, and a surprising path on Linux outside an Orca terminal is a fail signal rather than a curiosity. | The resolved path, the version output, the agent-context JSON, the served guide text, all four exit statuses and the recorded executable for the session. | PASS if one executable is recorded for the session and steps 2 to 4 exit zero with a printed version, a JSON object and the version matched guide. FAIL if the resolution order is not honored, a step exits non zero without naming that exact error as the blocker, the guide prints as a stub, or a later command falls through to a different executable. SKIP when `command -v orca` prints nothing, with the missing Orca executable as the named blocker. | 1. Confirm which resolution step should have supplied the executable, from `ORCA_CLI_COMMAND` through the bare name. 2. Read the selected executable's exact error and exit status as the evidence. 3. Check whether a surprising path is the GNOME Orca screen reader on Linux outside an Orca terminal. 4. Escalate with the recorded executable, its version and the exact error. Never fall through to a different Orca executable after an execution error. |

### Evidence Review

The recorded executable is the load-bearing evidence, not a printed path. A path alone does not prove the later commands ran against the same binary, so the operator records which executable was used and never falls through to a different Orca executable after an execution error. The `agent-context --json` step separates a broken executable from a stopped runtime, because it reads the local command registry without a running Orca app, and `skills get orca-cli --full` is what proves the guide matches the running binary rather than a stub.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Executable resolution and versioned preflight catalog entry](../../feature-catalog/runtime/preflight-and-resolution.md) | Current resolution order, preflight capture and guide-authority contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Router contract](../../SKILL.md) | States the resolution order, the preflight evidence capture and the one-executable rule. |
| [Session and runtime reference](../../references/session-and-runtime.md) | Resolution detail, runtime-state checks and the reason a fallthrough is forbidden. |
| [Troubleshooting reference](../../references/troubleshooting.md) | The missing-executable and guide-mismatch recovery rows. |

---

## 5. SOURCE METADATA

- Group: Runtime
- Playbook ID: ORCA-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `runtime/preflight-executable-resolution.md`
- Catalog entry: `runtime/preflight-and-resolution.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
