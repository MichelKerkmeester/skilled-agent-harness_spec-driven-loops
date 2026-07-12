---
title: "Synthetic ground truth corpus"
description: "Describes the 110-query ground truth corpus covering all seven intent types with hand-written natural language queries, hard negatives and agent consumption findings for realistic retrieval evaluation."
trigger_phrases:
  - "synthetic ground truth corpus"
  - "ground truth corpus"
  - "110 query ground truth"
  - "hard negative queries evaluation"
  - "retrieval evaluation dataset"
version: 3.6.0.15
---

# Synthetic ground truth corpus

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the 110-query ground truth corpus covering all seven intent types with hand-written natural language queries, hard negatives and agent consumption findings for realistic retrieval evaluation.

To know if search results are right, you need an answer key. This is a collection of 110 test questions with known correct answers, written in everyday language rather than system keywords. It also includes trick questions designed to catch the system returning wrong results. Without this answer key, there would be no reliable way to measure whether changes actually improve or hurt search quality.

---

## 2. HOW IT WORKS

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters. If your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
| `mcp_server/lib/eval/ground-truth-generator.ts` | Lib | Synthetic ground truth generator |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/ground-truth.vitest.ts` | Automated test | Ground truth tests |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `evaluation_and_measurement/synthetic_ground_truth_corpus.md`
Related references:
- [quality-proxy-formula.md](quality_proxy_formula.md) — Quality proxy formula
- [bm25-only-baseline.md](bm25_only_baseline.md) — BM25-only baseline

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 010
