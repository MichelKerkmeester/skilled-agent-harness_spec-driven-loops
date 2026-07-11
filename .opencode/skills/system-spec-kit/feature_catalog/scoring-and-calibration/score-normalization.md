---
title: "Score normalization"
description: "Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale."
trigger_phrases:
  - "score normalization"
  - "SPECKIT_SCORE_NORMALIZATION"
  - "min-max normalization RRF composite"
  - "normalizeRrfScores normalizeCompositeScores"
  - "retrieval score comparable scale"
version: 3.6.0.15
---

# Score normalization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale.

Different search methods produce scores on different scales, like comparing grades from different schools. This feature puts all scores on the same 0-to-1 scale so they can be compared fairly before picking the best results. Without it, one method might always win just because its numbers happen to be bigger, not because its results are actually better.

---

## 2. HOW IT WORKS

Before normalization, RRF and composite scoring used different raw scales. In `shared/algorithms/rrf-fusion.ts`, RRF uses `1 / (k + rank)` with `DEFAULT_K = 60`, so a top-ranked per-source contribution starts near `1/61 ~= 0.016` and decays by rank (with convergence bonuses potentially pushing combined raw scores above `0.1`). Composite scoring already operates in a `0-1` band.

Min-max normalization now maps both outputs to `0-1`, letting relevance signals compete on comparable scale instead of whichever subsystem emits larger raw magnitudes. Single-result queries and equal-score edge cases normalize to `1.0`.

Normalization is batch-relative (the same spec-doc record can score differently across different queries), which is expected for min-max. Runtime gating uses `SPECKIT_SCORE_NORMALIZATION`: `isScoreNormalizationEnabled()`/`normalizeRrfScores()` in `shared/algorithms/rrf-fusion.ts` and `isCompositeNormalizationEnabled()`/`normalizeCompositeScores()` in `mcp_server/lib/scoring/composite-scoring.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking |
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Automated test | Access tracker extended |
| `mcp_server/tests/access-tracker.vitest.ts` | Automated test | Access tracker tests |
| `mcp_server/tests/composite-scoring.vitest.ts` | Automated test | Composite scoring tests |
| `mcp_server/tests/folder-scoring.vitest.ts` | Automated test | Folder scoring tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Automated test | Importance tier tests |
| `mcp_server/tests/interference.vitest.ts` | Automated test | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Automated test | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Automated test | Score normalization tests |
| `mcp_server/tests/scoring-observability.vitest.ts` | Automated test | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | Automated test | General scoring tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Automated test | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Automated test | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Automated test | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Automated test | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Automated test | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Automated test | Transaction metric types |

### Score Normalization Traceability

| Behavior | Implementing source | Validating test |
|----------|----------------------|-----------------|
| RRF normalization gate and transform (`SPECKIT_SCORE_NORMALIZATION`, `isScoreNormalizationEnabled`, `normalizeRrfScores`) | `shared/algorithms/rrf-fusion.ts` | `mcp_server/tests/score-normalization.vitest.ts` |
| Cross-variant RRF normalization path | `shared/algorithms/rrf-fusion.ts` (`fuseResultsCrossVariant`) | `mcp_server/tests/score-normalization.vitest.ts` |
| Composite normalization gate and transform (`isCompositeNormalizationEnabled`, `normalizeCompositeScores`) | `mcp_server/lib/scoring/composite-scoring.ts` | `mcp_server/tests/score-normalization.vitest.ts` |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `scoring-and-calibration/score-normalization.md`
Related references:
- [interference-scoring.md](interference-scoring.md) — Interference scoring
