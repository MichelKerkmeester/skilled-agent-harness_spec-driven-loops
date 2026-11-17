---
title: "DLR-062 -- Divergent council quorum retry"
description: "This scenario validates that a divergent pivot council gets three seats per attempt and one retry after a first-attempt quorum miss, for `DLR-062`. It focuses on the seat budget and the attempt identity that the retry relies on."
version: 2.1.0.0
---

# DLR-062 -- Divergent council quorum retry

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DLR-062`.

---

## 1. OVERVIEW

This scenario validates the divergent pivot council budget. It focuses on three seats per council attempt, one retry after a first-attempt quorum miss, and a seat cap that counts only the pivot being prepared.

### Why This Matters

A quorum miss used to end a pivot for good. A resumed or later pivot could also be refused because an earlier pivot had spent seats. The retry gives one pivot one more council attempt. The per-pivot cap keeps the run bounded.

---

## 2. SCENARIO CONTRACT

Operators run the exact commands below and confirm that one missed seat round gets one retry, and that a second miss stops the pivot.

- Objective: Confirm that a first-attempt quorum miss reopens the same pivot as attempt 2 exactly once, and that a second miss stays terminal.
- Real user request: If a council seat does not return, make sure the pivot retries once and then stops, instead of looping.
- Prompt: `Check that a divergent pivot whose first council attempt misses quorum gets exactly one retry, and that a second miss fails closed. Return a PASS or FAIL verdict with the reason.`
- Expected execution process: Run the three pivot suites by file stem, then read the retry signal and the attempt identity in source.
- Expected signals: A first-attempt quorum miss writes a `pivot_attempt_failed` event and a retryable finalize result. The retry reopens the pivot as attempt 2 with its own seat paths and event ids. A second quorum miss ends the pivot, and no third attempt opens.
- Desired user-visible outcome: The operator can say a pivot tolerates one missed seat round and then stops.
- Pass/fail: PASS if the named suites pass and the source shows one retry signal; FAIL if a second quorum miss opens a third attempt, or a per-attempt seat budget above three is allowed.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- The `runtime/` vitest suites are installed under `.skilled/skills/system-deep-loop/runtime`.

### Prompt

- Prompt: `Check that a divergent pivot whose first council attempt misses quorum gets exactly one retry, and that a second miss fails closed. Return a PASS or FAIL verdict with the reason.`

### Commands

1. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot.vitest`
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot-seat-scope.vitest`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run divergent-pivot-cli.vitest`
4. `rg -n "pivot_attempt_failed|retryable" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`
5. `rg -n "maxCouncilSeatOutputs" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`

### Expected

Commands 1 to 3 exit 0 with every case passing. The integration suite includes the case that retries a first-attempt quorum failure once and completes, and the case where the retry also misses quorum and opens no third attempt. The seat-scope suite counts zero seat outputs for a later pivot after a completed first pivot. The CLI suite includes the case where finalize prints a retryable quorum failure. Command 4 prints the attempt-failed event and the retryable flag. Command 5 prints the per-attempt seat budget with its default of 3.

### Evidence

- The vitest summary line and exit status for commands 1 to 3.
- The `rg` lines for commands 4 and 5, read from the current source.

### Pass / Fail

- **Pass**: Commands 1 to 3 exit 0 with the retry cases passing, and commands 4 and 5 show the retry signal and the seat budget.
- **Fail**: A second quorum miss opens a third attempt, a per-attempt seat budget above three is allowed, or any named case fails.

### Failure Triage

- The retry case is missing or renamed: restore it in the integration suite before trusting the verdict.
- A first-attempt quorum miss ends the pivot without a retry: check that finalize writes `pivot_attempt_failed` and returns `retryable`.
- A later pivot is refused because an earlier pivot spent seats: check the seat count in `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` and `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts`.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Per-attempt seat budget, attempt identity and the one-time retry |
| `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | Seat counting for the pivot about to be prepared, research |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Seat counting for the pivot about to be prepared, review |

### Validation

| File | Role |
|---|---|
| `divergent-pivot.vitest` | Retry, attempt 2 identity and the fail-closed second miss |
| `divergent-pivot-seat-scope.vitest` | Seat counting for a later pivot |
| `divergent-pivot-cli.vitest` | Retryable finalize output |

---

## 5. SOURCE METADATA

- Group: COUNCIL
- Playbook ID: DLR-062
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `council/divergent-council-quorum-retry.md`
- Feature catalog status: this scenario does not cite a specific catalog entry.
