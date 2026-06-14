# Deep Review Dashboard

## Status

- Provisional verdict: CONDITIONAL
- Release readiness: in-progress
- Stop reason: maxIterationsReached
- hasAdvisories: false

## Findings Summary

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 3 | +3 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|--------------------|--------|
| 001 | correctness | correctness | 1.0000 | complete |
| 002 | security | security, maintainability | 0.5000 | complete |
| 003 | traceability | traceability, maintainability | 0.3333 | complete |

## Coverage

- Dimensions complete: 4 / 4.
- Core traceability: partial.
- Resource-map coverage: not applicable because parent `resource-map.md` is absent.

## Trend

- Last 3 ratios: 1.0000 -> 0.5000 -> 0.3333.
- Trend: descending, but max iterations reached before clean convergence because active P1 findings remain.

## Active Risks

- F001: BM25 advisor shadow feature not connected to production scoring output.
- F002: `code_graph_query(includeTrace)` not exposed through the validating public schema.
- F003: parent phase metadata contradicts child completion state.
- Code graph structural context was stale during review; Grep/Read evidence was used for cited findings.
