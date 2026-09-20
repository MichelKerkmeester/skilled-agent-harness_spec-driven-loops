---
title: "ORCA-006 -- Stopped runtime recovered deliberately with state re-verified"
description: "This scenario validates that a stopped Orca runtime is recognized and restarted deliberately, with pre-stop state claims re-verified by a read back before work continues."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-006 -- Stopped runtime recovered deliberately with state re-verified

This file is the canonical operator contract for recognizing a stopped Orca runtime, recovering it deliberately and re-verifying state claims afterwards.

---

## 1. OVERVIEW

This scenario verifies that a terminal that went quiet is diagnosed as a stopped runtime rather than as a dead terminal, that the restart is a named action instead of a hidden side effect and that the post-restart state is re-verified before any work continues.

### Why This Matters

A stopped runtime shows either a non zero exit with an ordinary error object or an empty terminal list while the binary itself still answers, and the documented start path is `orca open --json` followed by a retry. Starting or authenticating a runtime is an action to surface to the user, never a hidden side effect of another request, and the pre-stop terminal and worktree identifiers are not assumed to still be valid after recovery.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a stopped runtime is recovered deliberately and that state claims are re-verified with a fresh read afterwards.
- Real user request: `My Orca terminal went quiet. Work out whether the runtime is stopped and bring it back safely.`
- Prompt: `My Orca terminal went quiet. Work out whether the runtime is stopped and bring it back safely.`
- Expected execution process: Establish the observed state with the executable check, version, agent context and terminal list, start the runtime with `orca open --json`, then rerun the terminal list and read it before continuing. The version-matched guide served by the binary is the authority for exact flags.
- Expected signals: Steps 1 to 4 establish the observed state. A stopped runtime shows either a non zero exit with an ordinary error object or an empty terminal list while the binary itself still answers. Step 5 starts the runtime again and step 6 must be read before any work continues, because the pre-stop terminal and worktree identifiers are not assumed to still be valid.
- Desired user-visible outcome: A verdict that names the observed stopped state, the restart action taken and the post-restart terminal listing that re-verified the identifiers.
- Pass/fail: PASS if the second terminal list is captured and read after the restart before any work continues. FAIL if execution continues against the pre-stop identifiers without the second list, or if the recoverability of a worktree or terminal state is claimed without a read back. SKIP when `command -v orca` prints nothing, with the missing Orca executable named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order from the repository root. `orca` stands for the resolved executable, and the resolution order is `ORCA_CLI_COMMAND`, then `orca-dev`, then `orca-ide`, then `orca`.

1. Run `command -v orca`. If nothing prints, record `SKIP` with the missing executable as the blocker and stop.
2. Run `orca --version` and record the build identity.
3. Run `orca agent-context --json`, which reads the local command registry without a running Orca app, so a failure here separates a broken executable from a stopped runtime.
4. Run `orca terminal list --json` and keep the result as the pre-stop state.
5. Run `orca open --json` to start the runtime again.
6. Run `orca terminal list --json` again and read the result before any work continues.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-006 | Stopped runtime recovered deliberately with state re-verified | Prove the restart is deliberate and the second list is read before work continues. | `My Orca terminal went quiet. Work out whether the runtime is stopped and bring it back safely.` | 1. `bash: command -v orca` -> 2. `bash: orca --version` -> 3. `bash: orca agent-context --json` -> 4. `bash: orca terminal list --json` -> 5. `bash: orca open --json` -> 6. `bash: orca terminal list --json` | Steps 1 to 4 establish the observed state with a non zero exit and an ordinary error object or an empty terminal list while the binary still answers. Step 5 starts the runtime. Step 6 is captured and read before work continues. | Command transcript, exit statuses, the pre-stop list, the start result and the post-restart list. | PASS if the second terminal list is captured and read after the restart before work continues. FAIL if execution continues against the pre-stop identifiers without the second list or recoverability is claimed without a read back. SKIP when `command -v orca` prints nothing, with the missing executable as the named blocker. | 1. Confirm the resolution order with the resolved executable recorded. 2. Retry the exact runtime command once after the start, per the recovery taxonomy. 3. Compare the pre-stop and post-restart lists before trusting any identifier. 4. Escalate with the original error object if the restart does not restore runtime state. |

### Evidence Review

The second list is the load-bearing signal, not the restart. A zero exit status from `orca open --json` means the command ran without erroring, not that the pre-stop identifiers survived, so the fresh terminal list is what licenses any later claim about worktree or terminal state.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Executable resolution and versioned preflight](../../feature-catalog/runtime/preflight-and-resolution.md) | Runtime state and recovery contract behind the restart rule. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Session and runtime reference](../../references/session-and-runtime.md) | Runtime state checks, the documented start path and the one-executable rule. |
| [Troubleshooting reference](../../references/troubleshooting.md) | The stopped-runtime recovery row and evidence handling. |
| [Router contract](../../SKILL.md) | Runtime escalation triggers and mutation boundary. |

---

## 5. SOURCE METADATA

- Group: Runtime
- Playbook ID: ORCA-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `runtime/runtime-stopped-recovery.md`
- Catalog entry: `terminal-receipts-and-liveness/terminal-receipts-and-liveness.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
