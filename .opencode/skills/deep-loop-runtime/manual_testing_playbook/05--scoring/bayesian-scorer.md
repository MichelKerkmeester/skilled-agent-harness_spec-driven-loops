---
title: "DLR-010 -- Bayesian scorer"
description: "Manual validation scenario for Bayesian scorer in the deep-loop-runtime skill."
---

# DLR-010 -- Bayesian scorer

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-010`.

---

## 1. OVERVIEW

Two primitives: computeScore returns a Bayesian success probability via Laplace smoothing (success+1)/(total+2); shouldDemote returns true when score<0.5 and totalCalls>=3.

### Why This Matters

This feature is a shared runtime primitive. If it drifts, both deep-review and deep-research inherit inconsistent loop behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm bayesian scorer behaves as documented and remains aligned with its implementation and tests.
- Layer partition: scoring runtime.
- Real user request: `Validate Bayesian scorer and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Runtime behavior matches the source contract and primary regression test.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/05--scoring/bayesian-scorer.md`.

### Steps

1. Inspect `lib/deep-loop/bayesian-scorer.ts` for the implementation contract.
2. Inspect `tests/unit/bayesian-scorer.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Bayesian scorer matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script or runtime output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/bayesian-scorer.ts` | Smoothed success scoring and demotion threshold checks. |

### Validation

| File | Role |
|---|---|
| `tests/unit/bayesian-scorer.vitest.ts` | Primary regression coverage for Bayesian scorer. |

---

## 5. SOURCE_METADATA

- Group: Scoring
- Playbook ID: DLR-010
- Feature catalog entry: `feature_catalog/05--scoring/bayesian-scorer.md`
- Scenario file path: `manual_testing_playbook/05--scoring/bayesian-scorer.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

