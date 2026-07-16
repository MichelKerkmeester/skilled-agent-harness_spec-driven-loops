---
title: "Request-Quality Aggregation — top-dominant + margin-aware verdict"
description: "assessRequestQuality now lets a strong, well-separated top hit read good even with a weak tail, and caps the quality ratio at the head so recall expansion stops depressing the verdict."
trigger_phrases:
  - "request quality"
  - "assessRequestQuality"
  - "top-dominant"
  - "margin-aware"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/002-request-quality-aggregation"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented top-dominant + margin-aware request-quality rule with head-capped quality ratio"
    next_safe_action: "Rebuild mcp_server dist so the runtime picks up the source change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017-002-request-quality-aggregation"
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
| **Spec Folder** | 002-request-quality-aggregation |
| **Completed** | 2026-06-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A search that returns one strong, clearly-best memory now reads `good` instead of being dragged to `weak` by a weaker tail. The request-quality verdict in `assessRequestQuality` was gated on `topScore >= 0.7 AND qualityRatio >= 0.6`, where the ratio was computed over the *whole* result set. That coupling meant a strong top hit (e.g. 0.751) sitting above a mediocre tail failed the ratio test, and — worse — pulling more candidates for recall mechanically lowered the ratio, so the recall improvement fought the quality verdict.

### Top-dominant + margin-aware "good"

The "good" rule is now a disjunction that respects a dominant top hit:

- **good (top-dominant)** when `topScore >= 0.8`, regardless of the tail. A hit this strong is citable on its own.
- **good** when `topScore >= 0.7` AND (`qualityRatio >= 0.6` OR `topMargin >= 0.15`), where `topMargin` is the absolute-relevance gap between result[0] and result[1] (reusing the existing `computeMargin` against `resolveCalibrationScore`, the same cosine-calibrated score topScore reads).
- **weak / gap** thresholds are unchanged, so a genuinely low-signal set still trips the do-not-cite safety net.

### Quality ratio capped at the ranking head

`qualityRatio` is now computed over `min(N, K)` with `K = 5` (named `QUALITY_RATIO_HEAD`) instead of the whole set. Expanding recall appends weaker tail candidates; counting them in the denominator would penalize a query for retrieving more, which is the opposite of what recall should do. Capping at the head decouples the quality verdict from result-set size.

Ordering is untouched — `resolveEffectiveScore` / `resolveAbsoluteRelevance` and the packet-015 absolute-relevance scale are not modified. Only the request-level verdict logic changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/confidence-scoring.ts` | Modified | Rewrote `assessRequestQuality` (top-dominant + margin-aware); added `TOP_DOMINANT_THRESHOLD = 0.8` and `QUALITY_RATIO_HEAD = 5` constants |
| `mcp_server/tests/request-quality-aggregation.vitest.ts` | Created | Focused coverage: good-via-margin, good-top-dominant, recall-expansion does not depress, weak preserved, gap preserved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Source-only change to the confidence-scoring module plus a new focused vitest file. Verified by typecheck and the targeted confidence/calibration/recovery suites; the packet-015 calibration regression (strong cosine matches must read `good`) stays green, confirming the new rule did not regress the prior fix. The runtime loads compiled `dist/`, so the change is not live until the module is rebuilt (deferred — out of this task's write scope).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `computeMargin` + `resolveCalibrationScore` for `topMargin` rather than a new margin path | Keeps the request-level margin on the same absolute (cosine) scale topScore already uses, and avoids duplicating the per-result margin logic |
| Cap the quality ratio at the head (`K=5`) instead of dropping the ratio entirely | A pure topScore gate would let a fluke high-cosine hit on a vague query read `good`; keeping the ratio-OR-margin guard preserves that protection while removing the recall-size coupling |
| Compute `qualityRatio` over the confidences slice, with a `head > 0` guard | `confidences` is parallel to `results`; slicing the confidence labels is the direct head measure, and the guard keeps a degenerate empty-confidences input at ratio 0 rather than NaN |
| Left `dist/` unbuilt | Allowed write paths and the no-build/no-commit constraint exclude `dist/`; rebuild belongs to the packet's build step |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (tsc --noEmit) | PASS — clean, no errors |
| `vitest run` targeted set (result-confidence-scoring, d5-confidence-scoring, absolute-relevance-calibration, empty-result-recovery, d5-recovery-payload) + new `request-quality-aggregation` | PASS — 6 files, 102 tests green |
| Packet-015 guard: `absolute-relevance-calibration.vitest.ts` strong-cosine → `good` | PASS — still green after the change |
| Declared pre-existing baseline (`token-budget-enforcement` 1500-vs-1000, `reconsolidation` 9) | Untouched — not in scope, not chased |
| `dist-freshness.vitest.ts` ("no lib/**/*.ts is newer than its compiled dist") | FAIL — caused by editing the source without rebuilding `dist/` (build deferred per task constraint); resolves with `npm run build` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime not yet live.** The MCP/daemon path executes compiled `dist/`. This source change takes effect only after `npm run build` (intentionally not run — outside the allowed write paths and the no-build constraint). `dist-freshness.vitest.ts` will stay red until then.
2. **`topMargin` is a result[0]-vs-result[1] gap only.** A query whose top two hits are both strong and near-equal (small margin) relies on the `qualityRatio >= 0.6` disjunct, not margin, to reach `good` — which is the intended behavior.
3. **Full-suite baseline on this branch is dirty.** Running the entire suite surfaces unrelated WIP failures (scaffold-golden-snapshots, phase-parent-pointer, handler-memory-index-needs-rebuild, trigger-setAttentionScore, etc.). None import `confidence-scoring`; they are pre-existing on this working tree and out of scope.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
