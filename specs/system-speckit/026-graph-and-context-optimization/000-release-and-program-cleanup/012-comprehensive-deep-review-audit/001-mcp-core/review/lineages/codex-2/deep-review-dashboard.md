# Deep Review Dashboard

## Status
Provisional verdict: CONDITIONAL
hasAdvisories: true
Stop reason: converged
Release readiness: in-progress

## Findings Summary
| Severity | Active | New In Last Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Progress Table
| Iteration | Focus | Ratio | New P0 | New P1 | New P2 | Status |
|---:|---|---:|---:|---:|---:|---|
| 1 | correctness | 1.0000 | 0 | 2 | 0 | complete |
| 2 | security | 0.0000 | 0 | 0 | 0 | complete |
| 3 | traceability | 0.1667 | 0 | 0 | 2 | complete |
| 4 | maintainability | 0.2941 | 0 | 1 | 0 | complete |
| 5 | stabilization | 0.0000 | 0 | 0 | 0 | complete |

## Coverage
Dimensions: 4/4
Core traceability: spec_code partial, checklist_evidence pass/skipped
Overlay traceability: feature_catalog_code partial, playbook_capability partial
Resource map: absent at init, gate skipped

## Trend
Last three newFindingsRatio values: 0.1667 -> 0.2941 -> 0.0000
Trend: converged after stabilization, but active P1 findings keep the final verdict conditional.

## Active Risks
- F001: stale entity-density routing after `memory_update`.
- F002: reconcile dry-run under-reports repair work.
- F003: atomic save can index a DB row before the file promotion succeeds.
- F004 and F005: public reconcile contract drift.

## Legal Stop Gates
| Gate | Result |
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
