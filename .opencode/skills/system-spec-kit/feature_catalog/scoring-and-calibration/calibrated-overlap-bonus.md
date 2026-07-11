---
title: "Calibrated overlap bonus"
description: "Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the SPECKIT_CALIBRATED_OVERLAP_BONUS flag."
trigger_phrases:
  - "calibrated overlap bonus"
  - "SPECKIT_CALIBRATED_OVERLAP_BONUS"
  - "query-aware overlap bonus RRF"
  - "convergence bonus calibrated scaling"
  - "multi-channel retrieval agreement reward"
version: 3.6.0.5
---

# Calibrated overlap bonus

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the `SPECKIT_CALIBRATED_OVERLAP_BONUS` flag.

When multiple retrieval channels (vector, BM25, graph) all return the same result, the system rewards that agreement with a bonus score. The flat bonus gives a fixed reward regardless of how strong the agreement is. This calibrated version scales the reward based on how many channels agree and how strongly they scored the result. The bonus is capped at `CALIBRATED_OVERLAP_MAX = 0.06` to prevent any single overlap bonus from dominating the fused ranking.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_CALIBRATED_OVERLAP_BONUS=false` to revert to the flat convergence bonus.

The `isCalibratedOverlapBonusEnabled()` function in `rrf-fusion.ts` checks the flag. When enabled, the `fuseResultsMulti()` function computes a query-aware overlap bonus using `CALIBRATED_OVERLAP_BETA = 0.15` as the scaling factor and the mean normalized top score across channels. The bonus is clamped to `CALIBRATED_OVERLAP_MAX = 0.06`. When disabled, the standard flat `CONVERGENCE_BONUS = 0.10` is applied instead.

Key constants: `CALIBRATED_OVERLAP_BETA = 0.15`, `CALIBRATED_OVERLAP_MAX = 0.06`, `CONVERGENCE_BONUS = 0.10` (flat fallback).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/algorithms/rrf-fusion.ts` | Shared | `isCalibratedOverlapBonusEnabled()`, calibrated bonus computation in `fuseResultsMulti()` |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/calibrated-overlap-bonus.vitest.ts` | Automated test | Calibrated overlap bonus behavior and flag gating |
| `mcp_server/tests/rrf-fusion.vitest.ts` | Automated test | RRF fusion integration tests |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | Automated test | RRF fusion unit tests |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `scoring-and-calibration/calibrated-overlap-bonus.md`
Related references:
- [shadow-feedback-holdout-evaluation.md](shadow-feedback-holdout-evaluation.md) — Shadow scoring with holdout evaluation
- [rrf-k-experimental.md](rrf-k-experimental.md) — RRF K experimental tuning
