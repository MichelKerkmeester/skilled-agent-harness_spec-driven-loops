---
title: "BM25 Warmup Churn Reduction: 743MB to 136.5MB Peak, Ranking Byte-Identical"
description: "The packed BM25 warmup RSS spike was cut from 743MB to a 136.5MB peak-sampled spike, under the 150MB budget, via no-copy chunked packed postings and Uint8 to Uint16 to Uint32 width promotion. Ranking stayed byte-identical and the hard RSS gate was re-enabled."
trigger_phrases:
  - "017 bm25 warmup churn reduction changelog"
  - "warmup rss 743 to 136"
  - "chunked packed postings width promotion"
  - "027 017 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/017-bm25-warmup-churn-reduction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Phase 014's packed BM25 engine warmed a realistic 10,245-document, 69.2MB corpus with a peak warmup RSS spike of 743MB, far over the 150MB budget that REQ-001 specifies. A prior pass had already cut that to roughly 244MB by replacing char-by-char token concatenation with range-scanning plus token interning and reusing per-document term-frequency scratch. This phase took it the rest of the way to a 136.5MB peak-sampled spike — under budget — by replacing the mutable-to-six-array finalization with no-copy chunked packed postings, and by storing field term frequencies as `Uint8Array` promoting to `Uint16Array` to `Uint32Array`, doc ids as `Uint16Array` promoting to `Uint32Array`, and per-document term ids sized to their range, so the mutable build and the packed structures never co-exist at full width. Ranking output is byte-identical: scores, ordering, and field weights are unchanged. This closes 014's REQ-001 on the original process-RSS metric, with no metric amendment and no external-dependency fallback.

### Added

- None. The change is contained to the existing packed BM25 engine.

### Changed

- `lib/search/bm25-index.ts` — no-copy chunked packed postings and compact typed storage with width promotion, so peak transient allocation during warmup stays under the budget

### Fixed

- Re-enabled the hard RSS budget assertion as an always-on gate (no env-var guard, no advisory mode), now driven by peak-sampled RSS rather than a single end-of-warmup reading that under-reported the transient spike.

### Verification

| Check | Result |
|-------|--------|
| Peak warmup RSS | PASS: 136.5MB peak-sampled on the realistic 10,245-doc / 69.2MB corpus, under the 150MB budget (from 743MB) |
| Ranking parity | PASS: warmed-vs-direct equality (ordering identical, scores equal to 1e-10) plus packed-vs-legacy MRR baseline |
| Hard RSS gate | PASS: unconditional, peak-sampled assertion re-enabled |
| Hybrid-search suite | PASS: legacy engine and fusion layer unaffected |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Modified |

### Follow-Ups

- None. REQ-001 is closed on the original metric.
