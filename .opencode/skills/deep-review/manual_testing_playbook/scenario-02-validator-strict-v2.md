# Scenario 2 — Validator Strict v2

## Purpose
Exercise Phase 004 strict v2 validator failure codes against malformed explicit v2 records.

## Prerequisites
- `review-depth-validator.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- The local environment can set `DEEP_REVIEW_V2_ENFORCEMENT=strict`.
- Malformed v2 records can be selected or constructed with `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger`.

## Steps
1. Set `DEEP_REVIEW_V2_ENFORCEMENT=strict`.
2. Run the validator fixture that exercises explicit v2 records.
3. Verify a record with no `searchLedger` fails with `v2_missing_ledger`.
4. Verify a row without cited evidence fails with `v2_uncited_ledger_row`.
5. Verify a finding row without a valid linked finding fails with `v2_broken_linked_finding`.
6. Verify a finding with insufficient detail fails with `v2_shallow_finding_details`.
7. Verify mismatched state and delta iteration identity fails with `state_delta_iteration_mismatch`.

## Expected Outcome
Under `DEEP_REVIEW_V2_ENFORCEMENT=strict`, the validator fixture exposes all five v2 failure codes: `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, and `state_delta_iteration_mismatch`.

## Failure Modes
- A code is missing: confirm the malformed record targets that exact failure condition.
- Legacy warnings appear instead: confirm the record includes `reviewDepthSchemaVersion`.
- The fixture passes unexpectedly: inspect whether `DEEP_REVIEW_V2_ENFORCEMENT` is still `warn` or `off`.
