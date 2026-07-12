---
title: "DLR-042 -- Coverage-graph time decay"
description: "Manual validation scenario for Coverage-graph time decay in the runtime/ skill."
version: 1.4.0.15
---

# DLR-042 -- Coverage-graph time decay

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-042`.

---

## 1. OVERVIEW

Adds optional time-decay weighting to coverage-graph signal ranking while preserving raw historical coverage counts.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Coverage-graph time decay behaves as documented and remains aligned with its implementation and tests.
- Layer partition: coverage graph runtime.
- Real user request: `Validate Coverage-graph time decay and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: No-decay full weight, half-life decay math, ranking integration, and convergence parity coverage.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/coverage_graph/coverage_graph_time_decay.md`.

### Steps

1. Inspect `lib/coverage-graph/coverage-graph-signals.ts` for the implementation contract.
2. Inspect `tests/unit/coverage-graph-signals.vitest.ts` for the matching regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Coverage-graph time decay matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/coverage-graph/coverage-graph-signals.ts` | coverage-graph time decay. |

### Validation

| File | Role |
|---|---|
| `tests/unit/coverage-graph-signals.vitest.ts` | Primary regression coverage for Coverage-graph time decay. |

---

## 5. SOURCE_METADATA

- Group: Coverage graph
- Playbook ID: DLR-042
- Feature catalog entry: `feature_catalog/coverage_graph/coverage_graph_time_decay.md`
- Scenario file path: `manual_testing_playbook/coverage_graph/coverage_graph_time_decay.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//013-coverage-graph-time-decay`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
