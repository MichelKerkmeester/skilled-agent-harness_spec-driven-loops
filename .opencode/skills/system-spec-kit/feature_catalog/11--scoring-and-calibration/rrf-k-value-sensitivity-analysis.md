---
title: "RRF K-value sensitivity analysis"
description: "Documents the grid search over K values [10, 20, 40, 60, 80, 100, 120] that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation."
trigger_phrases:
  - "RRF K-value sensitivity analysis"
  - "reciprocal rank fusion K parameter"
  - "MRR@5 Kendall tau K grid search"
  - "RRF K empirical grounding"
  - "K value rank fusion tuning"
version: 3.6.0.14
---

# RRF K-value sensitivity analysis

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the grid search over K values [10, 20, 40, 60, 80, 100, 120] that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation.

When combining results from different search methods, a single tuning knob controls how much "being ranked first" matters versus "appearing in multiple lists." This analysis tested seven different settings for that knob and measured which one produced the best results. Before this work, the setting was chosen by gut feeling. Now it is chosen by data.

---

## 2. HOW IT WORKS

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values [10, 20, 40, 60, 80, 100, 120] measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/k-value-analysis.ts` | Lib | RRF k-value sensitivity analysis |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/rrf-fusion.vitest.ts` | Automated test | RRF fusion validation |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | Automated test | RRF unit tests |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `11--scoring-and-calibration/rrf-k-value-sensitivity-analysis.md`
Related references:
- [double-intent-weighting-investigation.md](double-intent-weighting-investigation.md) — Double intent weighting investigation
- [negative-feedback-confidence-signal.md](negative-feedback-confidence-signal.md) — Negative feedback confidence signal
