---
title: "Learned Stage 2 weight combiner"
description: "A regularized linear ranker that learns combination weights from accumulated Stage 2 signals, running in shadow-only mode behind the SPECKIT_LEARNED_STAGE2_COMBINER flag."
trigger_phrases:
  - "learned stage 2 weight combiner"
  - "SPECKIT_LEARNED_STAGE2_COMBINER"
  - "ridge regression stage 2 ranking"
  - "SHAP feature importance linear ranker"
  - "shadow-mode learned weight combiner"
version: 3.6.0.8
---

# Learned Stage 2 weight combiner

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A regularized linear ranker that learns combination weights from accumulated Stage 2 signals, running in shadow-only mode behind the `SPECKIT_LEARNED_STAGE2_COMBINER` flag.

The search pipeline combines scores from eight different sources (semantic, keyword overlap, graph signals, session context, causal boost, feedback, validation quality, and artifact routing). Currently these weights are set manually. This feature trains a linear model on actual usage data to find the optimal combination. It runs in shadow mode only — computing what would have happened with learned weights but never changing the real rankings. This lets operators validate the learned approach before committing to it.

---

## 2. HOW IT WORKS

### Core Behavior

The learned combiner uses Ridge Regression with an inline matrix math implementation (no external ML dependencies). The 8-feature canonical vector covers: `rrf`, `overlap`, `graph`, `session`, `causal`, `feedback`, `validation`, `artifact`. Each feature is clamped to [0, 1] via `extractFeatureVector()`.

Training uses the closed-form solution `w = (X^T X + lambda * I)^{-1} X^T y` with default regularization `DEFAULT_LAMBDA = 0.1`. The bias term is not regularized. Training requires at least 2 examples. The model includes R-squared on training data and is versioned (`MODEL_VERSION = 1`) for forward compatibility.

### Scoring & Ranking

Validation uses Leave-One-Out Cross-Validation (`runLOOCV()`), and feature importance is computed via SHAP-style analysis (`computeSHAP()`): `importance_i = |weight_i| * std(feature_i)`. Exact linear SHAP values are also available via `computeExactLinearSHAP()`.

Shadow scoring via `shadowScore()` returns both the learned and manual scores when a model is loaded and the flag is ON, or `null` with zero overhead when OFF or when no model is available. Model persistence uses `saveModel()` / `loadModel()` with JSON serialization and strict field validation.

### Configuration

Enabled by default (graduated). Set `SPECKIT_LEARNED_STAGE2_COMBINER=false` to disable the shadow scoring path entirely. However, producing shadow output at runtime requires two additional conditions: (1) `SPECKIT_SHADOW_LEARNING=true` must be set to enable model file loading (default OFF in `stage2-fusion.ts`), and (2) a trained model file must exist at the path resolved by `SPECKIT_LEARNED_STAGE2_MODEL` (defaults to `models/learned-stage2-combiner.json` relative to cwd). Without both, `shadowScore()` returns `null` and the feature is inert despite the flag being ON.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/ranking/learned-combiner.ts` | Shared | Ridge regression training, prediction, LOOCV, SHAP, shadow scoring, model persistence |
| `shared/index.ts` | Shared barrel | Exports `shadowScore`, `trainRegularizedLinearRanker`, `predict`, `extractFeatureVector` |
| `mcp-server/lib/search/pipeline/stage2-fusion.ts` | Pipeline | Calls `shadowScore()` after step 6 (feedback signals), gated by `isLearnedStage2CombinerEnabled()` |
| `mcp-server/lib/search/search-flags.ts` | Lib | `isLearnedStage2CombinerEnabled()` flag accessor |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/learned-combiner.vitest.ts` | Automated test | Training, prediction, LOOCV, SHAP, shadow scoring, model serialization, flag behavior |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring-and-calibration/learned-stage2-weight-combiner.md`
Related references:
- [adaptive-shadow-ranking-bounded-proposals-and-rollback.md](../../feature-catalog/scoring-and-calibration/adaptive-shadow-ranking-bounded-proposals-and-rollback.md) — Adaptive shadow ranking, bounded proposals, and rollback
- [shadow-feedback-holdout-evaluation.md](../../feature-catalog/scoring-and-calibration/shadow-feedback-holdout-evaluation.md) — Shadow scoring with holdout evaluation
