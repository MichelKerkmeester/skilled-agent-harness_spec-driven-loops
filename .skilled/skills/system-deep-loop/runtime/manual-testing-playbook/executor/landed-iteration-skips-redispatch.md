---
title: "DLR-063 -- Landed iteration skips the redispatch"
description: "This scenario validates that a research or review iteration which already landed is not dispatched a second time when its verify check fails with executor_missing, findings_not_enumerated or ledger_backing_missing, for `DLR-063`. It focuses on the redispatch rule in both command workflows."
version: 2.1.0.0
---

# DLR-063 -- Landed iteration skips the redispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-063`.

---

## 1. OVERVIEW

This scenario validates the redispatch rule for a landed iteration. A verify failure with one of three reasons must not spend a second dispatch, because the iteration already wrote its narrative, state record and delta.

### Why This Matters

A second dispatch would find the iteration files already written and refuse to overwrite them. That wastes a leaf run and leaves the loop waiting on a rerun that cannot succeed. Every other verify failure keeps its one redispatch.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that the three landed-iteration reasons skip the redispatch in both workflows.

- Objective: Confirm that `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing` are returned only for a landed iteration, and that the redispatch rule skips a second dispatch for each.
- Real user request: Make sure a research or review iteration that already wrote its files is not run again after a verify failure.
- Prompt: `Check that a deep-research or deep-review iteration which already landed is not dispatched a second time when its verify check fails with executor_missing, findings_not_enumerated or ledger_backing_missing. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the verify and counter suites by file stem, then read the shared skip clause in both command workflows.
- Expected signals: The verify suite pins each reason against the artifacts that must exist first. Both `redispatch_once` rules carry the same skip clause. Every other failure, route proof included, still gets exactly one redispatch.
- Desired user-visible outcome: The operator can say a landed iteration is kept as it is, and is never dispatched a second time.
- Pass/fail: PASS if the named suites pass and both workflow rules carry the skip clause; FAIL if a landed iteration with one of the three reasons is dispatched again, or the clause is missing from either workflow.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that a deep-research or deep-review iteration which already landed is not dispatched a second time when its verify check fails with executor_missing, findings_not_enumerated or ledger_backing_missing. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run verify-iteration.vitest`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run loop-counters-derivation.vitest`
3. `rg -n "Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing" .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml`
4. `rg -n "executor_missing|findings_not_enumerated|ledger_backing_missing" .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`

### Expected

Commands 1 and 2 exit 0 with every case passing. The verify suite includes the case that returns `executor_missing` only for a landed iteration, where removing any artifact changes the reason. Command 3 prints one skip clause in each workflow's `redispatch_once` rule. Command 4 prints the three reason constants that the verify script returns.

### Evidence

- The vitest summary line and exit status for commands 1 and 2.
- The `rg` output for commands 3 and 4, read from the current files.

### Pass / Fail

- **Pass**: Commands 1 and 2 exit 0, and command 3 prints the skip clause in both workflow files.
- **Fail**: A landed iteration with one of the three reasons is dispatched again, the clause is missing from either workflow, or any named case fails.

### Failure Triage

- The skip clause is missing from one workflow: the two rules must match word for word, so restore the clause in the file that lacks it.
- A landed iteration is redispatched: check that the reason is returned only after the narrative, state record and delta exist in `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`.
- The verify suite reports a reason on an iteration with no landed artifacts: the reason table case has drifted from the artifact rule.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/commands/deep/assets/deep-research.yaml` | Research `redispatch_once` rule with the skip clause |
| `.skilled/commands/deep/assets/deep-review.yaml` | Review `redispatch_once` rule with the same skip clause |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Reason constants and the landed-artifact check that returns them |

### Validation

| File | Role |
|---|---|
| `verify-iteration.vitest` | Reason table and the landed-iteration cases |
| `loop-counters-derivation.vitest` | Counting a landed iteration once, with an error row that follows it |

---

## 5. SOURCE METADATA

- Group: EXECUTOR
- Playbook ID: DLR-063
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `executor/landed-iteration-skips-redispatch.md`
- Feature catalog status: this scenario does not cite a specific catalog entry.
