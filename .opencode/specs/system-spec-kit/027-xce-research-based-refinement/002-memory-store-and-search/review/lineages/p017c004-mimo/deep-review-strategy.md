# Deep Review Strategy

## Files Under Review

| File | Purpose | Status |
|------|---------|--------|
| `mcp_server/lib/search/confidence-scoring.ts` | Per-result confidence scoring with rebalance + calibration hook | Reviewed (iter 1) |
| `mcp_server/lib/search/confidence-calibration.ts` | Isotonic fit/apply calibration infrastructure (default OFF) | Reviewed (iter 1) |
| `mcp_server/lib/search/search-flags.ts` | Feature flags for calibration | Reviewed (iter 1) |
| `mcp_server/tests/confidence-calibration.vitest.ts` | Tests for calibration math and wiring | Reviewed (iter 1) |
| `004-…/assets/fit-calibration.mjs` | Proxy seed generator | Not reviewed |
| `004-…/assets/confidence-labeled-set.starter.json` | 100-pair proxy labeled set | Not reviewed |
| `004-…/assets/confidence-calibration-model.starter.json` | Demo isotonic model | Not reviewed |

## Cross-Reference Status

### Core
- [x] spec.md ↔ implementation-summary.md alignment — **FAILED**: spec.md is scaffold placeholder
- [x] plan.md ↔ tasks.md ↔ implementation consistency — **FAILED**: plan.md and tasks.md are scaffold placeholders

### Overlay
- [ ] Checklist evidence (no checklist.md present — Level 1 folder)

## Known Context

- This is a Level 1 spec folder (scaffold/template).
- spec.md, plan.md, and tasks.md are still in template/scaffold state with placeholder content.
- implementation-summary.md is fully populated and claims 100% completion.
- The implementation ships two deliverables: (A) weight rebalance 0.45/0.55 default ON, (B) calibration infrastructure default OFF.
- The calibration model is explicitly documented as UNVALIDATED.
- 67 tests passing (54 prior + 13 new).

## Review Boundaries

- Scope: confidence-calibration-labeled-set packet only
- Out of scope: other phases of 017-search-and-output-intelligence-implementation
- Target files are read-only

## Findings

### Active Findings

| ID | Severity | Category | Description | File:Line | Iteration |
|----|----------|----------|-------------|-----------|-----------|
| P1-001 | P1 | traceability | Spec documents are scaffold placeholders — zero traceability baseline | spec.md:48-128 | 1 |
| P2-001 | P2 | correctness | No test for boolean `relevant` values in `loadLabeledSet()` | vitest.ts:122-127 | 1 |
| P2-002 | P2 | maintainability | Weight constants `WEIGHT_HEURISTIC` + `WEIGHT_SCORE_PRIOR` have no invariant assertion | confidence-scoring.ts:54-56 | 1 |
| P2-003 | P2 | maintainability | Model cache is never invalidated on file content change | confidence-scoring.ts:170-179 | 1 |

## Coverage

| Dimension | Status | Iterations |
|-----------|--------|------------|
| Correctness | COMPLETE (CONDITIONAL) | 1 |
| Security | Not covered | 0 |
| Traceability | Partial (covered via correctness pass) | 0 dedicated |
| Maintainability | Partial (covered via correctness pass) | 0 dedicated |

## Next Focus

**Remaining dimensions**: Security, Traceability (dedicated), Maintainability (dedicated). Limited by maxIterations=1 — convergence not yet achieved.
