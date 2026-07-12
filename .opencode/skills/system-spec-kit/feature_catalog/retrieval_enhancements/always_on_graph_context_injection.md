---
title: "Always-on graph context injection"
description: "injectGraphContext() runs concept routing and a 1-hop causal walk even without seed results, ensuring graph-derived context is always available to enrich search output, gated by the SPECKIT_GRAPH_CONTEXT_INJECTION flag."
trigger_phrases:
  - "always-on graph context injection"
  - "injectGraphContext"
  - "SPECKIT_GRAPH_CONTEXT_INJECTION"
  - "unconditional causal graph context"
version: 3.6.0.5
---

# Always-on graph context injection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`injectGraphContext()` runs concept routing and a 1-hop causal walk even without seed results, ensuring graph-derived context is always available to enrich search output. This decouples graph context from the success of initial retrieval channels, so that causal neighbors and concept-linked memories surface regardless of whether vector or BM25 channels returned strong hits.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_GRAPH_CONTEXT_INJECTION=false` to disable.

The `injectGraphContext()` function in `causal-boost.ts` performs concept routing on the query and walks 1-hop causal edges from resolved concept nodes. Unlike the standard causal boost (which amplifies existing results), this injection runs unconditionally — it does not require seed results from prior pipeline stages. The injected graph context is merged into the result set with provenance markers indicating its graph origin.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/causal-boost.ts` | Lib | `injectGraphContext()` — unconditional concept routing and 1-hop causal walk |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| — | Automated test | — |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval_enhancements/always_on_graph_context_injection.md`

- Kill switch: SPECKIT_GRAPH_CONTEXT_INJECTION=false
Related references:
- [graph-expanded-fallback.md](graph_expanded_fallback.md) — Graph-expanded fallback
- [community-search-fallback.md](community_search_fallback.md) — Community-level search fallback
