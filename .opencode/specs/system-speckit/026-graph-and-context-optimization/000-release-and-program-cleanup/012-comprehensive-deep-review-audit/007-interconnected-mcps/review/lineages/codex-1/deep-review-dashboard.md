# Deep Review Dashboard

## Status
- Verdict: FAIL
- Release readiness: release-blocking
- hasAdvisories: true
- Stop reason: maxIterationsReached
- Iterations: 7 of 7

## Findings Summary
| Severity | Count | Delta |
|---|---:|---:|
| P0 | 1 | 0 |
| P1 | 4 | 0 |
| P2 | 2 | 0 |

## Progress Table
| Iteration | Focus | New Findings Ratio | New Findings | Status |
|---:|---|---:|---:|---|
| 1 | correctness | 1.000 | 1 | insight |
| 2 | correctness | 0.333 | 1 | complete |
| 3 | traceability | 0.400 | 2 | complete |
| 4 | security | 0.167 | 1 | complete |
| 5 | traceability | 0.000 | 0 | complete |
| 6 | maintainability | 0.063 | 2 | complete |
| 7 | stabilization | 0.000 | 0 | complete |

## Coverage
- Dimensions covered: correctness, security, traceability, maintainability
- Core protocols: spec_code partial, checklist_evidence pass
- Overlay protocols: feature_catalog_code partial, playbook_capability partial
- Resource-map coverage: not applicable; target spec has no resource-map.md

## Trend
- Last 3 ratios: 0.000 -> 0.063 -> 0.000
- Trend: flat after coverage, but active P0/P1 block release.

## Active Risks
- P0: reducer ignores fan-out artifact override.
- P1: fan-out CLI subprocesses are serialized by `spawnSync`.
- P1: lineage iteration caps do not reach child loop maxIterations.
- P1: fan-out bypasses shared recursion/env guard.
- P1: Codex service-tier defaults drift.
- P2: prompt-only write boundary and comment hygiene debt remain.
