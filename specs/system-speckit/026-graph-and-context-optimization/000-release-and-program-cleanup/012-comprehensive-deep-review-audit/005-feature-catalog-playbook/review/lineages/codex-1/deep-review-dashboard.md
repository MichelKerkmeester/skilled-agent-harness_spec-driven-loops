# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-1-1780594677741-5jdby6` |
| Iterations | 6 |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | false |
| Stop reason | converged |
| Release-readiness state | converged |

## Findings Summary

| Severity | Active | Delta Last Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 6 | 0 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Ratio | New Findings | Status |
|---:|---|---:|---:|---|
| 1 | correctness | 0.40 | 2 P1 | complete |
| 2 | security | 0.00 | 0 | complete |
| 3 | traceability | 0.43 | 3 P1 | complete |
| 4 | maintainability | 0.16 | 1 P1 | complete |
| 5 | stabilization replay | 0.00 | 0 | complete |
| 6 | final saturation | 0.00 | 0 | complete |

## Coverage

| Area | Status |
|---|---|
| Dimensions | correctness, security, traceability, maintainability covered |
| Core protocols | spec_code partial, checklist_evidence pass |
| Overlay protocols | feature_catalog_code partial, playbook_capability partial |
| Resource map | Not present at init; gate skipped |

## Trend

Last ratios: `0.16 -> 0.00 -> 0.00`. Trend is descending and then flat at zero.

## Active Risks

- Six active P1 findings prevent PASS.
- README, tests, catalog root, and playbook root disagree on current live counts.
- Several playbook/catalog links and source tables are stale enough to break operator verification.
