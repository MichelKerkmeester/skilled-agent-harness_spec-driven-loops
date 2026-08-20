---
title: "Rollback-gate shared strict validator adoption"
description: "Deep-research and deep-review rollback mode gates consume the shared strict validator (hasExactKeys, validateRows) instead of a hand-copied helper, and split row structural validity from success/authentication selection so malformed evidence rejects the set instead of being silently filtered."
trigger_phrases:
  - "rollback-gate shared strict validator adoption"
  - "rollback-gate-shared-strict-validator"
  - "rollback gate strict validator runtime"
  - "validation rollback-gate shared strict validator"
version: 1.4.0.15
---

# Rollback-gate shared strict validator adoption

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Deep-research and deep-review rollback mode gates stopped carrying their own hand-copied `hasExactKeys` helper and now consume the shared strict validator (`hasExactKeys`, `validateRows`) exported from `lib/mode-contracts/index.js`.

This feature belongs to the validation group and is catalogued as F051 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Both gates import `hasExactKeys` and `validateRows` from `../mode-contracts/index.js` (backed by `lib/mode-contracts/strict-gate-validator.ts`) in place of a local `hasExactKeys` reimplementation; neither `mode-gate.ts` file defines its own copy anymore. `hasExactKeys` still gates the top-level gate input shape (`GATE_INPUT_KEYS`) and the version-binding shape (`VERSION_BINDING_KEYS`).

Inside `evaluateDeepReviewRollbackWindow` and `evaluateDeepResearchRollbackWindow`, one row predicate used to do three jobs at once: structural row validity, success selection, and (review gate only) authenticated-membership. It merely filtered rows, so a malformed row was silently dropped instead of rejecting the evidence set. The predicate is now split into two passes:

- **Structural validity** — `validateRows(input.executions, ...)` checks that `executionId` is a token, `authorityEpoch` is a positive safe integer, `certificateDigest` matches the sha256 digest shape, and `authorityState` / `result` are members of the declared unions (`ROLLBACK_WINDOW_AUTHORITY_STATES`, `ROLLBACK_WINDOW_EXECUTION_RESULTS`). Any row that fails throws `TypeError('Rollback window input is malformed')`, rejecting the whole evidence set.
- **Selection and counting** — a separate `.filter(...)` keeps `authorityState === 'new_authoritative_reversible' && result === 'trusted-completion'` (plus, on the review gate only, membership in `authenticatedExecutionKeys`). Semantics are unchanged from before the split: a legitimately incomplete, abstained, or unauthenticated row is excluded from the successful-execution count rather than rejecting the set.

The review gate's authentication check compares each candidate row's digest against `authenticatedExecutionKeys`, a set built from `input.authenticatedExecutions`; the research gate has no equivalent authentication input and skips that clause.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-review-rollback-gate/mode-gate.ts` | Runtime | `evaluateDeepReviewRollbackWindow` structural-validity/selection split, consumes shared `hasExactKeys`/`validateRows`. |
| `lib/deep-research-rollback-gate/mode-gate.ts` | Runtime | `evaluateDeepResearchRollbackWindow` structural-validity/selection split, consumes shared `hasExactKeys`/`validateRows`. |
| `lib/mode-contracts/strict-gate-validator.ts` | Runtime | Shared `hasExactKeys` and `validateRows` exports consumed by both rollback gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/deep-review-rollback-gate.vitest.ts` | Test | 86 tests, including "rejects the evidence set when a rollback row violates its declared type" and "rejects an out-of-contract result while still counting legitimate unsuccessful rows". |
| `tests/unit/deep-research-rollback-gate.vitest.ts` | Test | 81 tests, including "rejects the evidence set when a rollback row violates its declared type" and "rejects an out-of-contract result while still counting legitimate unsuccessful rows". |

---

## 4. SOURCE METADATA

- Group: Validation
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F051
- Feature file path: `validation/rollback-gate-shared-strict-validator.md`
- Primary sources: `lib/deep-review-rollback-gate/mode-gate.ts`, `lib/deep-research-rollback-gate/mode-gate.ts`, `lib/mode-contracts/strict-gate-validator.ts`

Related references:
- [validation](../validation/) — Validation category
