---
title: "Stage 3 effectiveScore fallback chain"
description: "Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and MMR candidate scoring."
trigger_phrases:
  - "stage 3 effectiveScore fallback chain"
  - "resolveEffectiveScore fallback"
  - "intentAdjustedScore rrfScore score fallback"
  - "MMR candidate scoring effectiveScore"
  - "stage2Score auditability pipeline"
---

# Stage 3 effectiveScore fallback chain

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and MMR candidate scoring.

A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.

---

## 2. HOW IT WORKS

`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. MMR candidate scoring now uses `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Pipeline | `effectiveScore()` alias for `resolveEffectiveScore()`, used in MMR candidate scoring |
| `mcp_server/lib/search/pipeline/types.ts` | Pipeline | `resolveEffectiveScore()` fallback chain implementation and `stage2Score` field on `PipelineRow` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/score-resolution-consistency.vitest.ts` | Automated test | resolveEffectiveScore fallback chain correctness |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Automated test | End-to-end pipeline behavior including Stage 3 scoring |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `11--scoring-and-calibration/112-stage-3-effectivescore-fallback-chain.md`
Related references:
- [111-scoring-and-ranking-corrections.md](111-scoring-and-ranking-corrections.md) — Scoring and ranking corrections
- [113-scoring-and-fusion-corrections.md](113-scoring-and-fusion-corrections.md) — Scoring and fusion corrections
