# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Iterations completed | 1 / 1 (maxIterations) |
| Verdict | **PASS** |
| Release Readiness | in-progress |
| Stop reason | maxIterations reached |

## Severity Counts

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 0 |
| P2 | 2 |

## Dimension Coverage

| Dimension | Status | Iteration |
|-----------|--------|-----------|
| Correctness | covered | 1 |
| Security | not covered | - |
| Traceability | not covered | - |
| Maintainability | not covered | - |

## Findings

| ID | Severity | Category | File | Summary |
|----|----------|----------|------|---------|
| P2-001 | P2 | correctness | maintenance-marker.ts:60 | activeLabels accumulates duplicate entries |
| P2-002 | P2 | correctness | maintenance-marker.ts:73 | Label removal precedes activeCount decrement |
