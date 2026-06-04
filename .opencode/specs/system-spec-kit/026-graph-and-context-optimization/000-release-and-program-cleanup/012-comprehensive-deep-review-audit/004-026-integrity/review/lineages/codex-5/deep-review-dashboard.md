# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-codex-5-1780593922588-e82609` |
| Lineage | `codex-5` |
| Iterations | 5 |
| Verdict | CONDITIONAL |
| hasAdvisories | true |
| Stop reason | converged |
| Release readiness | converged with required remediation |

## Findings Summary

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 5 | +5 |
| P2 | 1 | +1 |

## Progress Table

| Run | Focus | Ratio | New Findings | Status |
|-----|-------|-------|--------------|--------|
| 1 | correctness | 1.00 | 2 P1 | complete |
| 2 | security | 0.00 | none | complete |
| 3 | traceability | 0.60 | 3 P1 | complete |
| 4 | maintainability | 0.04 | 1 P2 | complete |
| 5 | stabilization | 0.00 | none | complete |

## Coverage

| Area | Result |
|------|--------|
| Dimensions | 4/4 covered |
| Core traceability | covered |
| Overlay traceability | covered |
| Resource-map gate | fail, finding DR-C5-F004 |
| Claim adjudication | passed for all P1 findings |

## Trend

`1.00 -> 0.00 -> 0.60 -> 0.04 -> 0.00`

The final two evidence passes found no new P0/P1 after all required dimensions were covered.

## Active Risks

- Five active P1 findings keep the verdict CONDITIONAL.
- No P0 findings are active.
- Code graph was unavailable, so graph-aware blind-spot checks used direct file and filesystem probes.
