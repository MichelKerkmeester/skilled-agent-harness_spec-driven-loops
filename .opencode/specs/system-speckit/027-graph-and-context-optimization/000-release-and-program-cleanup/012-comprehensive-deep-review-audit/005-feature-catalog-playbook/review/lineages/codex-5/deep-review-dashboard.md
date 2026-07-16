# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-5-1780594677742-nigkgb` |
| Lineage | `codex-5` |
| Current iteration | 5 |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |
| Stop reason | converged |

## Findings Summary

| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Dimension Coverage

| Dimension | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress

| Iteration | Focus | New Findings Ratio | Findings |
|---:|---|---:|---:|
| 1 | correctness | 0.50 | 1 |
| 2 | security | 0.00 | 0 |
| 3 | traceability | 0.71 | 3 |
| 4 | maintainability | 0.05 | 1 |
| 5 | stabilization | 0.00 | 0 |

## Next Focus

Converged. Fix active P1 findings before treating the catalog/playbook verification slice as release-ready.

## Active Risks

- Scenario 136 cannot run as written until `FEATURE_CATALOG.md` references are corrected.
- Scenario 138 cannot run as written until the verifier path is corrected.
- Root feature catalog prose overstates traceability annotation coverage.
