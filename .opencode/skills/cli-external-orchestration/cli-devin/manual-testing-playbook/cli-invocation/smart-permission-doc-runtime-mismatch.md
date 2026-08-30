---
title: "DV-004 -- Smart permission help/runtime mismatch"
description: "Verify that the installed Devin binary rejects the smart permission value even though help text prints it."
version: 1.0.0.0
---

# DV-004 -- Smart permission help/runtime mismatch

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-004`.

> **STALE AS OF `devin 3000.6.7` — do not act on this scenario's expected result.**
> This test was recorded against `3000.2.17`, where the binary rejected `smart`. On
> `3000.6.7` the binary **accepts** `smart`, so the PASS condition below ("runtime
> rejects it") can no longer be met. The mismatch this documents has inverted: help
> now under-reports the enum rather than over-reporting it — it prints 4 of 8 accepted
> values. Re-baseline against the installed binary before running. Probe recipe and the
> verified enum: `../../references/cli-reference.md` `--permission-mode` row.

## 1. OVERVIEW

Probe the exact documentation/runtime mismatch: `devin --help` prints `smart`, while the installed binary rejects it. This scenario must not silently normalize the result into a successful mode.

### Why This Matters

Permission-mode routing is safety-critical. Treating a help-only value as executable can make a dispatcher believe it selected a policy that the binary did not accept.

---

## 2. SCENARIO CONTRACT

- Objective: Reproduce and document the mismatch between help output and runtime validation.
- Real user request: `Does Devin really accept the smart permission mode shown in its help?`
- Prompt: `Reply with one sentence only: report the result of the permission-mode probe; do not edit files.`
- Expected execution process: Capture `devin --help`, then invoke a harmless print request with `--permission-mode smart`; compare the exit/output with valid `normal`.
- Expected signals: Help contains `smart`; the `smart` invocation is rejected by the binary; a `normal` control invocation succeeds if authenticated.
- Desired user-visible outcome: The route documents `smart` as invalid for this installed version and uses only verified values.
- Pass/fail: PASS when help advertises but runtime rejects `smart`; FAIL if the test reports `smart` as accepted without evidence; SKIP only when the binary cannot be invoked.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Reply with one sentence only: report the result of the permission-mode probe; do not edit files.`

### Commands

1. `devin --help > /tmp/cli-devin-dv004-help.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-help.txt`
2. `devin -p "Reply with one sentence only: permission probe control succeeded." --model adaptive --permission-mode smart </dev/null > /tmp/cli-devin-dv004-smart.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-smart.txt`
3. `devin -p "Reply with one sentence only: permission probe control succeeded." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv004-normal.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv004-normal.txt`
4. Record the help line, rejection text, and control result.

### Expected

Help mentions `smart`; runtime rejects it

### Evidence

Captured output files from every command in §3, the table's Expected Signal cell (`Help mentions `smart`; runtime rejects it`), and the exit code recorded alongside each command.

### Pass / Fail

- **Pass**: when help advertises but runtime rejects `smart`.
- **Fail**: if the test reports `smart` as accepted without evidence
- **Skip**: only when the binary cannot be invoked. (a missing or unavailable prerequisite is the named blocker).

### Failure Triage

1. **Signal mismatch**: the captured output does not match the Expected Signal cell; re-run the exact command sequence above and diff the new output against it.
2. **Preflight/blocker**: if the required binary, auth, or workspace precondition is unavailable, record the SKIP with that exact blocker rather than guessing a result.
3. **Unexpected mutation**: if the repository or a temporary workspace shows an unexpected diff, treat the scenario as FAIL regardless of the command's own exit code.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Valid-mode precondition and mismatch policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Permission-mode reference, reconciled against live facts |
| `../../SKILL.md` | Explicit-mode dispatch rule |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/smart-permission-doc-runtime-mismatch.md`
