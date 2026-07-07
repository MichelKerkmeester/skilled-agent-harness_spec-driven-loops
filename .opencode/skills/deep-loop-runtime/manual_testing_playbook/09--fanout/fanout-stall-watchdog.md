---
title: "DLR-046 -- Fan-out stall watchdog"
description: "Manual validation scenario for Fan-out stall watchdog in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-046 -- Fan-out stall watchdog

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-046`.

---

## 1. OVERVIEW

Adds an opt-in fan-out stall watchdog that aborts and requeues lineages when pending lag crosses a configured ceiling.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Fan-out stall watchdog behaves as documented and remains aligned with its implementation and tests.
- Layer partition: fan-out runtime.
- Real user request: `Validate Fan-out stall watchdog and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: No-op default behavior, lag-ceiling event emission, abort-and-requeue handling, and required positive threshold validation.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/09--fanout/fanout-stall-watchdog.md`.

### Steps

1. Inspect `scripts/fanout-pool.cjs` for the implementation contract.
2. Inspect `tests/unit/fanout-pool.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Fan-out stall watchdog matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-pool.cjs` | fanout stall watchdog. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-pool.vitest.ts` | Primary regression coverage for Fan-out stall watchdog. |

---

## 5. SOURCE_METADATA

- Group: Fan-out
- Playbook ID: DLR-046
- Feature catalog entry: `feature_catalog/09--fanout/fanout-stall-watchdog.md`
- Scenario file path: `manual_testing_playbook/09--fanout/fanout-stall-watchdog.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/017-fanout-stall-watchdog`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
