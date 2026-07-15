---
title: "Implementation Summary"
description: "Token-budget truncator no longer collapses populated searches to one result: skip-and-continue packing, a min(limit,3) detailed-count floor, summary-first overflow routing, and a full budget for weak queries."
trigger_phrases:
  - "implementation"
  - "summary"
  - "token budget"
  - "truncation"
  - "skip and continue"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/001-token-budget-truncation-safety"
    last_updated_at: "2026-06-17T08:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented Problem 3 token-budget truncation safety fix"
    next_safe_action: "Orchestrator review + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/token-budget-skip-and-floor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-001-token-budget-truncation-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-token-budget-truncation-safety |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The token-budget truncator used to collapse a populated search down to a single result. It sorted candidates by score and hard-stopped on the first result that overflowed the budget, so one large top memory starved every smaller lower-ranked result that would otherwise have fit. This fix (Problem 3 from the search-intelligence research) makes the truncator pack greedily but forgivingly, guarantee a usable minimum, surface the overflow instead of dropping it, and stop penalising the weak queries that need breadth most.

### Skip-and-continue packing

The accumulator now skips a too-large result and keeps scanning, instead of breaking the loop. A single oversized top memory no longer prevents the smaller tail from being returned. This is the change that fixes the headline 5→1 collapse on its own: when the top hit is huge, the rest of the page still comes back.

### Detailed-count floor at min(limit, 3)

After full-detail packing, if fewer than `min(limit, 3)` results were kept, the highest-scoring skipped results are promoted as token-cheap summaries (`createSummaryFallback`, `_summarized: true`) so a populated search surfaces a usable set rather than near-nothing. The floor is defined against the caller's `limit` and aligns with `DEFAULT_MIN_RESULTS = 3` in `confidence-truncation.ts`. When no `limit` is supplied, there is nothing to floor against, so it falls back to the historical ≥1 guarantee (production search always passes a limit, so the floor engages where it matters).

### Summary-first overflow, regardless of includeContent

The floor promotes summaries whether or not `includeContent` was requested. Previously the summary fallback only fired when `includeContent` was true, but the common metadata-only call passes false, so the overflow remainder was simply discarded. Whatever still does not fit after the floor is now routed through `buildProgressiveResponse` (summary layer + first snippet page + continuation cursor) and returned on the new optional `progressive` field of `TruncateToBudgetResult`, so callers can page the remainder rather than lose it.

### Full budget for weak / low-signal queries

`getDynamicTokenBudget` takes an optional `lowSignal` flag. When set, the budget is floored at `DEFAULT_BUDGET` so a weak query is never trimmed below the full budget — weak queries carry the least relevance signal and depend on breadth to recover anything. The hybrid-search call site derives `lowSignal` from `routeResult.classification.confidence ∈ {low, fallback}`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | Modified | Skip-and-continue + floor + summary-first remainder in `truncateToBudget`; `limit`/`query` options; `progressive` result field; low-signal budget flag at the call site; progressive-disclosure import |
| `mcp_server/lib/search/dynamic-token-budget.ts` | Modified | `getDynamicTokenBudget` `lowSignal` option floors weak-query budget at `DEFAULT_BUDGET` |
| `mcp_server/tests/token-budget-skip-and-floor.vitest.ts` | Created | Proves skip-and-continue keeps smaller fitting results, the ≥3 floor promotes summaries (incl. `includeContent=false`), and a small explicit `limit` caps the floor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surgical edits to two library modules plus a focused new test, verified with the existing search test suites. `progressive-disclosure.ts` and `confidence-truncation.ts` were read but not modified — the fix reuses their existing primitives (`buildProgressiveResponse`, `DEFAULT_MIN_RESULTS`). No feature flag was added: the truncator already runs unconditionally, and this is a correctness fix to its packing behaviour.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Floor is gated on the caller's `limit`; no limit → ≥1 | The spec defines the floor as `min(limit, 3)`, so without a `limit` there is nothing to floor against. This keeps the two pre-existing `T025` regression tests (which call `truncateToBudget` with no limit) green while production, which always passes a limit, gets the full `min(limit, 3)` floor. Skip-and-continue alone fixes the headline collapse, so the limit-less path loses no safety. |
| Expose the overflow remainder as an additive `progressive` field rather than rewiring the response envelope | "Route the remainder through `buildProgressiveResponse` rather than discarding it" is satisfied without a cross-cutting change to the search response shape consumed by many callers. Threading the envelope into the MCP response is a separate phase. |
| Re-sort the accepted set by score after promotion | A promoted summary can outrank an already-accepted full result; re-sorting preserves the highest-score-first contract the existing greedy-order test depends on. |
| Single-result overflow branch left unchanged | An existing test asserts a lone result is not summarised when `includeContent=false`; the floor/summary-first logic applies to the multi-result path only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Baseline failures captured before the change: `token-budget-enforcement.vitest.ts` (1 — `memory_health budget: expected 1500 to be 1000`) and `reconsolidation.vitest.ts` (9). These are pre-existing and unrelated; confirmed still failing with the same signatures after the change (delta: 0 new failures).

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (clean, `tsc --noEmit`) |
| `confidence-truncation + token-budget + dynamic-token-budget + hybrid-search` vitest | PASS (4 files, 178 tests) |
| New `token-budget-skip-and-floor.vitest.ts` | PASS (3 tests) |
| `progressive-disclosure.vitest.ts` (imported module) | PASS (53 tests) |
| `budget-allocator + hybrid-search-flags + hybrid-search-context-headers + progressive-validation + token-budget-constitutional-sync` | PASS (6 files, 119 tests) |
| `token-budget-enforcement` + `reconsolidation` (known baseline) | FAIL — 10 tests, identical to pre-change baseline (`1500 vs 1000` + 9 reconsolidation); not regressions |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `progressive` envelope is produced but not yet consumed by the MCP response layer.** `truncateToBudget` now returns it, but wiring it into the search response shape and the cursor-paging surface is deferred to a later phase. The remainder is preserved (not discarded), but callers do not yet page it.
2. **The detailed-count floor can exceed the strict token budget by up to ~3 summary entries** (~100 tokens each). This is the intended trade-off: guaranteeing a minimum usable set takes priority over a hard budget ceiling on overflow.
3. **Low-signal detection uses the query classifier's confidence label only** (`low`/`fallback`), not the downstream `requestQuality` assessment, which is owned by a sibling phase (`002-request-quality-aggregation`) and not available at budget-resolution time.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
