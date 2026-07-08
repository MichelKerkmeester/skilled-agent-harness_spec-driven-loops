---
title: "DLR-028 -- Fan-out merge: review strongest-restriction"
description: "Validate mergeReviewRegistries strongest-restriction: clean A + P0 B → FAIL; duplicate findingId escalates to highest severity; non-active findings excluded; P1-only → CONDITIONAL; all clean → PASS."
version: 1.4.0.4
---

# DLR-028 -- Fan-out merge: review strongest-restriction

This document captures the validation contract, execution flow, and metadata for `DLR-028`.

---

## 1. OVERVIEW

Validates the review-specific strongest-restriction merge logic in `fanout-merge.cjs`.

### Why This Matters

The strongest-restriction policy is what makes fan-out useful for review: if ANY lineage
found a P0, it must surface to the final verdict regardless of what other lineages found.
Without this, a clean lineage could dilute a blocking lineage's P0 finding.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `mergeReviewRegistries` applies strongest-restriction: any active P0 across any lineage → `mergedVerdict=FAIL`; duplicate findingId escalates to highest severity; non-active findings excluded; all clean → PASS; P1-only → CONDITIONAL.
- Layer partition: review merge.
- Real user request: `Validate the review fan-out strongest-restriction merge and confirm all 5 review unit tests pass, covering every verdict combination and the duplicate escalation rule.`
- Expected signals: clean+P0 → `mergedVerdict=FAIL`, `activeP0=1`; all clean → `mergedVerdict=PASS`, `activeP0=0`; P1-only → `mergedVerdict=CONDITIONAL`; duplicate `findingId` P2+P0 → escalates to P0 → FAIL, single deduplicated finding; `resolved_false_positive` excluded from `activeP0`.
- Pass/fail: PASS only if all 5 review tests pass with EXIT 0; FAIL if the test is not run, exits non-zero, any verdict combination is wrong, or a non-active finding inflates counts.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-merge.cjs` present.

### Steps

1. Inspect `scripts/fanout-merge.cjs` `mergeReviewRegistries` — confirm `SEVERITY_RANK` map (`{P0:3, P1:2, P2:1}`), `status !== 'active'` guard, `mergedVerdict` derivation formula.
2. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/fanout-merge.vitest.ts --reporter=verbose`
3. Confirm 5 review tests pass: `clean+P0→FAIL`, `all-clean→PASS`, `P1-only→CONDITIONAL`, `duplicate-escalates`, `non-active-excluded`.

### Expected Outcome

5/5 review tests pass. All verdict combinations correct. Duplicate findingId gets highest severity. Non-active (resolved, `resolved_false_positive`) findings excluded from active counts.

### Failure Modes

- SEVERITY_RANK missing: duplicate findingId keeps the first-seen severity instead of escalating.
- `status` guard missing: resolved findings inflate `activeP0` and produce false FAILs.
- `mergedVerdict` logic inverted: P1-only produces FAIL instead of CONDITIONAL.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-merge.cjs` | `mergeReviewRegistries`, `SEVERITY_RANK`, `mergedVerdict` derivation |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-merge.vitest.ts` | 5 review strongest-restriction tests (of 10 total) |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Playbook ID: DLR-028
- Feature catalog entry: `feature_catalog/09--fanout/fanout-merge.md`
- Scenario file path: `manual_testing_playbook/09--fanout/fanout-merge-review-strongest-restriction.md`
- Expected verdict mode: GREEN when all 5 review tests pass and source anchors agree
- Wall-time estimate: 5-10 min
