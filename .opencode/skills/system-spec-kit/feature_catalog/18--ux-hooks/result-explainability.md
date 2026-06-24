---
title: "Two-tier result explainability"
description: "Two-tier result explainability attaches natural-language 'why' explanations to each search result composed from Stage 2 scoring signals, with a slim tier (summary + topSignals) and an optional debug tier (channelContribution map), gated by the SPECKIT_RESULT_EXPLAIN flag."
trigger_phrases:
  - "two-tier result explainability"
  - "SPECKIT_RESULT_EXPLAIN"
  - "why explanations search results"
  - "channelContribution"
  - "result scoring explainability"
version: 3.6.0.7
---

# Two-tier result explainability

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Two-tier result explainability attaches natural-language "why" explanations to each search result composed from Stage 2 scoring signals, with a slim tier (summary + topSignals) and an optional debug tier (channelContribution map), gated by the `SPECKIT_RESULT_EXPLAIN` flag.

When you get search results, you often want to know why each result ranked where it did. This feature adds a "why" field to every result with a human-readable summary and the most influential scoring signals. The slim tier is lightweight and always present when the flag is on. If you need deeper inspection, the debug tier adds a per-channel score breakdown showing exactly how much each retrieval channel contributed. It is like getting a receipt that itemizes each scoring decision.

---

## 2. HOW IT WORKS

### Core Behavior

The explainability module extracts active scoring signals from each `PipelineRow`, detecting: `semantic_match`, `lexical_match` (FTS/BM25 channel attribution), `graph_boosted` / `causal_boosted` / `community_boosted` (from `graphContribution`), `session_boosted` (from `sessionBoost`), `feedback_boosted` (learned trigger boost), `validation_quality` (quality score > 0.7), and `anchor:*` labels from anchor metadata.

The output shape per result:
```
{
  "why": {
    "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
    "topSignals": ["semantic_match", "anchor:decisions"],
    "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
  }
}
```

The `channelContribution` map (with `vector`, `fts`, `graph` breakdowns) is only included when `debugEnabled = true`. Top signals are limited to 2-4 unique labels, prioritizing semantic/lexical first, then boosts, then meta. Summary is composed as a natural-language sentence from the top signals and result rank.

### Configuration

No-op when `SPECKIT_RESULT_EXPLAIN` is not set. Default ON (graduated), controlled by `SPECKIT_RESULT_EXPLAIN`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/result-explainability.ts` | Lib | Signal extraction, top signal selection, summary composition, debug channel contribution |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | `PipelineRow` type and `resolveEffectiveScore()` helper |
| `mcp_server/lib/search/search-flags.ts` | Lib | Flag accessor (pattern, not direct export) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/search-flags.vitest.ts` | Automated test | Flag behavior for result explainability |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/result-explainability.md`
Related references:
- [end-to-end-success-envelope-verification.md](end-to-end-success-envelope-verification.md) — End-to-end success-envelope verification
- [mode-aware-response-profiles.md](mode-aware-response-profiles.md) — Mode-aware response profiles
