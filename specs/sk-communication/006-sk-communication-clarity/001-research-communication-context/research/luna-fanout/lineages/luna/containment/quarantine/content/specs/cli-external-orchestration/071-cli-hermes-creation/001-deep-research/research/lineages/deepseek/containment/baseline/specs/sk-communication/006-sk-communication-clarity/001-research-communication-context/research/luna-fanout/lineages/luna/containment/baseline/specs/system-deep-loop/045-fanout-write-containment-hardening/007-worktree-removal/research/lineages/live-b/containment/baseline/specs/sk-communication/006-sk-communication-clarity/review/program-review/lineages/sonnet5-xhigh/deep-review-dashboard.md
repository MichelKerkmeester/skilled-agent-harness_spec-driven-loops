# Deep Review Dashboard — lineage sonnet5-xhigh (auto-generated, do not edit)

## Status

Final verdict: **CONDITIONAL** (hasAdvisories=true) | 5 of 5 iterations complete | stopReason: maxIterationsReached

## Findings Summary

| Severity | Active | Delta (iter 5) |
|----------|--------|-----------------|
| P0 | 0 | +0 |
| P1 | 2 | +0 |
| P2 | 4 | +0 |

## Progress Table

| Run | Status | Focus | Dimensions | newFindingsRatio | Duration |
|-----|--------|-------|------------|-------------------|----------|
| 1 | complete | correctness: engine (004) + repo-rules split (003) | correctness | 0.15 | ~15 min |
| 2 | complete | security: CLI dispatch trust boundary + benchmark harness | security | 0.00 | ~10 min |
| 3 | complete | traceability: goal.md checklist vs child acceptance criteria | traceability | 0.55 | ~15 min |
| 4 | complete | maintainability: comment hygiene, test coverage, playbook/catalog parity | maintainability | 0.45 | ~15 min |
| 5 | complete | broaden: remaining children (007, 009, 005) across all dimensions | correctness, traceability | 0.00 | ~15 min |

## Coverage

- Dimensions complete: 4/4 (correctness, security, traceability, maintainability), all required
- Files reviewed: 38 (cumulative, deduplicated)
- Traceability: core `spec_code` pass, `checklist_evidence` FAIL (F003, adjudicated); overlay `feature_catalog_code` pass, `playbook_capability` FAIL (F006)

## Trend

newFindingsRatio across 5 iterations: 0.15, 0.00, 0.55, 0.45, 0.00 — mean 0.23. Both spikes (iter 3, iter 4) came from broadening into a new dimension, not from re-treading ground; iteration 5's return to 0.00 reflects independent confirmation of existing claims rather than exhaustion.

## Active Risks

- 2 active P1s: F003 (goal.md completion checklist contradicts its own LOG table) and F005 (new safety-relevant fidelity veto ships with zero test coverage). Both are fully adjudicated (claim-adjudication packets recorded in iterations 3 and 4). CONDITIONAL verdict stands until the operator resolves or explicitly waives them. Stuck count: 0. No pause sentinel triggered.
