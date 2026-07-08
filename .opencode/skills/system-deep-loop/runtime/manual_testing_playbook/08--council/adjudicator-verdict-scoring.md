---
title: "DLR-020 -- Adjudicator verdict scoring"
description: "Manual validation scenario for Adjudicator verdict scoring in the runtime/ skill."
version: 1.4.0.4
---

# DLR-020 -- Adjudicator verdict scoring

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-020`.

---

## 1. OVERVIEW

Scores Round-N to Round-N+1 adjudicator verdict deltas using ADR-003 weights for option change, confidence delta, material-risk Jaccard delta, axis flip rate, and blocking-disagreement delta.

### Why This Matters

This is the council convergence saturation primitive. If the weights drift from ADR-003, council loops can stop too early (missed disagreements) or too late (wasted rounds).

---

## 2. SCENARIO CONTRACT

- Objective: Confirm adjudicator verdict scoring behaves as documented and remains aligned with its implementation and tests.
- Layer partition: council convergence math.
- Real user request: `Validate Adjudicator verdict scoring and report whether the current source weights, score range, and tests agree with the runtime/ contract.`
- Expected signals: 5-component weighted scoring with ADR-003 weights; output in [0,1]; consumed by council convergence check.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/08--council/adjudicator-verdict-scoring.md`.

### Steps

1. Inspect `lib/council/adjudicator-verdict-scoring.cjs` for the implementation contract and weights.
2. Inspect `tests/council/adjudicator-verdict-scoring.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Adjudicator verdict scoring matches the documented current reality, the weights agree with ADR-003, and validation evidence is reproducible.

### Failure Modes

- Weight values drift from ADR-003 without corresponding ADR amendment.
- Output range escapes [0,1].
- A component is dropped or added without catalog/playbook update.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/council/adjudicator-verdict-scoring.cjs` | 5-component weighted delta scorer for adjudicator verdict round-over-round stability. |

### Validation

| File | Role |
|---|---|
| `tests/council/adjudicator-verdict-scoring.vitest.ts` | Primary regression coverage for Adjudicator verdict scoring. |

---

## 5. SOURCE_METADATA

- Group: Council
- Playbook ID: DLR-020
- Feature catalog entry: `feature_catalog/08--council/adjudicator-verdict-scoring.md`
- Scenario file path: `manual_testing_playbook/08--council/adjudicator-verdict-scoring.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
