---
title: "DRV-060 -- Reducer search-debt registry + dashboard + report persistence"
description: "Verify reducer registry exposes candidateCoverage / searchDebt / ruledOutCandidates / cleanSearchProof / searchCoverage. Dashboard renders ## Search Debt. Report renders ## Search Ledger."
version: 1.11.0.7
---

# DRV-060 -- Reducer search-debt registry + dashboard + report persistence

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-060`.

## 1. OVERVIEW

Exercise reducer-owned persistence of search-coverage state. A v2 review session with deferred ledger rows must produce a reducer registry that EXPOSES the new fields, a dashboard that surfaces `## Search Debt`, and a final report that includes `## Search Ledger` before the appendix. Without this end-to-end surface, validator-level contract enforcement is invisible to operators reading review output.

### Why This Matters

A v2 record may validate cleanly and still hide deferred or blocked candidate-search obligations from the operator. The reducer/dashboard/report chain is where "what was searched, what is still owed" becomes durable across review iterations.

## 2. SCENARIO CONTRACT

- Objective: Confirm reducer registry exposes `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage`. Dashboard surfaces `## Search Debt`. Report surfaces `## Search Ledger`.
- Layer partition: reducer (`reduce-state.cjs`) + dashboard + report compiler.
- Real user request: `Run the synthetic two-iteration v2 reducer fixture with deferred ledger rows and confirm registry exposure + dashboard Search Debt + report Search Ledger.`
- Expected signals: reducer registry JSON contains all five new fields. Dashboard markdown contains `## Search Debt`. Report markdown contains `## Search Ledger` before the appendix.
- Pass/fail: PASS if registry exposure + dashboard section + report section all present. FAIL if any of the three surfaces is missing or empty when the source session has deferred ledger rows.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-reducer.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- A synthetic two-iteration session is available that includes deferred candidates in `searchLedger`.
- Reducer output paths (registry, dashboard, report) are observable.

### Steps

1. Prepare a synthetic two-iteration session with at least one `searchLedger` row using `disposition: 'deferred'` and populated `searchCoverage.deferred`.
2. Run the reducer path used by `review-depth-reducer.vitest.ts`.
3. Inspect the reducer registry output for `candidateCoverage`.
4. Inspect the same output for non-empty `searchDebt`.
5. Confirm `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage` persist after reduction.
6. Inspect the dashboard for the `## Search Debt` section.
7. Inspect the final report output for the `## Search Ledger` section before appendix material.

### Expected Outcome

The reducer preserves `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`. The dashboard renders `## Search Debt`. The report renders `## Search Ledger`.

### Failure Modes

- Registry fields are empty: confirm the source session used v2 fields and at least one deferred `searchLedger` row.
- Dashboard lacks `## Search Debt`: rerun reduction and inspect generated output rather than stale files.
- Report lacks `## Search Ledger`: confirm the report path consumed the reducer registry after the synthetic session.

## 4. SOURCE REFERENCES

- Reducer: `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs` (registry return shape + dashboard verdict + active-risks rendering).
- Report compiler: `.opencode/commands/deep/assets/deep_review_auto.yaml` (Search Ledger section in report-output step).
- Fixture: `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts`.
- ADR: complexity-search-ledger-persistence decision record (see this skill's changelog for provenance).

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-060
- Layer partition: reducer + dashboard + report
- Expected verdict mode: GREEN
- Sourcing methodology: review-depth v2 rollout
- Preflight: documented in the review-depth v2 rollout phase-map
- Wall-time estimate: ~10 min
