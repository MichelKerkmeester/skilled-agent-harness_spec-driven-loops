---
title: "DLR-039 -- Fixed-rate overrun accounting"
description: "Manual validation scenario for Fixed-rate overrun accounting in the runtime/ skill."
version: 1.4.0.15
---

# DLR-039 -- Fixed-rate overrun accounting

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-039`.

---

## 1. OVERVIEW

Records fixed-rate scheduling overruns without replaying missed slots or violating single-flight dispatch semantics.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Fixed-rate overrun accounting behaves as documented and remains aligned with its implementation and tests.
- Layer partition: fan-out runtime.
- Real user request: `Validate Fixed-rate overrun accounting and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Fast-slot zero skip, overrun skip count, slot duration persistence, and no catch-up dispatch behavior.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/09--fanout/fixed-rate-overrun-accounting.md`.

### Steps

1. Inspect `scripts/fanout-run.cjs` for the implementation contract.
2. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` for the implementation contract.
3. Inspect `tests/unit/fanout-run.vitest.ts` for the matching regression coverage.
4. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
5. Capture the source lines and EXIT 0 test command output that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Fixed-rate overrun accounting matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `scripts/fanout-run.cjs` | fixed-rate overrun accounting. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | fixed-rate overrun accounting. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | Primary regression coverage for Fixed-rate overrun accounting. |

---

## 5. SOURCE_METADATA

- Group: Fan-out
- Playbook ID: DLR-039
- Feature catalog entry: `feature_catalog/09--fanout/fixed-rate-overrun-accounting.md`
- Scenario file path: `manual_testing_playbook/09--fanout/fixed-rate-overrun-accounting.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//010-fixed-rate-overrun-accounting`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
