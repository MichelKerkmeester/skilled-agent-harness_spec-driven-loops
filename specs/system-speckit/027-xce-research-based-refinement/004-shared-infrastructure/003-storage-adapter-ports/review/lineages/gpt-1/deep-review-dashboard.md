# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-gpt-1-1781144091708-itpir0` |
| Stop Reason | `maxIterationsReached` |
| Provisional Verdict | `CONDITIONAL` |
| Release Readiness | `in-progress` |
| hasAdvisories | `true` |

## Findings Summary

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 3 | +3 |
| P2 | 1 | +1 |

## Progress Table

| Iteration | Focus | Ratio | New Findings | Status |
|-----------|-------|-------|--------------|--------|
| 001 | correctness | 1.00 | P1=2 | insight |
| 002 | security | 0.00 | none | complete |
| 003 | traceability | 1.00 | P1=1 | insight |
| 004 | maintainability | 1.00 | P2=1 | complete |
| 005 | resource-map-coverage | 0.00 | none | complete |
| 006 | stabilization | 0.00 | none | complete |

## Coverage

| Coverage Area | Status |
|---------------|--------|
| Dimensions | 4/4 complete |
| Core traceability protocols | partial |
| Resource-map gate | skipped, source absent |
| P0 adjudication | N/A, no P0 |
| P1 adjudication | passed |

## Trend

Last three `newFindingsRatio` values: `1.00 -> 0.00 -> 0.00`. Findings stabilized, but active P1s remain.

## Active Risks

- F001 and F003 together mean the port contract and tests can green-light a real/fake identity mismatch.
- F002 means a future caller using `VectorStore.clear()` as documented could erase non-vector memory metadata.
