---
title: "Fan-out review strongest-restriction verdict"
description: "Validate that clean lineage A + P0 lineage B → mergedVerdict=FAIL bound to p0_count=1 fed into step_derive_verdict → review-report verdict=FAIL. Verify all 5 verdict combinations."
version: 1.11.0.2
---

# DRV-065 -- Fan-out review strongest-restriction verdict

This document captures the validation contract, execution flow, and metadata for `DRV-065`.

---

## 1. OVERVIEW

Validates that the strongest-restriction merge policy correctly derives all verdict
combinations and that the merged counts feed `step_derive_verdict` correctly.

### Why This Matters

This is the policy contract that makes fan-out safe for review: a P0 finding cannot be
diluted by a clean lineage. If the severity escalation or the `activeP0` count is wrong, a
blocking issue in any lineage disappears from the final verdict.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `mergeReviewRegistries` strongest-restriction: clean A + P0 B → FAIL; P1-only → CONDITIONAL; all clean → PASS; duplicate findingId escalates to highest severity; non-active excluded.
- Real user request: `Validate the review fan-out strongest-restriction policy and confirm all 5 review unit tests pass covering every verdict combination and the duplicate escalation rule.`
- Expected signals: `SEVERITY_RANK` map (`{P0:3, P1:2, P2:1}`) in `fanout-merge.cjs`; `status !== 'active'` guard; `mergedVerdict=FAIL` when `activeP0>0`; `mergedVerdict=CONDITIONAL` when `activeP1>0` only; `mergedVerdict=PASS` when all empty; duplicate `findingId` with P2+P0 escalates to P0 and produces single finding.
- Pass/fail: PASS if all 5 review tests pass and source inspection confirms the policy; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `scripts/fanout-merge.cjs` present.

### Steps

1. Inspect `scripts/fanout-merge.cjs` `mergeReviewRegistries` — confirm `SEVERITY_RANK` constant, `finding.status !== 'active'` filter, `mergedVerdict` derivation.
2. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/fanout-merge.vitest.ts --reporter=verbose`
3. Identify the 5 review tests: `merges FAIL when lineage A is clean but lineage B has active P0`, `merges PASS when all clean`, `merges CONDITIONAL when P1 exists but no P0`, `escalates to highest severity for duplicate findingId`, `skips non-active findings`.
4. Confirm all 5 pass.

### RECOMMENDED ORCHESTRATION PROCESS

1. Inspect the source policy first (SEVERITY_RANK, status guard).
2. Run tests and match each test name to its verdict combination.
3. Verify the `activeP0` count flow: merge → `bind_from_output` → `step_derive_verdict`.

### Expected Outcome

5/5 review tests pass. SEVERITY_RANK correctly escalates duplicates. Non-active findings excluded. mergedVerdict correct for all combinations.

### Failure Modes

- `SEVERITY_RANK` missing: all duplicates keep first-seen severity regardless of lineage ordering.
- `status !== 'active'` guard missing: `resolved_false_positive` findings inflate `activeP0`.
- `mergedVerdict` derivation inverted: P1-only → FAIL instead of CONDITIONAL.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | `mergeReviewRegistries`, `SEVERITY_RANK`, `mergedVerdict` derivation |

### Validation

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | 5 review strongest-restriction tests |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/fanout/fanout-strongest-restriction.md`
- Expected verdict mode: GREEN when all 5 review tests pass and source anchors agree
- Wall-time estimate: 5-10 min
