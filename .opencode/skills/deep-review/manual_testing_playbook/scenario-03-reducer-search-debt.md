# Scenario 3 — Reducer Search Debt

## Purpose
Exercise Phase 005 reducer persistence and operator reporting for v2 search evidence.

## Prerequisites
- `review-depth-reducer.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- A synthetic two-iteration session can include deferred candidates in `searchLedger`.
- The session can emit `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`.

## Steps
1. Prepare a synthetic two-iteration session with at least one `searchLedger` row using disposition `deferred`.
2. Run the reducer fixture or reducer command path used by `review-depth-reducer.vitest.ts`.
3. Inspect the reducer registry output for `candidateCoverage`.
4. Inspect the same output for non-empty `searchDebt`.
5. Confirm `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage` persist after reduction.
6. Inspect the dashboard for the `## Search Debt` section.
7. Inspect the final report output for the `## Search Ledger` section before appendix material.

## Expected Outcome
The reducer preserves `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`; the dashboard renders `## Search Debt`; the report renders `## Search Ledger`.

## Failure Modes
- Registry fields are empty: confirm the source session used v2 fields and at least one deferred `searchLedger` row.
- Dashboard lacks `## Search Debt`: rerun reduction and inspect generated output rather than stale files.
- Report lacks `## Search Ledger`: confirm the report path consumed the reducer registry after the synthetic session.
