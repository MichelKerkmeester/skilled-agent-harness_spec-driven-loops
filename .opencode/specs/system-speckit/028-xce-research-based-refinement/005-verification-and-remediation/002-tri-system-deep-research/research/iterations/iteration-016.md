# Iteration 016 — Angle 16

**Angle:** why_ranked consistency: finalRankScore trio alignment across formatters and trace surfaces after the remediation.

**Summary:** The folder-boost and post-dedup remediation closed the original rank-field defects, but finalRankScore is still not applied uniformly across all post-pipeline reorder paths or all formatter/debug surfaces.

**Findings kept:** 3

## [P1][BUG] Goal refinement can reintroduce why_ranked score/order drift

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:376-393 boosts score and re-sorts; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1252-1263 applies goal refinement but stamps finalRankScore only when folderBoostRankingApplied; .opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts:152-167 prefers finalRankScore/intentAdjustedScore/rrfScore before score.
- Detail: The remediation covers folder boost by stamping finalRankScore, but the default-on session goal refinement path can also mutate score and reorder results. If rows still carry rrfScore or intentAdjustedScore, why_ranked.effectiveScore can describe the pre-refinement score while why_ranked.rank describes the post-refinement order.
- Fix sketch: Stamp finalRankScore after any post-pipeline reorder, not only after folder boost, or have goal refinement update the same canonical ranking intermediate that why_ranked reads.

## [P2][BUG] Post-dedup reconciliation leaves finalRank effectiveScore stale

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:640-644 computes finalRankScore from the current list length; :710-715 only renumbers why_ranked.rank; :1454-1457 and :1492-1508 call that reconciler after post-format dedup. Regression at .opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:426-430 asserts rank/warnings only.
- Detail: When folder boost stamps finalRankScore and later session dedup removes earlier rows, the surviving why_ranked.rank is repaired but why_ranked.effectiveScore with scoreSource finalRank still reflects the pre-filter list. The order may remain monotonic, but the finalRank trio is not truly final for the delivered response.
- Fix sketch: In reconcilePostFormatResultSet, recompute why_ranked.effectiveScore for scoreSource finalRank using the surviving result count and index.

## [P2][BUG] Result explainability drops finalRankScore before debug scoring

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1261-1263 stamps finalRankScore before formatting; .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:834-857 builds formattedResult without finalRankScore/sourceScores and :1103-1108 runs attachExplainabilityToResults on those formatted rows; .opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:227-229 and :317-319 compute debug channelContribution from resolveEffectiveScore(row).
- Detail: why_ranked sees raw rows with finalRankScore, but the sibling result explainability surface is computed after the formatter has discarded that field. For folder-boosted final rankings, debug why.channelContribution can therefore be derived from fallback formatted fields rather than the same finalRank score used by why_ranked.
- Fix sketch: Either propagate finalRankScore and ranker intermediates into the formatted row before explainability, or attach explainability before narrowing the raw result shape.
