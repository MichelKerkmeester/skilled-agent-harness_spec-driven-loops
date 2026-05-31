---
title: "DLR-003 -- Fallback router"
description: "Manual validation scenario for Fallback router in the deep-loop-runtime skill."
---

# DLR-003 -- Fallback router

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-003`.

---

## 1. OVERVIEW

Resolves the fallback route when a model exhausts its quota pool. Returns fallback (to a configured target in a different pool) or fail-fast based on the model registry.

### Why This Matters

This feature is a shared runtime primitive. If it drifts, both deep-review and deep-research inherit inconsistent loop behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm fallback router behaves as documented and remains aligned with its implementation and tests.
- Layer partition: executor runtime.
- Real user request: `Validate Fallback router and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Runtime behavior matches the source contract and primary regression test.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/01--executor/003-fallback-router.md`.

### Steps

1. Inspect `lib/deep-loop/fallback-router.ts` for the implementation contract.
2. Inspect `tests/unit/fallback-router.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Fallback router matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/fallback-router.ts` | Model registry lookup, fallback target selection, disabled fallback, and fail-fast reasons. |

### Validation

| File | Role |
|---|---|
| `tests/unit/fallback-router.vitest.ts` | Primary regression coverage for Fallback router. |

---

## 5. SOURCE_METADATA

- Group: Executor
- Playbook ID: DLR-003
- Feature catalog entry: `feature_catalog/01--executor/003-fallback-router.md`
- Scenario file path: `manual_testing_playbook/01--executor/003-fallback-router.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

