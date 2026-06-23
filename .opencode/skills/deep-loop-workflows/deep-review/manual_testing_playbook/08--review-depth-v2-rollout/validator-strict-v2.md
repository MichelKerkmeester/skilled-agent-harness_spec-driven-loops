---
title: "DRV-059 -- Validator strict v2 with all five failure codes"
description: "Verify DEEP_REVIEW_V2_ENFORCEMENT=strict triggers v2_missing_ledger, v2_uncited_ledger_row, v2_broken_linked_finding, v2_shallow_finding_details, and state_delta_iteration_mismatch on malformed v2 records."
version: 1.11.0.9
---

# DRV-059 -- Validator strict v2 with all five failure codes

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-059`.

## 1. OVERVIEW

Exercise the validator's hard-fail tier on explicit v2 records. With `DEEP_REVIEW_V2_ENFORCEMENT=strict`, malformed v2 iteration records (records that DO carry `reviewDepthSchemaVersion: 2`) must trip the appropriate failure code rather than passing or downgrading to advisory.

### Why This Matters

The strict tier is the contract enforcement that gives the v2 schema operational value. If a v2-tagged record passes when it lacks `searchLedger` (or any other obligation), agents cannot trust that "v2" means "auditable candidate generation."

## 2. SCENARIO CONTRACT

- Objective: Confirm validator emits all five v2 failure codes when malformed v2 records are present under `DEEP_REVIEW_V2_ENFORCEMENT=strict`.
- Layer partition: validator (`post-dispatch-validate.ts`).
- Real user request: `Run the validator fixture under DEEP_REVIEW_V2_ENFORCEMENT=strict and confirm all five v2 failure codes fire on the corresponding malformed records.`
- Expected signals: For each malformed input, validator result `ok: false` with `reason` matching one of `v2_missing_ledger | v2_uncited_ledger_row | v2_broken_linked_finding | v2_shallow_finding_details | state_delta_iteration_mismatch`.
- Pass/fail: PASS if every malformed input trips its expected failure code. FAIL if any code is missing OR `ok: true` is returned for any malformed input.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-validator.vitest.ts` exists under `.opencode/skills/deep-loop-runtime/tests/integration/`.
- Shell can set `DEEP_REVIEW_V2_ENFORCEMENT=strict`.
- Malformed v2 records can be selected or constructed with `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger`.

### Steps

1. Set `DEEP_REVIEW_V2_ENFORCEMENT=strict`.
2. Run the validator fixture that exercises explicit v2 records.
3. Verify a record with no `searchLedger` fails with `v2_missing_ledger`.
4. Verify a row with empty `searchActions[].evidenceRefs` fails with `v2_uncited_ledger_row`.
5. Verify a `disposition: 'finding'` row whose `linkedFindingId` does not appear in `findingDetails[]` fails with `v2_broken_linked_finding`.
6. Verify an active finding missing `scopeProof` AND `affectedSurfaceHints` fails with `v2_shallow_finding_details`.
7. Verify a mismatched state-log/delta iteration id fails with `state_delta_iteration_mismatch`.

### Expected Outcome

Under `DEEP_REVIEW_V2_ENFORCEMENT=strict`, all five v2 failure codes fire on their corresponding malformed records: `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, and `state_delta_iteration_mismatch`.

### Failure Modes

- A code is missing: confirm the malformed record targets that exact failure condition (e.g. for `v2_uncited_ledger_row`, the row's `searchActions[].evidenceRefs` must be empty, not just sparse).
- Legacy warnings appear instead of failure codes: confirm the record includes `reviewDepthSchemaVersion: 2`.
- The fixture passes unexpectedly: inspect whether `DEEP_REVIEW_V2_ENFORCEMENT` is still `warn` or `off`.

## 4. SOURCE REFERENCES

- Validator: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` (v2 strict checks branch + new failure-reason union members).
- Fixture: `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts`.
- Schema: `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_format.md` (`## Review Depth Schema (v2)`).

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-059
- Layer partition: validator
- Expected verdict mode: GREEN under DEEP_REVIEW_V2_ENFORCEMENT=strict
- Sourcing methodology: review-depth v2 rollout
- Preflight: documented in the review-depth v2 rollout phase-map
- Wall-time estimate: ~10 min
