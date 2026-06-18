---
title: "Request-Quality Aggregation: A Strong Top Hit Earns Citable On Its Own"
description: "assessRequestQuality stopped dragging a strong, clearly-best result down to weak because of a mediocre tail. A top score at or above 0.8 now reads good on its own, a top at or above 0.7 reads good when the quality ratio holds OR the top margin is wide, and the ratio is capped at the head so pulling more candidates for recall no longer depresses the verdict."
trigger_phrases:
  - "002/017/002 request quality aggregation changelog"
  - "top-dominant margin-aware good verdict"
  - "strong top hit earns citable"
  - "recall expansion no longer depresses quality"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/002-request-quality-aggregation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

A search that returned one strong, clearly-best memory was reading `weak` and earning `do_not_cite`, dragged down by a weaker tail. The `assessRequestQuality` verdict gated `good` on `topScore >= 0.7 AND qualityRatio >= 0.6`, where the ratio was computed over the whole result set. That coupling had two bad effects. A strong top hit sitting above a mediocre tail failed the ratio test even though the top was citable on its own. And pulling more candidates for recall mechanically lowered the ratio, so the recall improvement fought the quality verdict. This phase splits the verdict into a top-dominant rule and a margin-aware rule, and caps the quality ratio at the head so recall expansion stops depressing it. A top score at or above 0.8 now reads `good` regardless of the tail. A top at or above 0.7 reads `good` when the quality ratio holds OR the top margin (the absolute-relevance gap between the first and second result) is at least 0.15. The margin reuses the existing cosine-calibrated score that `topScore` already reads, so the two are on one scale.

### Changed

- `lib/search/confidence-scoring.ts` - `assessRequestQuality` now returns `good` for a top-dominant hit (`topScore >= 0.8`) or a margin-aware hit (`topScore >= 0.7` with `qualityRatio >= 0.6` OR `topMargin >= 0.15`), with `qualityRatio` computed over the head rather than the full set

### Fixed

- A single strong result no longer reads `weak` because of a weaker tail
- Expanding the candidate set for recall no longer lowers the quality verdict
- `topMargin` and `topScore` now read the same cosine-calibrated score rather than two different scales

### Verification

| Check | Result |
|-------|--------|
| Phase suite | PASS: `request-quality-aggregation.vitest.ts` |
| Touched-surface sweep | PASS: 12 files green including the confidence-scoring suites |
| Live verdict on the original queries | DEFERRED: needs a daemon recycle plus the deferred reindex |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts` | Added |

> Note: the `confidence-scoring.ts` production hunk landed in the same commit as phase `004` (`0fb87eb78a`). This entry documents the request-quality work as its own phase.

### Follow-Ups

- The aggregation thresholds (0.8 top-dominant, 0.15 margin) are reasoned from the observed score distribution, not yet tuned against a labeled set. The labeled-set follow-up tracked under phase `004` would let these be fit rather than chosen.
