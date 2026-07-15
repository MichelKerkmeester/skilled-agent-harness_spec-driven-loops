# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-codex-1-1780591417923-0rq1ay` |
| Mode | review |
| Iterations | 5 of 7 |
| Stop reason | converged |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |
| Release readiness | in-progress |

## Findings Summary

| Severity | Active | New in latest |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Run | Focus | New ratio | New P0 | New P1 | New P2 | Status |
|---:|---|---:|---:|---:|---:|---|
| 1 | correctness | 1.000 | 0 | 2 | 0 | insight |
| 2 | security | 0.000 | 0 | 0 | 0 | complete |
| 3 | traceability | 0.375 | 0 | 1 | 1 | insight |
| 4 | maintainability | 0.000 | 0 | 0 | 0 | complete |
| 5 | stabilization | 0.000 | 0 | 0 | 0 | complete |

## Coverage

| Area | Status |
|---|---|
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| Stabilization pass | covered |
| Core traceability protocols | covered with partial findings |
| Overlay traceability protocols | covered with partial findings |
| Resource map coverage | skipped; source `resource-map.md` absent |

## Trend

Last ratios: `0.375 -> 0.000 -> 0.000`. Trend is flat at no new findings after traceability.

## Active Risks

- F001 can keep graph-channel routing stale for up to the entity-density TTL after update/delete.
- F002 makes reconcile dry-run planned mutation counts under-report apply mutations.
- F003 gives operators an unsupported apply command in public docs.
- F004 leaves a public option with no observable implementation effect.
- Code Graph unavailable; graphless fallback used direct reads and `rg`.

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
