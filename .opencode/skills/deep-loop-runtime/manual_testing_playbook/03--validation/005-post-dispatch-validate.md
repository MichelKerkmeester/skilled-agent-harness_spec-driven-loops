---
title: "DLR-005 -- Post-dispatch validate"
description: "Manual validation scenario for Post-dispatch validate in the deep-loop-runtime skill."
---

# DLR-005 -- Post-dispatch validate

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-005`.

## 1. OVERVIEW

Validates iteration artifacts after dispatch and appends degraded verification events when optional checks fail.

### Why This Matters

This feature is a shared runtime primitive. If it drifts, both deep-review and deep-research inherit inconsistent loop behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm post-dispatch validate behaves as documented and remains aligned with its implementation and tests.
- Layer partition: validation runtime.
- Real user request: `Validate Post-dispatch validate and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Runtime behavior matches the source contract and primary regression test.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/03--validation/01-post-dispatch-validate.md`.

### Steps

1. Inspect `lib/deep-loop/post-dispatch-validate.ts` for the implementation contract.
2. Inspect `tests/unit/post-dispatch-validate.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Post-dispatch validate matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/post-dispatch-validate.ts` | Iteration markdown, JSONL, delta validation, review-depth v2 enforcement, and verification confidence scoring. |

### Validation

| File | Role |
|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Primary regression coverage for Post-dispatch validate. |

---

## 5. SOURCE_METADATA

- Group: Validation
- Playbook ID: DLR-005
- Feature catalog entry: `feature_catalog/03--validation/01-post-dispatch-validate.md`
- Scenario file path: `manual_testing_playbook/03--validation/005-post-dispatch-validate.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

