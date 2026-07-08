---
title: "DLR-040 -- Convergence score-delta"
description: "Manual validation scenario for Convergence score-delta in the runtime/ skill."
version: 1.4.0.15
---

# DLR-040 -- Convergence score-delta

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-040`.

---

## 1. OVERVIEW

Adds a convergence score-delta signal comparing the current graph score with the prior snapshot.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Convergence score-delta behaves as documented and remains aligned with its implementation and tests.
- Layer partition: scoring runtime.
- Real user request: `Validate Convergence score-delta and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: First-iteration null delta, prior-snapshot delta, graph output bindings, and improvement-effect trace coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/05--scoring/convergence-score-delta.md`.

### Steps

1. Inspect `scripts/convergence.cjs` for the implementation contract.
2. Inspect `tests/integration/convergence-script.vitest.ts` for the matching regression coverage.
3. Inspect `tests/unit/convergence-score-delta.vitest.ts` for the matching regression coverage.
4. Run or inspect the matching test assertions for this feature.
5. Capture the source lines, command output, or test assertions that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Convergence score-delta matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `scripts/convergence.cjs` | convergence score-delta signal. |

### Validation

| File | Role |
|---|---|
| `tests/integration/convergence-script.vitest.ts` | Primary regression coverage for Convergence score-delta. |
| `tests/unit/convergence-score-delta.vitest.ts` | Primary regression coverage for Convergence score-delta. |

---

## 5. SOURCE_METADATA

- Group: Scoring
- Playbook ID: DLR-040
- Feature catalog entry: `feature_catalog/05--scoring/convergence-score-delta.md`
- Scenario file path: `manual_testing_playbook/05--scoring/convergence-score-delta.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//011-convergence-score-delta`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
