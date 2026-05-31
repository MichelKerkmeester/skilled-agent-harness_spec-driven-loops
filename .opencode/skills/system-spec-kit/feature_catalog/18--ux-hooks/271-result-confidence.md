---
title: "Result confidence scoring"
description: "Result confidence scoring combines margin, multi-channel agreement, reranker support, and anchor density into a single calibrated confidence score per search result, using heuristic scoring with no LLM calls in the hot path, gated by the SPECKIT_RESULT_CONFIDENCE_V1 flag."
trigger_phrases:
  - "result confidence scoring"
  - "SPECKIT_RESULT_CONFIDENCE_V1"
  - "confidence score per result"
  - "multi-channel agreement scoring"
  - "anchor density confidence"
---

# Result confidence scoring

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Result confidence scoring combines margin, multi-channel agreement, reranker support, and anchor density into a single calibrated confidence score per search result, using heuristic scoring with no LLM calls in the hot path, gated by the `SPECKIT_RESULT_CONFIDENCE_V1` flag.

When search results come back, you want to know how confident the system is in each result. This feature computes a per-result confidence score from four factors: how far ahead the result is from the next one (margin), how many retrieval channels agree on it (multi-channel agreement), whether the reranker supports it, and how rich its anchor metadata is. Each result gets a label (high, medium, low) and a numeric score, plus a list of the factors that drove the confidence assessment.

---

## 2. HOW IT WORKS

### Core Behavior

Enabled by default (graduated). Set `SPECKIT_RESULT_CONFIDENCE_V1=false` to disable.

The confidence scoring module (`confidence-scoring.ts`) computes a weighted composite score from four factors:

| Factor | Weight | Threshold |
|--------|--------|-----------|
| Margin (gap to next result) | 0.35 | Large: > 0.15, Small: > 0.05 |
| Channel agreement | 0.30 | Strong: >= 2 channels |
| Reranker support | 0.20 | Binary presence |
| Anchor density | 0.15 | Continuous |

### Scoring & Ranking

The composite score maps to labels via: `HIGH_THRESHOLD = 0.7`, `LOW_THRESHOLD = 0.4`. Each result also carries a `requestQuality` label (`good`, `weak`, `gap`) computed across all results.

Confidence drivers (`large_margin`, `multi_channel_agreement`, `anchor_density`) are reported per result, enabling the calling agent to explain why a result was rated as it was.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/confidence-scoring.ts` | Lib | Per-result confidence computation, weighted factor scoring, label assignment, driver detection |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/d5-confidence-scoring.vitest.ts` | Automated test | Confidence scoring, label thresholds, driver detection, flag gating |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/271-result-confidence.md`
Related references:
- [270-empty-result-recovery.md](270-empty-result-recovery.md) — Empty result recovery
- [272-result-provenance.md](272-result-provenance.md) — Result provenance (graph evidence)
