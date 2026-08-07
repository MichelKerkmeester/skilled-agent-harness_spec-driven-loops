# Deep Review Dashboard - MCP Core

## Status
| Field | Value |
|---|---|
| Session | `fanout-codex-5-1780591417923-ro731l` |
| Iterations | 5 |
| Stop reason | `converged` |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |

## Findings Summary
| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 3 |
| P2 | 1 |

## Progress Table
| Run | Focus | New ratio | New findings | Verdict |
|---:|---|---:|---|---|
| 1 | correctness | 1.00 | P1:2 | CONDITIONAL |
| 2 | security | 0.00 | none | PASS |
| 3 | traceability | 1.00 | P1:1, P2:1 | CONDITIONAL |
| 4 | maintainability | 0.00 | none | PASS |
| 5 | stabilization | 0.00 | none | PASS |

## Coverage
| Area | Status |
|---|---|
| correctness | covered |
| security | covered |
| traceability | covered |
| maintainability | covered |
| spec_code | partial |
| checklist_evidence | pass/skipped |
| feature_catalog_code | partial |
| playbook_capability | partial |

## Trend
Last three `newFindingsRatio` values: `1.00 -> 0.00 -> 0.00`. Direction: descending/stable.

## Active Risks
- F001: update-path entity-density cache freshness can lag until TTL.
- F002: reconcile dry-run can under-report success-coverage repairs.
- F003: operator docs still use a rejected reconcile apply call shape.
- F004: accepted public option has no behavior.

## Gates
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
