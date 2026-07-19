---
title: "Double intent weighting investigation"
description: "Documents the pipeline trace confirming that dual intent weight systems (channel-level in adaptive fusion, attribute-level in intent classifier) are intentional and non-overlapping by design through the `isHybrid` gate."
trigger_phrases:
  - "double intent weighting investigation"
  - "isHybrid gate intent weights"
  - "dual intent weight systems"
  - "INTENT_WEIGHT_PROFILES adaptive fusion"
  - "intent weighting double-count prevention"
version: 3.6.0.16
---

# Double intent weighting investigation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the pipeline trace confirming that dual intent weight systems (channel-level in adaptive fusion, attribute-level in intent classifier) are intentional and non-overlapping by design through the `isHybrid` gate.

This investigation checked whether the system was accidentally applying the same scoring adjustment twice, which would be like getting double-taxed. It turns out the two adjustments work at different levels on purpose: one controls which search methods contribute to results and the other controls how result qualities are weighed afterward. They do not overlap, so no fix was needed.

## 2. HOW IT WORKS

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

## 3. SOURCE FILES

### HYBRID PIPELINE TRACE (ISHYBRID GATE PATH)

1. `hybrid-search.ts` classifies query intent and applies System A channel fusion with `hybridAdaptiveFuse(...)` for hybrid retrieval (`mcp-server/lib/search/hybrid-search.ts`).
2. Stage 2 receives `searchType: 'hybrid'` and computes `const isHybrid = config.searchType === 'hybrid'` (`mcp-server/lib/search/pipeline/stage2-fusion.ts`).
3. The System B branch is explicitly gated: `if (!isHybrid && config.intentWeights) { ... }`.
4. For hybrid requests, `!isHybrid` is `false`, so `applyIntentWeightsToResults(...)` does not run in Stage 2.
5. Result: hybrid path uses System A in fusion, while System B is skipped, preventing double-weighting by control-flow design.

---

### REGRESSION COVERAGE

The no-double-weighting behavior is validated by `mcp-server/tests/intent-weighting.vitest.ts`, especially the `T017-G2: Weights Not Double-Counted in Pipeline` suite. The Stage 2 contract also tracks G2 guard metadata (`intentWeightsApplied`) in `mcp-server/tests/pipeline-v2.vitest.ts` (`R6-T24`).

---

### SOURCE/TEST TRACEABILITY

| Claim | Source | Test |
|------|--------|------|
| System A uses channel-level weights | `shared/algorithms/adaptive-fusion.ts` (`INTENT_WEIGHT_PROFILES`, `hybridAdaptiveFuse`) | `mcp-server/tests/intent-weighting.vitest.ts` |
| System B uses attribute-level weights | `mcp-server/lib/search/intent-classifier.ts` (`INTENT_WEIGHT_ADJUSTMENTS`) | `mcp-server/tests/intent-weighting.vitest.ts` |
| Hybrid path skips Stage 2 System B weighting | `mcp-server/lib/search/pipeline/stage2-fusion.ts` (`isHybrid` + `if (!isHybrid && config.intentWeights)`) | `mcp-server/tests/intent-weighting.vitest.ts`, `mcp-server/tests/pipeline-v2.vitest.ts` |

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring-and-calibration/double-intent-weighting-investigation.md`

### SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/intent-classifier.ts` | Lib | Intent detection |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/intent-classifier.vitest.ts` | Automated test | Intent classification accuracy |
| `mcp-server/tests/intent-weighting.vitest.ts` | Automated test | Regression coverage for no double-counting (T017-G2) |
| `mcp-server/tests/pipeline-v2.vitest.ts` | Automated test | Stage 2 contract includes G2 guard metadata (`intentWeightsApplied`) |
Related references:
- [embedding-cache.md](../../feature-catalog/scoring-and-calibration/embedding-cache.md) — Embedding cache
- [rrf-k-value-sensitivity-analysis.md](../../feature-catalog/scoring-and-calibration/rrf-k-value-sensitivity-analysis.md) — RRF K-value sensitivity analysis
