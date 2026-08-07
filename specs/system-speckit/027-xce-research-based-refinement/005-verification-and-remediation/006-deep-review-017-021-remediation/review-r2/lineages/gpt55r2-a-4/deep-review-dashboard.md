# Deep Review Dashboard - gpt55r2-a-4

## Status
- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Release readiness: in-progress
- hasAdvisories: false
- Code graph trust: stale; graphless direct-read fallback used

## Findings Summary
- Active P0: 0
- Active P1: 2
- Active P2: 0
- New this iteration: +0 P0, +2 P1, +0 P2

## Dimension Coverage
| Dimension | Covered | Iterations | Result |
|-----------|---------|------------|--------|
| correctness | yes | 1 | F002 |
| security | yes | 1 | F001 |
| traceability | yes | 1 | partial |
| maintainability | no | - | search debt |

## Progress
| Iteration | Focus | Files | Findings | New Findings Ratio | Status |
|-----------|-------|-------|----------|--------------------|--------|
| 1 | Search/retrieval correctness, scope, and fallback semantics | 9 | 0/2/0 | 1.00 | complete |

## Gates
| Gate | Status | Detail |
|------|--------|--------|
| convergenceGate | terminal | Max iteration ceiling reached. |
| dimensionCoverageGate | fail-recorded | Maintainability not covered under one-iteration cap. |
| p0ResolutionGate | pass | Active P0 = 0. |
| evidenceDensityGate | pass | Active findings have direct file:line evidence. |
| hotspotSaturationGate | partial | Single pass only. |
| claimAdjudicationGate | pass | Typed packets present for F001 and F002. |
| fixCompletenessReplayGate | pass | Not a security-sensitive fix rerun. |
| candidateCoverageGate | skipped | Review-depth v2 discriminator absent. |
| graphlessFallbackGate | skipped | Review-depth v2 discriminator absent; direct-read fallback evidence recorded. |

## Next Focus
Remediate community fallback `specFolder` scope first, then fix summary embedding scope-before-top-K behavior. If review continues, sweep maintainability, recovery payloads, and cancellation/read-path resilience.

## Search Debt
- Maintainability dimension not covered due to `maxIterations=1`.
- Additional read-path resilience, recovery payload, stage3, and stage4 paths remain unswept.
