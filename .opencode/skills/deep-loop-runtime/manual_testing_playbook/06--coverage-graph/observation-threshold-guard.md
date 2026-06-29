---
title: "DLR-041 -- Observation-threshold guard"
description: "Manual validation scenario for Observation-threshold guard in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-041 -- Observation-threshold guard

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-041`.

---

## 1. OVERVIEW

Adds a default-off minimum-observations guard that blocks stop or promotion decisions until leading evidence repeats enough times.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Observation-threshold guard behaves as documented and remains aligned with its implementation and tests.
- Layer partition: coverage graph runtime.
- Real user request: `Validate Observation-threshold guard and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Default-off parity, configured threshold parsing, sub-threshold STOP blocking, and passing-threshold evidence coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/06--coverage-graph/observation-threshold-guard.md`.

### Steps

1. Inspect `lib/coverage-graph/coverage-graph-signals.ts` for the implementation contract.
2. Inspect `scripts/convergence.cjs` for the implementation contract.
3. Inspect `tests/integration/convergence-script.vitest.ts` for the matching regression coverage.
4. Inspect `tests/unit/convergence-score-delta.vitest.ts` for the matching regression coverage.
5. Inspect `tests/unit/coverage-graph-signals.vitest.ts` for the matching regression coverage.
6. Run or inspect the matching test assertions for this feature.
7. Capture the source lines, command output, or test assertions that prove the expected signals.
8. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Observation-threshold guard matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/coverage-graph/coverage-graph-signals.ts` | observation-threshold guard. |
| `scripts/convergence.cjs` | observation-threshold guard. |

### Validation

| File | Role |
|---|---|
| `tests/integration/convergence-script.vitest.ts` | Primary regression coverage for Observation-threshold guard. |
| `tests/unit/convergence-score-delta.vitest.ts` | Primary regression coverage for Observation-threshold guard. |
| `tests/unit/coverage-graph-signals.vitest.ts` | Primary regression coverage for Observation-threshold guard. |

---

## 5. SOURCE_METADATA

- Group: Coverage graph
- Playbook ID: DLR-041
- Feature catalog entry: `feature_catalog/06--coverage-graph/observation-threshold-guard.md`
- Scenario file path: `manual_testing_playbook/06--coverage-graph/observation-threshold-guard.md`
- Source phase: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/012-observation-threshold-guard`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
