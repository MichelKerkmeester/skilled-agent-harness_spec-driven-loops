# Review-Depth v2 Manual Testing Scenarios

This root set covers the Phase H review-depth manual scenarios added after Phases 002-007 shipped the v2 contract. The existing category folders remain the broad `deep-review` playbook; these six files focus only on the review-depth rollout.

## Scenario Index

| Scenario | Focus | Primary Artifacts |
|----------|-------|-------------------|
| `scenario-01-validator-warn-rollout.md` | Warn-mode rollout and legacy advisory | `DEEP_REVIEW_V2_ENFORCEMENT`, `legacy_unversioned_record`, `review-depth-validator.vitest.ts` |
| `scenario-02-validator-strict-v2.md` | Strict v2 validator failures | `DEEP_REVIEW_V2_ENFORCEMENT`, `v2_missing_ledger`, `v2_uncited_ledger_row`, `v2_broken_linked_finding`, `v2_shallow_finding_details`, `state_delta_iteration_mismatch` |
| `scenario-03-reducer-search-debt.md` | Search-debt persistence and operator surfaces | `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, `searchCoverage`, `## Search Debt`, `## Search Ledger` |
| `scenario-04-stop-gate-candidate.md` | Candidate coverage STOP blocker | `candidateCoverageGate`, `candidateCoverage`, `searchDebt` |
| `scenario-05-stop-gate-graphless-fallback.md` | Graphless fallback STOP blocker | `graphlessFallbackGate`, `graphCoverageMode`, `graphless_fallback`, `searchLedger` |
| `scenario-06-graph-vocabulary.md` | Review graph node vocabulary persistence | `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST` |

## Manual Run Pattern

1. Start from a clean local checkout with the Phase B fixture files available under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
2. Read the scenario file first, then run the listed local fixture or synthetic-session steps.
3. Capture the exact command output and the artifact excerpts named in the scenario.
4. Mark the scenario PASS only when the Expected Outcome is directly observable.
5. Mark the scenario FAIL when any named code, gate, field, or section is absent.

## Suggested Automated Anchors

Use these fixture files as the automated anchors while executing the manual scenarios:

- `review-depth-validator.vitest.ts`
- `review-depth-reducer.vitest.ts`
- `review-depth-convergence.vitest.ts`
- `review-depth-graph.vitest.ts`

The scenarios intentionally do not change iteration defaults. Default calibration is deferred until production data proves the v2 gates' search-depth behavior.
