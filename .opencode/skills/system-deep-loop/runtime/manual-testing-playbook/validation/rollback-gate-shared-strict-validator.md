---
title: "DLR-053 -- Rollback-gate shared strict validator adoption"
description: "Manual validation scenario for Rollback-gate shared strict validator adoption in the runtime/ skill."
version: 1.4.0.15
---

# DLR-053 -- Rollback-gate shared strict validator adoption

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-053`.

---

## 1. OVERVIEW

Deep-research and deep-review rollback mode gates stopped carrying their own hand-copied `hasExactKeys` helper and now consume the shared strict validator (`hasExactKeys`, `validateRows`) exported from `lib/mode-contracts/index.js`. Inside `evaluateDeepReviewRollbackWindow` / `evaluateDeepResearchRollbackWindow`, the row predicate that used to filter structural validity, success selection, and (review gate only) authentication membership together is split: structural validity now rejects the whole evidence set through `validateRows` on a malformed row, while success/authentication selection stays a `.filter(...)` with unchanged semantics.

### Why This Matters

A row that violates its declared type is malformed evidence and used to be silently dropped by a single filter, so the gate counted whatever survived. It now refuses the evidence set outright instead of quietly under-counting, while a well-formed row that is merely incomplete, abstained, or unauthenticated is still excluded from the count rather than rejecting the set.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Rollback-gate shared strict validator adoption behaves as documented and remains aligned with its implementation and tests.
- Layer partition: validation runtime.
- Real user request: `Validate Rollback-gate shared strict validator adoption and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: A rollback row that violates its declared type (bad token, non-positive/non-integer authority epoch, non-sha256 certificate digest, or an undeclared `authorityState`/`result`) rejects the whole evidence set with a `TypeError`; a well-formed but legitimately incomplete/abstained/unauthenticated row is excluded from the successful-execution count instead of rejecting the set; neither gate defines a local `hasExactKeys` anymore.
- Pass/fail: PASS only if both matching test commands exit 0 and source inspection confirms the documented structural-validity/selection split; FAIL if either test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/validation/rollback-gate-shared-strict-validator.md`.

### Steps

1. Inspect `lib/deep-review-rollback-gate/mode-gate.ts` and `lib/deep-research-rollback-gate/mode-gate.ts` for the `validateRows`/`.filter` split inside `evaluateDeepReviewRollbackWindow` / `evaluateDeepResearchRollbackWindow`.
2. Inspect `lib/mode-contracts/strict-gate-validator.ts` for the shared `hasExactKeys` and `validateRows` exports both gates import from `../mode-contracts/index.js`.
3. Run `./node_modules/.bin/vitest run --no-coverage tests/unit/deep-review-rollback-gate.vitest.ts` and require EXIT 0 (86 tests, including "rejects the evidence set when a rollback row violates its declared type" and "rejects an out-of-contract result while still counting legitimate unsuccessful rows").
4. Run `./node_modules/.bin/vitest run --no-coverage tests/unit/deep-research-rollback-gate.vitest.ts` and require EXIT 0 (81 tests, including the same two named negative tests). Budget ~15 min of wall time for this one: the `complete mode migration gate` and `externally authorized non-destructive rollback` cases each cost 12-19s, and a measured full run took 882s. It is slow, not hung — use `--reporter=verbose` to watch individual tests tick over.
5. Capture the source lines and both EXIT 0 test command outputs that prove the expected signals.
6. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Rollback-gate shared strict validator adoption matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Either `mode-gate.ts` file reintroduces a local `hasExactKeys` copy instead of importing the shared validator.
- The structural-validity/selection split collapses back into a single filter, so a malformed row is silently dropped instead of rejecting the evidence set.
- The named negative tests ("rejects the evidence set when a rollback row violates its declared type", "rejects an out-of-contract result while still counting legitimate unsuccessful rows") are removed, renamed, or no longer exercise the described behavior.
- Matching test coverage is missing or contradicts the documented behavior.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/deep-review-rollback-gate/mode-gate.ts` | `evaluateDeepReviewRollbackWindow` structural-validity/selection split, consumes shared `hasExactKeys`/`validateRows`. |
| `lib/deep-research-rollback-gate/mode-gate.ts` | `evaluateDeepResearchRollbackWindow` structural-validity/selection split, consumes shared `hasExactKeys`/`validateRows`. |
| `lib/mode-contracts/strict-gate-validator.ts` | Shared `hasExactKeys` and `validateRows` exports consumed by both rollback gates. |

### Validation

| File | Role |
|---|---|
| `tests/unit/deep-review-rollback-gate.vitest.ts` | 86 tests, primary regression coverage for the review gate's structural-validity/selection split. |
| `tests/unit/deep-research-rollback-gate.vitest.ts` | 81 tests, primary regression coverage for the research gate's structural-validity/selection split. |

---

## 5. SOURCE_METADATA

- Group: Validation
- Playbook ID: DLR-053
- Feature catalog entry: `feature-catalog/validation/rollback-gate-shared-strict-validator.md`
- Scenario file path: `manual-testing-playbook/validation/rollback-gate-shared-strict-validator.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 15-20 min (the research-gate suite alone measured 882s under load)
