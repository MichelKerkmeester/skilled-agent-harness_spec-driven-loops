# Review Report: Token Budget Truncation Safety

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | PASS |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 0 |
| **Active P2** | 5 |
| **Scope** | D1 Correctness review of token-budget skip-and-continue packing, detailed-count floor, summary-first overflow routing, and low-signal budget gating |
| **Stop Reason** | maxIterationsReached (1 of 1) |
| **Session** | fanout-p017c001-ds-1781722608717-uedph1 |
| **Lineage** | generation=1, lineageMode=new |

The token-budget-truncation-safety implementation passes the D1 Correctness review with no blocking (P0) or required-fix (P1) findings. The skip-and-continue packing, detailed-count floor, summary-first overflow routing, and low-signal budget gating are all correctly implemented. Five P2 advisories document confirmed-correct behaviors and one fragile metadata-initialization pattern.

## 2. Planning Trigger

PASS verdict routes to changelog creation (`/create:changelog`). The 5 P2 advisories are recorded as `hasAdvisories=true` — no remediation planning is required unless the operator chooses to address the advisory items.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Iterations |
|----|----------|-----------|-------|----------|------------|
| F001 | P2 | correctness | Skip-and-continue loop correctly prevents top-result starvation | `mcp_server/lib/search/hybrid-search.ts:2845-2853` | 1 |
| F002 | P2 | correctness | Detailed-count floor enforces min(limit, 3) via summary promotion | `mcp_server/lib/search/hybrid-search.ts:2862-2867` | 1 |
| F003 | P2 | correctness | Summary-first overflow routing preserves remainder via progressive disclosure | `mcp_server/lib/search/hybrid-search.ts:2875-2881` | 1 |
| F004 | P2 | correctness | Low-signal budget preserves full budget for weak queries | `mcp_server/lib/search/dynamic-token-budget.ts:90-92` | 1 |
| F005 | P2 | correctness | s3meta.tokenBudget.adjustedBudget initialized with placeholder before header overhead patching | `mcp_server/lib/search/hybrid-search.ts:1354` | 1 |

### Finding Details

**F001**: The `truncateToBudget` function at line 2845 uses `continue` (not `break`) when a result overflows the budget, allowing smaller trailing results to be packed. This fixes the headline 5→1 collapse bug. Verified by `token-budget-skip-and-floor.vitest.ts:32-68`.

**F002**: The detailed-count floor at line 2862 enforces `min(limit, DEFAULT_MIN_RESULTS)` (where `DEFAULT_MIN_RESULTS=3`) by promoting overflow entries as token-cheap summaries via `createSummaryFallback`. Verified by `token-budget-skip-and-floor.vitest.ts:70-122`.

**F003**: Overflow results that don't fit after the floor are routed to `buildProgressiveResponse` at line 2876, producing a summary layer, first snippet page, and continuation cursor. Verified by `token-budget-skip-and-floor.vitest.ts:105-107`.

**F004**: The `getDynamicTokenBudget` function at line 90-92 applies `Math.max(tierBudget, DEFAULT_BUDGET)` when `lowSignal` is true, preserving the full 4000-token budget for weak queries. The hybrid-search call site at line 1339-1344 correctly derives `lowSignalQuery` from the query classifier's confidence label.

**F005**: The `s3meta.tokenBudget.adjustedBudget` field is initialized to `budgetResult.budget` at line 1354, before header overhead is computed. It is patched at line 2004 after overhead calculation. While no current consumer reads the field between initialization and patching, the mutation-after-construction pattern is fragile.

## 4. Remediation Workstreams

No remediation required (PASS verdict). The 5 P2 advisories are listed in Deferred Items.

## 5. Spec Seed

No spec updates required. The implementation matches the specification described in `implementation-summary.md` and `plan.md`.

## 6. Plan Seed

No planning required. If the operator chooses to address P2 items:

- **F005**: Consider restructuring `s3meta.tokenBudget` assignment to occur after `headerOverhead` is known, eliminating the mutation-after-construction pattern at `hybrid-search.ts:1346-1356`.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pending | Not covered — maxIterations reached before traceability dimension |
| `checklist_evidence` | core | pending | Not covered — maxIterations reached before traceability dimension |
| `feature_catalog_code` | overlay | pending | Not covered |
| `playbook_capability` | overlay | pending | Not covered |

## 8. Deferred Items

| ID | Severity | Description | Action |
|----|----------|-------------|--------|
| F001 | P2 | Skip-and-continue verified correct | No action needed — advisory confirmation |
| F002 | P2 | Floor mechanism verified correct | No action needed — advisory confirmation |
| F003 | P2 | Overflow routing verified correct | No action needed — advisory confirmation |
| F004 | P2 | Low-signal budget gating verified correct | No action needed — advisory confirmation |
| F005 | P2 | Fragile metadata initialization pattern | Optional refactor: move s3meta.tokenBudget assignment to after header overhead computation |
| D2-D4 | — | Remaining dimensions (Security, Traceability, Maintainability) not covered | Future review with higher maxIterations |
| core protocols | — | spec_code and checklist_evidence not executed | Future review with higher maxIterations |

## 9. Audit Appendix

### Iteration Coverage

| Run | Dimension | Status | Findings | Ratio |
|-----|-----------|--------|----------|-------|
| 1 | D1 Correctness | complete | 0 P0, 0 P1, 5 P2 | 0.0 |

### Convergence Replay

- maxIterations=1, iterations completed=1 → hard stop triggered at `maxIterationsReached`
- Composite convergence not applicable (insufficient iterations for rolling average, MAD, or stabilization pass)
- No blocked-stop events emitted
- Verdict: PASS (0 active P0, 0 active P1)

### File Coverage Matrix

| File | Dimensions Reviewed | Findings |
|------|-------------------|----------|
| `mcp_server/lib/search/hybrid-search.ts` | D1 | 5 P2 |
| `mcp_server/lib/search/dynamic-token-budget.ts` | D1 | 1 P2 |
| `mcp_server/tests/token-budget-skip-and-floor.vitest.ts` | D1 | 0 |

### State Integrity

- Config: deep-review-config.json — valid, status updated to "complete"
- JSONL: deep-review-state.jsonl — 2 records (config + iteration 1)
- Registry: deep-review-findings-registry.json — 5 active, 0 resolved
- Strategy: deep-review-strategy.md — D1 marked complete
- Dashboard: deep-review-dashboard.md — generated

### Verification Evidence

- Source citations: All 5 findings backed by `file:line` evidence in `mcp_server/lib/search/hybrid-search.ts` and `mcp_server/lib/search/dynamic-token-budget.ts`
- Test coverage: `token-budget-skip-and-floor.vitest.ts` (3 tests) all pass, covering skip-and-continue, floor mechanics, and limit capping
- Pre-existing suite: 178 + 53 + 119 tests pass; 10 known baseline failures unchanged
- TypeScript: `npm run typecheck` passes clean
