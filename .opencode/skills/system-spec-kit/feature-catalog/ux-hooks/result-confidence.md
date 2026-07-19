---
title: "Result confidence scoring"
description: "Result confidence scoring combines margin, multi-channel agreement, and anchor density into a single calibrated confidence score per search result, using heuristic scoring with no LLM calls in the hot path, gated by the SPECKIT_RESULT_CONFIDENCE flag."
trigger_phrases:
  - "result confidence scoring"
  - "SPECKIT_RESULT_CONFIDENCE"
  - "confidence score per result"
  - "multi-channel agreement scoring"
  - "anchor density confidence"
version: 3.6.0.8
---

# Result confidence scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Result confidence scoring combines margin, multi-channel agreement, and anchor density into a single calibrated confidence score per search result, using heuristic scoring with no LLM calls in the hot path, gated by the `SPECKIT_RESULT_CONFIDENCE` flag.

When search results come back, you want to know how confident the system is in each result. This feature computes a per-result confidence score from three factors: how far ahead the result is from the next one (margin), how many retrieval channels agree on it (multi-channel agreement), and how rich its anchor metadata is. Each result gets a label (high, medium, low) and a numeric score, plus a list of the factors that drove the confidence assessment.

---

## 2. HOW IT WORKS

### Core Behavior

Enabled by default (graduated). Set `SPECKIT_RESULT_CONFIDENCE=false` to disable.

The confidence scoring module (`confidence-scoring.ts`) computes a weighted composite score from three factors:

| Factor | Weight | Threshold |
|--------|--------|-----------|
| Margin (gap to next result) | 0.35 | Large: > 0.15, Small: > 0.05 |
| Channel agreement | 0.30 | Strong: >= 2 channels |
| Anchor density | 0.15 | Continuous |

### Scoring & Ranking

The composite score maps to labels via: `HIGH_THRESHOLD = 0.7`, `LOW_THRESHOLD = 0.4`. Each result also carries a `requestQuality` label (`good`, `weak`, `gap`) computed across all results.

Confidence drivers (`large_margin`, `multi_channel_agreement`, `anchor_density`) are reported per result, enabling the calling agent to explain why a result was rated as it was.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/confidence-scoring.ts` | Lib | Per-result confidence computation, weighted factor scoring, label assignment, driver detection |
| `mcp-server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/d5-confidence-scoring.vitest.ts` | Automated test | Confidence scoring, label thresholds, driver detection, flag gating |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/result-confidence.md`
Related references:
- [empty-result-recovery.md](../../feature-catalog/ux-hooks/empty-result-recovery.md) — Empty result recovery
- [result-provenance.md](../../feature-catalog/ux-hooks/result-provenance.md) — Result provenance (graph evidence)
