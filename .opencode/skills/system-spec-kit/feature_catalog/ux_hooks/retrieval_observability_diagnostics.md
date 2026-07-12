---
title: "Retrieval observability diagnostics"
description: "Opt-in and health-only diagnostics for why_ranked traces, inline conflict warnings, degraded-vector state, and maintenance counters without ranking or write-path changes."
trigger_phrases:
  - "retrieval observability diagnostics"
  - "why_ranked"
  - "degraded vector state"
  - "maintenance counters"
version: 3.6.0.1
---

# Retrieval observability diagnostics

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Retrieval observability makes ranking and maintenance state inspectable without changing search behavior.

When trace/debug surfaces are requested, callers can see why a result ranked, whether returned documents conflict through existing causal edges, whether vector recall is degraded, and what the latest maintenance handlers reported.

---

## 2. HOW IT WORKS

`memory_search(includeTrace: true)` can emit `why_ranked` derived from the ranker's own row intermediates and compact inline warnings when returned documents are linked by `contradicts` or `supersedes` causal edges. The debug profile in `memory_context` opts nested search into trace output.

Health and embedder-status handlers expose degraded-vector state. Index scan, embedding reconcile, and retention sweep handlers record last-run counters in process memory so health can report recent maintenance state without a schema bump or persisted write path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/observability/retrieval-observability.ts` | Shared | Read-only observability helpers |
| `mcp_server/formatters/search-results.ts` | Formatter | why_ranked and inline conflict warning rendering |
| `mcp_server/handlers/memory-search.ts` | Handler | Degraded-vector trace metadata in search responses |
| `mcp_server/handlers/memory-context.ts` | Handler | Debug profile trace opt-in for nested search |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Recall degradation and last-run counter exposure |
| `mcp_server/handlers/embedder-status.ts` | Handler | Recall degradation surfaced with embedder status |
| `mcp_server/handlers/memory-index.ts` | Handler | Records latest scan counters |
| `mcp_server/handlers/memory-embedding-reconcile.ts` | Handler | Records latest reconcile counters |
| `mcp_server/handlers/memory-retention-sweep.ts` | Handler | Records latest retention counters |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/openltm-retrieval-observability.vitest.ts` | Automated test | why_ranked, conflict warning, degraded-vector, and maintenance counter coverage |
| `mcp_server/tests/handler-memory-search.vitest.ts` | Automated test | Search recall canaries |
| `mcp_server/tests/search-archival.vitest.ts` | Automated test | Recall/exclusion canaries |

---

## 4. SOURCE METADATA

- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `ux_hooks/retrieval_observability_diagnostics.md`

Related references:
- [result-explainability.md](result_explainability.md) - Result explanation surface
- [memory-health-autorepair-metadata.md](memory_health_autorepair_metadata.md) - Health metadata presentation
