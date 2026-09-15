# Deep Review Dashboard — devin-a (review)

## Status

- Provisional verdict: CONDITIONAL (final; convergence off — stop policy max-iterations reached at 5/5)
- hasAdvisories: true (P2 findings present)
- Release readiness: in-progress

## Findings Summary

| Severity | Count | Delta (vs prev) |
|----------|-------|-----------------|
| P0 | 0 | 0 |
| P1 | 5 | +1 |
| P2 | 6 | +2 |

## Dimension Coverage

| Dimension | Status | Iterations |
|-----------|--------|------------|
| correctness | complete | 2, 3, 5 |
| security | complete | 3, 5 |
| traceability | complete | 1, 2, 3, 4 |
| maintainability | complete | 1, 2, 4 |

Lanes: all six packet lanes covered (its. 1-5).

## Progress

| Iteration | Focus | newFindingsRatio | Findings | Status |
|-----------|-------|------------------|----------|--------|
| 1 | Lane 1: sk-code + OpenCode alignment | 1.0 | 0 P0, 0 P1, 2 P2 | complete |
| 2 | Lane 4: deep-loop command alignment | 0.85 | 0 P0, 2 P1, 1 P2 | complete |
| 3 | Lane 5: deep-loop agent alignment | 0.32 | 0 P0, 1 P1, 1 P2 | complete |
| 4 | Lane 3+2: SKILL.md vs refs + catalogs/playbooks | 0.27 | 0 P0, 1 P1, 2 P2 | complete |
| 5 | Lane 6: general architecture | 0.16 | 0 P0, 1 P1, 0 P2 | complete |

## Trend

- Last ratios: 1.0 -> 0.85 -> 0.32 -> 0.27 -> 0.16 (descending; telemetry only)

## Coverage

- Files reviewed: 57 (cumulative)
- Protocols: spec_code fail (it. 2), agent_cross_runtime partial (it. 3), skill_agent partial (its. 1,4), feature_catalog_code fail (it. 4), playbook_capability partial (it. 4), checklist_evidence notApplicable

## Active Risks

- Stuck count: 0
- Convergence: OFF (telemetry only)
- Route-proof fields present on iteration records: target_agent, resolved_route, agent_definition_loaded, mode — yes
- Hard-gate failure: spec_code fail in iteration 2 (F003/F005) — must be resolved or adjudicated before merged PASS
- Active P1s: F003 (state-write contradiction), F005 (dropped flag), F006 (orchestrate delegation tool), F008 (phantom alignment mode), F011 (full-loop LEAF dispatch)
