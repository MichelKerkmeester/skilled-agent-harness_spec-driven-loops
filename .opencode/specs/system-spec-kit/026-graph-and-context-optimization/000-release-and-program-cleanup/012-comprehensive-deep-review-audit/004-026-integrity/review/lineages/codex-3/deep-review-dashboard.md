# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-codex-3-1780593922589-m3j24v` |
| Lineage | codex-3 |
| Mode | review |
| Iterations | 5 |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |
| Release readiness state | converged |

## Findings Summary

| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Progress Table

| Iteration | Focus | Ratio | New Findings | Status |
|-----------|-------|-------|--------------|--------|
| 001 | correctness | 1.0000 | P1 2 | complete |
| 002 | security | 0.0000 | none | complete |
| 003 | traceability | 0.3750 | P1 1, P2 1 | complete |
| 004 | maintainability | 0.0588 | P2 1 | complete |
| 005 | stabilization | 0.0000 | none | complete |

## Coverage

| Surface | Status |
|---------|--------|
| correctness | covered |
| security | covered |
| traceability | covered |
| maintainability | covered |
| spec_code | partial |
| checklist_evidence | pass, not applicable |
| resource-map coverage | covered |

## Trend

Last three ratios: 0.3750 -> 0.0588 -> 0.0000. The review reached saturation after a stabilization replay with no new findings.

## Active Risks

- F001: child graph metadata status drift.
- F002: top changelog rollup authority drift.
- F003: stale resource-map OK rows.
- F004 and F005 remain advisory.

## Gate Blockers

No P0 blockers. Active P1 findings keep the final verdict CONDITIONAL.
