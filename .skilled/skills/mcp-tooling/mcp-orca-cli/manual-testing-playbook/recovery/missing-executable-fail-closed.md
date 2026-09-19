---
title: "ORCA-003 -- Fail closed on a missing executable"
description: "This scenario validates that the packet fails closed when no Orca executable resolves, without installing or inspecting source silently."
stage: recovery
version: 0.1.1.0
---

# ORCA-003 -- Fail closed on a missing executable

## 1. OVERVIEW

This scenario exercises the missing-executable recovery path in a disposable shell environment where `PATH` cannot resolve an Orca executable.

### Why This Matters

The resolution order is terminal: an execution error must not fall through to another executable, because the substitute can carry a different runtime, account or permission context. This scenario proves the failure stays a failure.

---

## 2. SCENARIO CONTRACT

- Feature ID: `ORCA-003`
- Feature Name: Fail closed on a missing executable
- Scenario Objective: With no resolvable executable, the packet reports the failure and asks the operator instead of installing, inspecting source or switching executables.
- Exact Prompt: `In a shell with no Orca executable, request an Orca worktree listing and observe the failure behavior. Do not install anything.`
- Exact Command Sequence: `1. agent: resolve the Orca executable in an isolated PATH -> 2. bash: command -v orca (expected: not found) -> 3. agent: report the failure and ask the operator`
- Expected Signals: `command -v` finds nothing. The packet reports the missing executable with its resolution attempt. No installation, source inspection or silent retry occurs.
- Evidence: The isolated `PATH` state, the `command -v` result and the reported failure text.
- Pass/Fail Criteria: PASS when the packet fails closed and asks. FAIL on any silent install, source inspection or executable switch. SKIP without an authorized isolated shell environment.
- Failure Triage: 1. Confirm the environment was genuinely isolated. 2. Re-run the resolution order. 3. Escalate any observed fall-through as a contract violation.

---

## 3. TEST EXECUTION

### Prerequisites

A disposable shell whose `PATH` cannot resolve `orca`, `orca-dev` or `orca-ide`. Alternatively, the operator's explicit go-ahead simulates the condition.

### Prompt

`In a shell with no Orca executable, request an Orca worktree listing and observe the failure behavior. Do not install anything.`

### Commands

1. Resolve the executable in the isolated environment.
2. `command -v orca`
3. Report the failure and ask the operator.

### Expected

The failure is reported as a missing executable with the resolution attempt recorded. No command is guessed, installed or retried on another executable.

### Evidence

Isolated `PATH` state, `command -v` output, reported failure text.

### Pass / Fail

- **Pass:** the packet fails closed and asks the operator.
- **Skip:** no authorized isolated environment exists.
- **Fail:** any silent install, source inspection or executable switch.

### Failure Triage

1. Verify the environment was isolated.
2. Re-run the documented resolution order.
3. Treat any observed fall-through as a hard contract violation and record it.

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-003 | Fail closed on a missing executable | Prove no install, no source inspection, no fall-through | `In a shell with no Orca executable, request an Orca worktree listing and observe the failure behavior. Do not install anything.` | isolation -> `command -v orca` -> report and ask | Not found. Failure reported. No retry | PATH state, command output, failure text | PASS on fail-closed. SKIP without isolated env. FAIL on silent fallback | Verify isolation, rerun order, escalate violation |

---

## 4. SOURCE FILES

### Playbook Sources

| Source | Location |
|---|---|
| Packet runtime contract | `SKILL.md` |
| Recovery rows | `references/troubleshooting.md` Section 2 |

---

## 5. SOURCE METADATA

- Group: Recovery
- Playbook ID: `ORCA-003`
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `recovery/missing-executable-fail-closed.md`
