---
title: "Causal graph boost (graduated default-ON)"
description: "Causal graph traversal boost amplifies search results related to top-ranked seeds via weighted 2-hop CTE walk, gated by SPECKIT_CAUSAL_BOOST (default true, graduated)."
trigger_phrases:
  - "causal graph boost"
  - "SPECKIT_CAUSAL_BOOST"
  - "causal edge traversal boost"
  - "2-hop CTE graph walk"
version: 3.6.0.5
---

# Causal graph boost (graduated default-ON)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Causal graph boost walks the `causal_edges` graph from top-ranked seed results, amplifying scores for causally related memories. It uses a weighted recursive CTE with relation-type multipliers and hop decay. The feature graduated to default-ON status as part of the 006-default-on-boost-rollout phase.

---

## 2. HOW IT WORKS

### Core Behavior

After Stage 2 RRF fusion, the causal boost module selects the top 25% of results (max 5) as seed nodes. It traverses up to 2 hops via weighted CTE, applying per-hop boost capped at 0.05. Relation-type weight multipliers: `supersedes` (1.5), `contradicts` (0.8), `caused`/`enabled`/`derived_from`/`supports` (1.0).

The combined causal + session boost ceiling is 0.20. The feature includes intent-aware typed traversal (D3) and sparse-first policy (density < 0.5 constrains to 1-hop typed expansion).

### Configuration

Feature flag: `SPECKIT_CAUSAL_BOOST` (default `true`). Set to `false` to disable.

Status: **Graduated** — default ON, kill-switch available via env var.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor graph walk and boost application |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isCausalBoostEnabled()` flag check |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion invoking causal boost |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/causal-boost.vitest.ts` | Automated test | Causal boost unit tests |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Automated test | Stage 2 fusion integration tests |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval_enhancements/causal_boost_graduated.md`

- Kill switch: `SPECKIT_CAUSAL_BOOST=false`
- See also: `graph_signal_activation/causal_neighbor_boost_and_injection.md` (detailed causal mechanics)
Related references:
- [session-boost-graduated.md](session_boost_graduated.md) — Session attention boost (graduated default-ON)
- [graph-expanded-fallback.md](graph_expanded_fallback.md) — Graph-expanded fallback
