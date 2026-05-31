---
title: "Search Quality Tuning: Five Surgical Fixes for F-011-C1-01 through F-011-C1-05"
description: "Five findings from the deep-research loop closed in one commit: NDCG and MRR metrics added to the search-quality harness, the rerank gate floor lowered for weak-margin and disagreement triggers, the cross-encoder candidate cap enforced before provider calls, CocoIndex adaptive overfetch graduated behind a feature flag. The learned Stage 2 blend weight was promoted from permanent shadow mode."
trigger_phrases:
  - "F-011-C1 search quality"
  - "search quality tuning 008"
  - "ndcg mrr metrics harness"
  - "rerank gate floor weak-margin"
  - "cross-encoder maxDocuments cap"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/008-fix-search-quality-tuning` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

The search-quality subsystem had five orthogonal tuning gaps that the deep-research loop (packet 046, §11 C1) had flagged but left unresolved. The harness only reported precision@3 and recall@3, making it impossible to distinguish a top-1 hit from a top-3 hit. The conditional rerank gate hard-floored at four candidates, blocking three-candidate cases that had genuine ambiguity signals. The cross-encoder declared a per-provider `maxDocuments` cap but never enforced it, so providers silently received oversized payloads. The CocoIndex calibrator detected high duplicate density and logged a recommendation but never raised the live overfetch multiplier. The learned Stage 2 combiner ran in shadow mode indefinitely despite stable quality deltas.

Five surgical product-code fixes shipped together in commit `44f4020b985`. NDCG@K and MRR pure functions were added to `metrics.ts` and surfaced through `summarizeSearchQualityRun`, with a new test file covering NDCG@3, NDCG@10 and MRR boundary cases. The rerank gate floor was lowered to 2 only when a weak-margin or disagreement trigger fires, preserving the original floor=4 for all other trigger combinations and keeping the F-16 regression guard (`MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts`) untouched. The cross-encoder now slices the candidate list to the provider cap before the API call and appends the unranked tail with `scoringMethod: 'cross-encoder-tail'`. Adaptive CocoIndex overfetch was graduated behind `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH` (2x multiplier, default OFF) without changing the existing 4x adaptive flag. A clamped learned-blend weight (default 0.0, max 0.05) was wired into `stage2-fusion.ts` so the learned model can be opt-in promoted without becoming a steering wheel. All five changes are flag-gated or additive, so default CI behavior is unchanged.

### Added

- `ndcgAtK(candidates, relevantIds, k)` and `mrr(candidates, relevantIds)` pure functions in `metrics.ts`, surfaced as `ndcgAt3`, `ndcgAt10` and `mrr` fields on `SearchQualityMetricSummary` via `summarizeSearchQualityRun`
- `ndcg-mrr.vitest.ts` with unit tests covering NDCG@3 and NDCG@10 monotonicity and MRR boundary cases
- `cross-encoder-cap.vitest.ts` asserting the provider candidate cap path with a stubbed Voyage provider
- `isGraduatedCocoIndexOverfetchEnabled(env)` in `cocoindex-calibration.ts` reading `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH`
- `resolveLearnedBlendWeight()` in `stage2-fusion.ts` reading `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` (default 0.0, clamped to [0, 0.05])

### Changed

- `rerank-gate.ts`: candidate-count floor lowered from 4 to 2 when a weak-margin or disagreement trigger fires. Floor=4 preserved when only complex-query or high-authority triggers are present.
- `cross-encoder.ts`: candidate list sliced to `PROVIDER_CONFIG[provider].maxDocuments` before the API call. Tail appended in original order with `scoringMethod: 'cross-encoder-tail'`.
- `cocoindex-calibration.ts`: when the graduated flag is ON and duplicate density is at least 0.35, the overfetch multiplier is 2x. The existing adaptive 4x flag wins when both are set.
- `stage2-fusion.ts`: when `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT` is above 0 and a model loaded, the live result score blends `(1-w) * manual + w * learned`. Default 0.0 preserves shadow-only behavior.
- `w4-conditional-rerank.vitest.ts`: extended with a weak-margin 3-candidate gate-pass assertion and a backward-compatibility guard
- `w11-cocoindex-calibration-telemetry.vitest.ts`: extended with a graduated-overfetch flag assertion

### Fixed

- Rerank gate blocked valid 3-candidate reranks when weak-margin or disagreement triggers fired. The lowered floor closes this gap.
- Cross-encoder payloads exceeded provider limits silently. The pre-call slice enforces the cap and keeps the output row count stable.
- CocoIndex calibrator recorded adaptive-overfetch recommendations but never acted on them under the graduated path.

### Verification

| Check | Result |
|-------|--------|
| Commit scope | Five product files, two new test files, two extended test files. One commit `44f4020b985` on `origin main` |
| `validate.sh --strict` (this packet) | exit 0 |
| `npx vitest run stress_test/search-quality/` | exit 0, 18 files / 61 tests |
| `npm run stress` (full regression) | exit 0, 58 files / 195 tests (exceeds 56/163 baseline) |
| F-16 regression guard | `MIN_RESULTS_FOR_RERANK = 4` in `stage3-rerank.ts` unchanged |
| Inline finding markers | Five distinct `// F-011-C1-NN:` markers present at edit sites |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/stress_test/search-quality/metrics.ts` | Modified | F-011-C1-01: NDCG@K and MRR pure functions. `summarizeSearchQualityRun` extended with ndcgAt3, ndcgAt10, mrr fields. Existing outputs unchanged. |
| `mcp_server/stress_test/search-quality/ndcg-mrr.vitest.ts` (NEW) | Created | F-011-C1-01: unit tests for NDCG@3, NDCG@10 monotonicity and MRR boundaries |
| `mcp_server/lib/search/rerank-gate.ts` | Modified | F-011-C1-02: weak-margin and disagreement triggers lower the floor to 2. Other trigger combinations keep floor=4. |
| `mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts` | Modified | F-011-C1-02: 3-candidate weak-margin gate-pass assertion and backward-compat guard |
| `mcp_server/lib/search/cross-encoder.ts` | Modified | F-011-C1-03: provider maxDocuments enforced before API call. Tail appended with cross-encoder-tail discriminator. |
| `mcp_server/stress_test/search-quality/cross-encoder-cap.vitest.ts` (NEW) | Created | F-011-C1-03: cap path assertion with stubbed Voyage provider |
| `mcp_server/lib/search/cocoindex-calibration.ts` | Modified | F-011-C1-04: SPECKIT_COCOINDEX_GRADUATED_OVERFETCH flag. 2x multiplier when ON and duplicate density at least 0.35. Existing 4x flag wins when both set. |
| `mcp_server/stress_test/search-quality/w11-cocoindex-calibration-telemetry.vitest.ts` | Modified | F-011-C1-04: graduated-flag assertion |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | F-011-C1-05: SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT read and clamped to [0, 0.05]. Blend applied only when weight above 0 and model loaded. |

### Follow-Ups

- Flip `SPECKIT_COCOINDEX_GRADUATED_OVERFETCH` to ON by default once multi-week production telemetry confirms the 2x multiplier stays within the latency budget.
- Raise the learned-blend default above 0.0 once stress-quality deltas trend stable across a broader query corpus.
- Wire NDCG@3 threshold assertions into specific W-tests once per-fixture targets are established from production data.
- Consider a paginated rerank pattern for `cross-encoder.ts` for users with candidate sets wider than the provider maxDocuments window.
