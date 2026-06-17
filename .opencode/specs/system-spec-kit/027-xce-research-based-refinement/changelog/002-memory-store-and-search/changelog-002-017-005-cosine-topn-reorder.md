---
title: "Cosine Top-N Reorder: Stable Head Reorder by Absolute Relevance"
description: "The head of the result list is reordered by absolute cosine relevance so the most relevant result sits first, behind SPECKIT_COSINE_TOPN_REORDER default-ON. The reorder is stable, head-only (N of 10), runs after the budget trim, preserves membership and length, and is fully reversible. No model, LLM call or cross-encoder was added."
trigger_phrases:
  - "002/017/005 cosine topn reorder changelog"
  - "stable head reorder absolute relevance"
  - "SPECKIT_COSINE_TOPN_REORDER default on"
  - "no reranker cosine head reorder"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

Fusion ordering does not always put the single most-relevant result first, because the RRF and RSF blend rewards agreement across channels over raw closeness. This phase adds a light, late, head-only reorder that sorts the top results by absolute cosine relevance so the closest match sits first. The reorder is stable (it preserves the original order on ties), head-only (it touches at most the first ten results), and runs after `truncateToBudget` so it reorders only what will actually render. It preserves both membership and length, so it changes order without adding, dropping or duplicating a result. The behavior is gated behind `SPECKIT_COSINE_TOPN_REORDER`, default-ON because the research grades it low-risk, and fully reversible by setting the flag to false. No model, LLM call or cross-encoder was added, which is the deliberate boundary the research and the operator both drew.

### Added

- `reorderTopNByCosine` (N of 10, stable, membership and length preserving) in `hybrid-search.ts`
- `isCosineTopnReorderEnabled()` in `search-flags.ts` (default-ON via `isFeatureEnabled`)

### Changed

- `lib/search/hybrid-search.ts` - the rendered head is reordered by absolute cosine relevance after the budget trim, behind the flag

### Verification

| Check | Result |
|-------|--------|
| Phase suite | PASS: `cosine-topn-reorder.vitest.ts` (promotion, tie stability, length and membership invariants, head-only scope, lexical fallback, flag default-ON and reversible) |
| Touched-surface sweep | PASS: 12 files green including `hybrid-search` |
| Reversibility | CONFIRMED: `SPECKIT_COSINE_TOPN_REORDER=false` restores fusion order |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts` | Added |

### Follow-Ups

- A cross-encoder reranker remains explicitly out of scope per the operator decision. The research framed it as an only-if-a-gap-remains path, not this phase.
