---
title: "ORCA-005 -- Ambiguous send resolved by terminal read back"
description: "This scenario validates that an ambiguous terminal send is resolved by reading the terminal back rather than by sending the instruction twice."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-005 -- Ambiguous send resolved by terminal read back

This file is the canonical operator contract for resolving an ambiguous Orca terminal send by reading the terminal back.

---

## 1. OVERVIEW

This scenario verifies that a send whose delivery is in doubt is settled with a read of the target terminal instead of a second send. The operator reads the paired terminal before the send, sends once with `--enter --json` and then reads the same terminal again to confirm the instruction actually landed.

### Why This Matters

A send receipt proves input acceptance, not a started turn or delivered work. `accepted: true` is only the first stage, and a default send observes for zero seconds, so a receipt that stops at `input_accepted` is expected and means unproven, not failed. Resending the same instruction to justify an unread terminal can double-submit it to the receiving agent, and silence after an ambiguous transport failure is resolved by replaying the exact command with the reported `--retry-request <id>`, never by composing a new prompt.

---

## 2. SCENARIO CONTRACT

- Objective: Prove an ambiguous terminal send is resolved by reading the terminal back rather than by sending twice.
- Real user request: `Send this instruction to the paired Orca terminal and make sure it actually landed.`
- Prompt: `Send this instruction to the paired Orca terminal and make sure it actually landed.`
- Expected execution process: Resolve one executable, list terminals and pick exactly one target, read it as the pre-send baseline, send `echo handshake` with `--enter --json`, then read the terminal again and compare with the send receipt. The version-matched guide served by the binary is the authority for exact flags.
- Expected signals: Step 1 prints a path or the scenario SKIPs with the missing executable named as the blocker. Step 2 identifies exactly one target terminal, and an ambiguous result of zero targets or several stops the run instead of guessing. After the send, the read back shows the echoed output, and when the runtime answers with a retry request id the operator reuses that id rather than issuing a second send.
- Desired user-visible outcome: A verdict that the instruction landed in the paired terminal, backed by one send and the echoed output of its read back.
- Pass/fail: PASS if one send precedes the read back and the read back shows the echoed output, with any retry carried by the reported retry request id. FAIL if the same instruction is sent twice to justify an unread terminal, or if a send result is reported as delivered without a read back. SKIP when `command -v orca` prints nothing, with the missing Orca executable named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order from the repository root. `orca` stands for the resolved executable, and the resolution order is `ORCA_CLI_COMMAND`, then `orca-dev`, then `orca-ide`, then `orca`.

1. Run `command -v orca`. If nothing prints, record `SKIP` with the missing executable as the blocker and stop.
2. Run `orca terminal list --json`. Identify exactly one target terminal from the listing. Zero targets or several targets is an ambiguous result and stops the run instead of guessing.
3. Run `orca terminal read <terminal> --json` and keep the output as the pre-send baseline.
4. Run `orca terminal send <terminal> "echo handshake" --enter --json` and keep the receipt, including any retry request id.
5. Run `orca terminal read <terminal> --json` and confirm the echoed output appears.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-005 | Ambiguous send resolved by terminal read back | Prove one send is justified by a read back and never by a second send. | `Send this instruction to the paired Orca terminal and make sure it actually landed.` | 1. `bash: command -v orca` -> 2. `bash: orca terminal list --json` -> 3. `bash: orca terminal read <terminal> --json` -> 4. `bash: orca terminal send <terminal> "echo handshake" --enter --json` -> 5. `bash: orca terminal read <terminal> --json` | A path prints in step 1, step 2 names exactly one terminal, the step 5 read back shows the echoed output, and a retry request id is reused rather than a second send issued. | Command transcript, exit statuses, the pre-send read, the send receipt with its request id, and the post-send read. | PASS if one send precedes the read back and the read back shows the echoed output. FAIL if the same instruction is sent twice to justify an unread terminal or a send is reported as delivered without a read back. SKIP when `command -v orca` prints nothing, with the missing executable as the named blocker. | 1. Confirm the resolved executable matches the resolution order. 2. Rerun the read alone to inspect the current buffer. 3. Replay the exact send with the reported `--retry-request <id>` instead of composing a new prompt. 4. Escalate with the receipt if the send returns an ambiguous transport result without a retry request id. |

### Evidence Review

The read back is the load-bearing signal, not the send receipt. An accepted input is not a started turn, and a zero exit status means the CLI ran without erroring, not that the instruction did anything, so the echoed output in the post-send read is what shows the terminal actually received the instruction.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Executable resolution and versioned preflight](../../feature-catalog/runtime/preflight-and-resolution.md) | Runtime state and recovery contract behind the read back rule. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Session and runtime reference](../../references/session-and-runtime.md) | Terminal receipt stages, retry request ids and the no-resend rule. |
| [Troubleshooting reference](../../references/troubleshooting.md) | Recovery row for ambiguous terminal transport. |
| [Router contract](../../SKILL.md) | Terminal lane rules and escalation triggers. |

---

## 5. SOURCE METADATA

- Group: Runtime
- Playbook ID: ORCA-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `runtime/ambiguous-send-recovery.md`
- Catalog entry: `terminal-receipts-and-liveness/terminal-receipts-and-liveness.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
