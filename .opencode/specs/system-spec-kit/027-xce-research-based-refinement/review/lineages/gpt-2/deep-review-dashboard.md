# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-gpt-2-1781111094433-fahmna` |
| Iterations | 5 / 5 |
| Provisional verdict | CONDITIONAL |
| Release readiness | in-progress |
| hasAdvisories | true |

## Findings Summary

| Severity | Active | New Last Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|---------------------|--------|
| 001 | correctness | correctness | 0.55 | insight |
| 002 | security | security | 0.02 | complete |
| 003 | traceability | traceability | 0.48 | insight |
| 004 | maintainability | maintainability | 0.12 | complete |
| 005 | stabilization | correctness, traceability, maintainability | 0.01 | complete |

## Coverage

| Gate | Status | Notes |
|------|--------|-------|
| Dimension coverage | pass | All four dimensions covered. |
| Evidence gate | pass | Every active finding has file:line evidence. |
| Scope gate | pass | Reviewed files stayed inside the target spec folder. |
| Claim adjudication gate | pass | P1 findings F001 and F002 have typed packets. |
| Required traceability | partial | `spec_code` partial due F001; `checklist_evidence` pass/N/A for phase parent. |

## Trend

Last three new findings ratios: 0.48 -> 0.12 -> 0.01. Trend is descending, but active P1 findings prevent PASS.

## Active Risks

| Risk | Severity | Finding |
|------|----------|---------|
| Parent child inventory drift can misroute resume/search/phase traversal. | P1 | F001 |
| Parent resource map omits a live phase and its child scope. | P1 | F002 |
| Parent continuity next-safe-action is stale. | P2 | F003 |
