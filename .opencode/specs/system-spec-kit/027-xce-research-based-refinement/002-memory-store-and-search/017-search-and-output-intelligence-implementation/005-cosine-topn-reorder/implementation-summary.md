---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "017/005-cosine-topn-reorder"
    last_updated_at: "2026-06-17T09:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented cosine-primary top-N head reorder behind SPECKIT_COSINE_TOPN_REORDER (default-ON)"
    next_safe_action: "Measure precision@1 on a labeled set (research step b) to validate the lift"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017/005-cosine-topn-reorder"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the head reorder improve precision@1 in practice? Unmeasured — no labeled set yet."
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
| **Spec Folder** | 005-cosine-topn-reorder |
| **Completed** | 2026-06-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Hybrid search now re-asserts absolute cosine relevance at the head of the result list, so the most semantically-on-target memory lands at position 1 instead of being buried by compressed RRF fusion magnitudes. This is the research's #1 reranker move (Problem 4) — the cheap one: a near-zero-latency reorder, not a model. It matters now because the S2/S3 work (request-quality aggregation, generic-query routing) made position 1 decisive, and ordering had been ignoring the one absolute relevance signal the corpus actually carries.

### Cosine-primary top-N head reorder

Right after token-budget truncation produces the final survivors, the top-N of the list (N=10) is re-sorted by `resolveAbsoluteRelevance` — cosine similarity for vector hits, falling back to the effective score for lexical-only hits. The sort is **stable**: equal-relevance items keep their incoming fused (RRF) order, so the reorder only rebalances genuine relevance differences in the head and never disturbs ties, length, or membership. The tail beyond position 10 is untouched — RRF fusion stays the ranking baseline everywhere except the head where it most matters.

The behavior is gated behind `SPECKIT_COSINE_TOPN_REORDER`, **default-ON** (the research grades it LOW-risk), and fully reversible with `SPECKIT_COSINE_TOPN_REORDER=false`. No model, LLM call, or cross-encoder was added — that is the research's explicit "only if a gap remains, later" path, not this phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | Modified | Added `reorderTopNByCosine` helper + `COSINE_TOPN_REORDER_DEPTH`; applied the gated reorder after `truncateToBudget` in `enrichFusedResults`; exported both via `__testables`. |
| `mcp_server/lib/search/search-flags.ts` | Modified | Added `isCosineTopnReorderEnabled()` (default-ON via `isFeatureEnabled`). |
| `mcp_server/tests/cosine-topn-reorder.vitest.ts` | Created | Unit coverage: promotion, tie stability, length/membership invariants, head-only scope, lexical fallback, flag default-ON + reversible. |
| `mcp_server/tests/hybrid-search.vitest.ts` | Modified | Updated the degree-fusion regression assertion to the cosine-correct order (see Key Decisions). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Shipped behind a default-ON, reversible feature flag so the lift can be rolled back instantly if a labeled-set measurement later shows it does not help. The helper is a pure function, unit-tested in isolation, then wired into the live pipeline at the one point that is the final word on ordering. Verification was a typecheck plus the hybrid-search, token-budget, ranking, and pipeline suites; the one assertion that legitimately changed (degree-fusion ordering) was updated to the cosine-correct order rather than worked around.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Placed the reorder **after** `truncateToBudget`, not before it as the brief's wording suggested | `truncateToBudget` re-sorts its survivors by the fused `score` (`hybrid-search.ts:2753`) and even the no-overflow path returns score-sorted results (`hybrid-search.ts:2769`). A reorder placed before it would be silently clobbered for both ordering and the budget decision (budget membership is chosen by `score`, which the reorder does not touch). Placing it on the budgeted survivors makes it the last word on order while leaving the budget's membership choice untouched — which delivers the brief's stated goal. This is a deliberate deviation from the literal placement; flagged here per Logic-Sync. |
| Skipped the reorder in `evaluationMode` | Eval mode intentionally preserves the requested top-K window for labeled-set/calibration measurement (e.g. packet 004). Reordering there would shift the very baseline a future precision@1 measurement compares against. |
| Reorder by `resolveAbsoluteRelevance`, stable, head-only (N=10) | Matches the research proposal exactly: re-assert the absolute cosine signal that ordering ignores, only where position 1 matters, without re-ranking the whole list or changing fusion math. Explicit index tiebreaker guarantees ties keep fused order regardless of `Array.sort` stability. |
| Updated the degree-fusion regression test to cosine-correct order instead of carving degree out | With the reorder on, a higher-cosine vector hit (0.9) now leads a degree-promoted hit (0.8); that is the intended consequence of re-asserting cosine over fused/degree magnitudes. The degree result still survives fusion with its provenance — the test now asserts that, plus the new position-1 ordering, so degree coverage is preserved, not weakened. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

Baseline (before this change): `adaptive-ranking-e2e.vitest.ts` already failed with `SqliteError: table consumption_log has no column named query_text` — a pre-existing schema/baseline failure confirmed by stashing the change and re-running. Not chased (out of scope).

| Check | Result |
|-------|--------|
| `npm run typecheck` (incl. new test file) | PASS — clean, no errors |
| `tests/cosine-topn-reorder.vitest.ts` (new) | PASS — 9/9 (promotion, tie stability, length/membership, head-only, depth bound, lexical fallback, flag default-ON + reversible) |
| `tests/hybrid-search.vitest.ts` | PASS — incl. updated degree-fusion assertion |
| `tests/token-budget-skip-and-floor.vitest.ts`, `token-budget.vitest.ts` | PASS |
| `tests/hybrid-search-flags`, `hybrid-search-context-headers`, `adaptive-ranking`, `pipeline-integration`, `integration-search-pipeline`, `stage3-rerank-regression`, `usage-weighted-ranking` | PASS — 97/97 |
| `tests/gate-d-regression-4-stage-search-pipeline`, `pipeline-v2`, `integration-138-pipeline`, `pipeline-architecture-remediation` | PASS — 63/63 |
| `tests/adaptive-ranking-e2e.vitest.ts` | FAIL (1) — pre-existing `consumption_log` schema baseline failure, unrelated to this change (reproduced on stash) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Unmeasured lift — the claim most likely to be wrong.** This ships on the research's reasoning that re-asserting cosine at the head improves precision@1, but step (b) of the proposal — "measure precision@1 on a labeled set" — has not been done. There is no labeled query→relevant-memory set yet, so whether the reorder actually helps (vs. merely changes ordering) is unverified. If it harms, set `SPECKIT_COSINE_TOPN_REORDER=false`.
2. **The head reorder overrides fusion-level signals at position 1.** Because it sorts purely by absolute cosine, signals that deliberately promote a lower-cosine result (degree/causal connectivity, recency, importance, cross-channel bonus) can no longer win position 1 within the top-10 once this is on. This is intentional per the research framing ("read the absolute signal, soften the gate"), but it is a real behavior change for those signals — the degree-fusion regression test was updated to reflect it.
3. **Reorder depth is a fixed constant (10), not configurable.** `COSINE_TOPN_REORDER_DEPTH` is a module constant. If the labeled-set measurement suggests a different head size, it needs a code change (or a follow-on flag), not an env var.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

