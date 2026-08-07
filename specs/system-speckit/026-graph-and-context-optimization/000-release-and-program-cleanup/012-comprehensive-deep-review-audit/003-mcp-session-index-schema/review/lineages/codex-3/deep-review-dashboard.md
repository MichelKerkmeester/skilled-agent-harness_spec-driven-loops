# Deep Review Dashboard

## Status
- Provisional verdict: CONDITIONAL
- hasAdvisories: true
- Iteration: 5 of 7
- Next focus: synthesis complete
- Release readiness: release-blocking

## Findings Summary
| Severity | Active | Delta |
|----------|--------|-------|
| P0 | 0 | +0 |
| P1 | 2 | +2 |
| P2 | 2 | +2 |

## Progress
| Iteration | Focus | newFindingsRatio | Findings | Status |
|-----------|-------|------------------|----------|--------|
| 0 | init | 0.00 | 0 | initialized |
| 1 | correctness | 0.00 | 0 | PASS |
| 2 | security | 0.25 | F001 | CONDITIONAL |
| 3 | traceability | 0.60 | F002, F003, F004 | CONDITIONAL |
| 4 | maintainability | 0.00 | none | CONDITIONAL |
| 5 | stabilization | 0.00 | none | CONDITIONAL |

## Coverage
- Dimensions complete: 4/4
- Traceability core: complete
- Traceability overlays: complete
- Graph mode: graphless fallback

## Trend
- New P0/P1 findings appeared in iterations 2 and 3.
- No new findings appeared in iterations 4 and 5.
- Stabilization pass found no additional P0/P1 issues.

## Active Risks
- F001: ephemeral retention bypasses governed-ingest enforcement.
- F002: scan and async ingest accept governance fields but do not persist them.
- F003: session_bootstrap manual playbook call shape is stale.
- F004: session_resume manual playbook expected fields are stale.
