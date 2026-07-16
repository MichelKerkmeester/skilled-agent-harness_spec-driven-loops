# Deep Review Dashboard - codex-5

## Status

- Verdict: FAIL
- Release readiness: release-blocking
- Stop reason: maxIterationsReached
- Iterations: 7 / 7
- hasAdvisories: true

## Findings Summary

| Severity | Active | New In Final Iteration |
|----------|--------|------------------------|
| P0 | 2 | 0 |
| P1 | 1 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Iteration | Focus | Ratio | P0 | P1 | P2 | Status |
|-----------|-------|-------|----|----|----|--------|
| 1 | correctness | 0.45 | 0 | 1 | 0 | complete |
| 2 | security | 0.67 | 1 | 1 | 0 | complete |
| 3 | security | 0.50 | 2 | 1 | 0 | complete |
| 4 | traceability | 0.04 | 2 | 1 | 1 | complete |
| 5 | maintainability | 0.00 | 2 | 1 | 1 | complete |
| 6 | stabilization | 0.00 | 2 | 1 | 1 | complete |
| 7 | final replay | 0.00 | 2 | 1 | 1 | complete |

## Coverage

| Area | Status |
|------|--------|
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| spec_code | fail |
| checklist_evidence | pass |
| feature_catalog_code | partial |
| playbook_capability | partial |

## Trend

Last three ratios: 0.00 -> 0.00 -> 0.00.

The finding set stabilized, but legal stop was blocked by active P0s. Max iteration synthesis produced FAIL.

## Active Risks

- F002: `memory_search` community fallback can bypass governed scope.
- F003: causal graph tools use bare IDs without scope authorization.
- F001: causal edge writers can create wrong-target or orphan edges.
- F004: `memory_causal_stats` public/runtime schema drift.

## Blocked Stops

| Run | Blocked By | Recovery |
|-----|------------|----------|
| 5 | p0ResolutionGate | Replay active P0/P1 evidence and synthesize FAIL if max iterations are reached without remediation. |
| 6 | p0ResolutionGate | No legal PASS/CONDITIONAL stop while active P0s remain; continue to max-iteration synthesis. |

## Graphless Fallback

Code Graph was unavailable. The lineage used direct reads, exact `rg` searches, and producer/consumer trace checks for fallback coverage.
