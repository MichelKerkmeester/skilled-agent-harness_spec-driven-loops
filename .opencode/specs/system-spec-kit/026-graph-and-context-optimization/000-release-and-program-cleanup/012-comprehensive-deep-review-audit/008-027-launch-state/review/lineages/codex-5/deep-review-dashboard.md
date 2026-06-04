# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-5-1780596675702-bahixt` |
| Lineage | `codex-5` |
| Iterations | 6 |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |
| Release readiness state | converged |
| Stop reason | converged |

## Findings Summary

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 2 |

## Progress Table

| Iteration | Focus | New ratio | New findings | Status |
|---:|---|---:|---:|---|
| 1 | phase-parent executable child scaffold | 1.0000 | 1 | complete |
| 2 | security exposure and trust-boundary review | 0.0000 | 0 | complete |
| 3 | renumbered child metadata and 026 alignment | 0.5455 | 2 | insight |
| 4 | derived status and resume/search truth | 0.3125 | 1 | complete |
| 5 | target resource map accuracy | 0.0588 | 1 | complete |
| 6 | stabilization replay and legal-stop check | 0.0000 | 0 | complete |

## Coverage

| Area | Status |
|---|---|
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| spec_code | partial |
| checklist_evidence | pass |
| feature_catalog_code | partial |
| playbook_capability | partial |

## Trend

Last three new-findings ratios: `0.3125 -> 0.0588 -> 0.0000`. Trend: descending.

## Active Risks

- P1: 027 parent declares a placeholder child that is not executable as a spec folder.
- P1: renumbered child metadata still exposes old phase ids and labels.
- P1: graph derived status marks draft children complete.
- P2: target resource map overstates metadata readiness.
- P2: 026 alignment claim should pin the specific completed 026 surface.
