# Deep Review Dashboard - codex-4

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-4-1780591417923-pmkg63` |
| Mode | review |
| Iterations | 5 / 7 |
| Provisional Verdict | CONDITIONAL |
| Release Readiness | in-progress |
| hasAdvisories | true |
| Stop Reason | converged |

## Findings Summary

| Severity | Active | Delta Last Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Run | Focus | New P0 | New P1 | New P2 | newFindingsRatio | Status | Verdict |
|---:|---|---:|---:|---:|---:|---|---|
| 1 | correctness | 0 | 2 | 0 | 0.67 | complete | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | 0.00 | complete | PASS |
| 3 | traceability | 0 | 1 | 1 | 0.38 | complete | CONDITIONAL |
| 4 | maintainability | 0 | 0 | 0 | 0.00 | complete | PASS |
| 5 | stabilization | 0 | 0 | 0 | 0.00 | complete | PASS |

## Coverage

| Area | Status |
|---|---|
| correctness | covered |
| security | covered |
| traceability | covered |
| maintainability | covered |
| stabilization | covered |
| `spec_code` | partial |
| `checklist_evidence` | not applicable |
| `feature_catalog_code` | partial |
| `playbook_capability` | partial |
| resource-map coverage | skipped; target resource-map absent |

## Trend

Last three `newFindingsRatio` values: 0.38 -> 0.00 -> 0.00.

Signal: descending to flat. Coverage complete. Stabilization pass complete.

## Active Risks

| Risk | Status |
|---|---|
| Active P0 | none |
| Active P1 | 3 |
| Claim adjudication | pass |
| Code Graph | unavailable; graphless fallback used |
| User pause sentinel | absent |

## Legal Stop Gates

| Gate | Status |
|---|---|
| convergenceGate | pass |
| dimensionCoverageGate | pass |
| p0ResolutionGate | pass |
| evidenceDensityGate | pass |
| hotspotSaturationGate | pass |
| claimAdjudicationGate | pass |
| fixCompletenessReplayGate | pass |
| candidateCoverageGate | pass |
| graphlessFallbackGate | pass |
