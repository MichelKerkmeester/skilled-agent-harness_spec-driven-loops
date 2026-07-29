# Deep Review Dashboard — GLM fan-out lineage

## Status
- **Provisional verdict**: FAIL
- **hasAdvisories**: true (1 P2 advisory)

## Findings Summary
- **P0: 4** | **P1: 4** | **P2: 1** (all active, 0 resolved, 0 duplicates)
- Delta from iteration 2→3: +0 P0, +4 P1, +0 P2

## Progress
| Iteration | Focus Dimension | newFindingsRatio | Findings Count | Status |
|-----------|-----------------|-------------------|----------------|--------|
| 1 | correctness | 0.80 | 4 P0 | complete |
| 2 | security | 0.10 | +1 P2 | complete |
| 3 | traceability+maintainability | 0.40 | +4 P1 | complete |

## Coverage
- Files reviewed: 18+ across runtime-hooks, spec packet, skill trees, runtime configs
- Dimensions completed: 4/4 (correctness, security, traceability, maintainability)
- Traceability: core `spec_code`=fail, `checklist_evidence`=fail

## Trend
- Last 3 ratios: 0.80 → 0.10 → 0.40 (descending then ascending — P1 findings in iteration 3 after the stale-path sweep)
- Stuck count: 0

## Active Risks
- 4 P0 broken imports in production hooks (F001-F004) — guards silently disabled
- CHK-011 [P0] overclaim (F009) — same class as the prior review's R4-P1-001

## Lifecycle
- sessionId: fanout-glm-1785248351785-j63aes
- lineageMode: new
- generation: 1
- continuedFromRun: null
