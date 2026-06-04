# Deep Review Dashboard - codex-3

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-3-1780591417922-o2y9it` |
| State | complete |
| Stop reason | converged |
| Verdict | CONDITIONAL |
| hasAdvisories | true |
| Release readiness state | converged |

## Findings Summary

| Severity | Active | New in last iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Iteration | Focus | New ratio | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---:|---|
| 1 | correctness | 1.000 | 0 | 2 | 0 | CONDITIONAL |
| 2 | security | 0.000 | 0 | 0 | 0 | PASS |
| 3 | traceability | 0.375 | 0 | 1 | 1 | CONDITIONAL |
| 4 | maintainability | 0.000 | 0 | 0 | 0 | PASS |
| 5 | stabilization | 0.000 | 0 | 0 | 0 | PASS |

## Coverage

| Area | Status |
|---|---|
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| Stabilization | covered |
| `spec_code` | partial |
| `checklist_evidence` | pass/skipped |
| `feature_catalog_code` | partial |
| `playbook_capability` | partial |

## Trend

Last three `newFindingsRatio` values: 0.375 -> 0.000 -> 0.000.

Trend: descending to stable zero.

## Active Risks

- F001: stale entity-density routing after `memory_update` title/trigger phrase changes.
- F002: dry-run/apply count mismatch for `repairSuccessCoverage`.
- F003: documented repair command is rejected by live schema.
- F004: `activeOnly` is accepted but inert.

## Gate Results

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
