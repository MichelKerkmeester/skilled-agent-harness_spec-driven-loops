---
title: "Packed In-Memory BM25 Engine With BM25F Field Weights"
description: "The memory-hungry lexical fallback was replaced by a packed in-memory BM25 engine with typed-array postings and restored BM25F per-field weighting, so title and trigger matches outrank body noise, with packed ranking meeting or beating the legacy engine on the baseline metrics."
trigger_phrases:
  - "002/009 packed bm25 field weights changelog"
  - "packed in-memory bm25 engine"
  - "bm25f field weighting restored"
  - "027 002/009 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/009-packed-bm25-field-weights` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The lexical fallback that backs search when the vector lane is unavailable was carrying a memory-hungry posting representation and had lost its per-field weighting. This phase replaced it with a packed in-memory BM25 engine: typed-array postings instead of object-per-token structures, and restored BM25F field weighting so a hit in a document title or trigger phrase ranks above the same term buried in body text. Ranking quality was held to the baseline gates: the packed engine meets or beats the legacy engine on the oracle metrics (MRR, NDCG, recall, hit rate), and intentionally differs from legacy where the restored title and trigger weighting is the point of the phase; byte-identical parity holds within the packed engine itself (warmed versus direct). The realistic-corpus re-validation then exposed a warmup RSS spike well over budget, which was carried as a finding and closed in phase 017.

### Added

- `lib/eval/fixtures/bm25-packed-fixture.ts` — realistic-corpus fixture for packed-engine ranking and warmup evaluation

### Changed

- `lib/search/bm25-index.ts` — packed in-memory engine with typed-array postings and BM25F per-field weighting
- `lib/eval/bm25-baseline.ts` — baseline harness compares the packed engine against the legacy engine for ranking parity
- `handlers/checkpoints.ts` — aligned with the packed-engine index shape

### Fixed

- Deep-review verdict moved from FAIL to CONDITIONAL after the warmup-finalize behavior was corrected and the realistic-fixture RAM finding was documented honestly rather than waved off.

### Verification

| Check | Result |
|-------|--------|
| Deep review | FAIL on first pass, CONDITIONAL after warmup-finalize fix |
| Ranking parity | PASS: packed meets-or-beats legacy on the baseline metrics; warmed-vs-direct packed output identical; the title/trigger weighting difference from legacy is by design |
| BM25F field weighting | PASS: title and trigger hits outrank body hits |
| Warmup RSS | OVER BUDGET at this phase, recorded as a finding and closed in phase 017 |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts` | Modified |

### Follow-Ups

- REQ-001 (warmup RSS under the 150MB budget) was unmet at this phase and was closed in phase 017 (bm25-warmup-churn-reduction) on the original process-RSS metric.
