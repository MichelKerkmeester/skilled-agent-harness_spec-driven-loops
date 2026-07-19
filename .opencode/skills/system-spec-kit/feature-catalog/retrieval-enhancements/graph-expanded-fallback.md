---
title: "Graph-expanded fallback"
description: "buildGraphExpandedFallback() walks 1-hop causal edges from concept seeds when search returns no_results or low_confidence, providing graph-derived recovery candidates, gated by the SPECKIT_GRAPH_FALLBACK flag."
trigger_phrases:
  - "graph-expanded fallback"
  - "buildGraphExpandedFallback"
  - "SPECKIT_GRAPH_FALLBACK"
  - "causal edge recovery candidates"
version: 3.6.0.5
---

# Graph-expanded fallback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`buildGraphExpandedFallback()` walks 1-hop causal edges from concept seeds when search returns `no_results` or `low_confidence`, providing graph-derived recovery candidates. Instead of returning empty results, the system uses the causal graph to find memories that are structurally related to the query concepts, even when no direct text or embedding match was found.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_GRAPH_FALLBACK=false` to disable.

When the search pipeline produces a `no_results` or `low_confidence` outcome, the recovery payload builder invokes `buildGraphExpandedFallback()`. This function takes concept seeds extracted from the query, walks 1-hop causal edges from those seeds, and returns the resulting memories as fallback candidates. The fallback results are clearly marked as graph-expanded so downstream consumers can distinguish them from direct search hits.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/recovery-payload.ts` | Lib | `buildGraphExpandedFallback()` — 1-hop causal walk from concept seeds for recovery |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| — | Automated test | — |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval-enhancements/graph-expanded-fallback.md`

- Kill switch: SPECKIT_GRAPH_FALLBACK=false
Related references:
- [causal-boost-graduated.md](../../feature-catalog/retrieval-enhancements/causal-boost-graduated.md) — Causal graph boost (graduated default-ON)
- [always-on-graph-context-injection.md](../../feature-catalog/retrieval-enhancements/always-on-graph-context-injection.md) — Always-on graph context injection
