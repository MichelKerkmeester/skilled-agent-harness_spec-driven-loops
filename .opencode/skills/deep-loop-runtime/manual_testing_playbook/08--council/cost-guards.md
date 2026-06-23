---
title: "DLR-021 -- Cost guards"
description: "Manual validation scenario for Cost guards in the deep-loop-runtime skill."
version: 1.4.0.4
---

# DLR-021 -- Cost guards

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-021`.

---

## 1. OVERVIEW

Normalizes and enforces ADR-004 defaults for max_rounds_per_topic, max_topics_per_session, saturation_threshold, and seats_per_round; computes upper-bound seat-output budgets.

### Why This Matters

Cost guards bound council session cost a priori. If they drift, sessions can blow through wall-clock or token budgets without a safety stop.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm cost guards behave as documented and remain aligned with their implementation and tests.
- Layer partition: council cost discipline.
- Real user request: `Validate Cost guards and report whether the current default values, cap enforcement, and tests agree with the deep-loop-runtime contract.`
- Expected signals: ADR-004 defaults applied on session start; configs exceeding caps rejected; budget calculator matches the documented formula.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/08--council/cost-guards.md`.

### Steps

1. Inspect `lib/council/cost-guards.cjs` for the implementation contract and default values.
2. Inspect `tests/council/cost-guards.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Cost guards match the documented current reality, the defaults agree with ADR-004, and validation evidence is reproducible.

### Failure Modes

- Default values drift from ADR-004 without ADR amendment.
- Cap enforcement weakened or bypassed.
- Budget calculator formula changes without doc update.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/council/cost-guards.cjs` | ADR-004 default normalizer + cap enforcer + budget calculator. |

### Validation

| File | Role |
|---|---|
| `tests/council/cost-guards.vitest.ts` | Primary regression coverage for Cost guards. |

---

## 5. SOURCE_METADATA

- Group: Council
- Playbook ID: DLR-021
- Feature catalog entry: `feature_catalog/08--council/cost-guards.md`
- Scenario file path: `manual_testing_playbook/08--council/cost-guards.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
