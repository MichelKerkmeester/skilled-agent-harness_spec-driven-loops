---
title: "Query self-heal"
description: "code_graph_query invokes ensureCodeGraphReady with selective inline indexing allowed and full inline scans suppressed."
trigger_phrases:
  - "query self heal"
  - "system-code-graph feature catalog"
  - "query self-heal"
importance_tier: "important"
version: 1.2.0.13
---

# Query self-heal

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_query` is a structural read surface for outline, call, import and blast-radius queries. Before answering, it asks the readiness helper for a bounded repair opportunity.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual tool call only. The self-heal happens inside that requested read path.

### Class

half. Code graph freshness checks are half-auto. `code_graph_query` has conditional local/native pass evidence only.

### Caveats / Fallback

When stale files exceed the selective threshold or Git HEAD changed, query blocks and tells the operator to run `code_graph_scan`. Use `rg` when readiness crashes or the graph is unavailable.

Unresolved symbol subjects can optionally return BM25 symbol suggestions when `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` is enabled. Exact `symbol_id`, `fq_name` and `name` resolution still runs first; BM25 suggestions appear only after exact matching misses, are marked `disambiguationOnly: true`, and never execute the structural query automatically.

Relationship operations (`calls_from`, `calls_to`, `imports_from`, `imports_to`) accept an optional `asOf` graph generation for a time-travel read. With `asOf` omitted the live readers run against the current graph. With `asOf` supplied the as-of readers (`asOfEdgesFrom`, `asOfEdgesTo`) return edges that were valid at that generation, meaning `valid_at <= asOf` and `invalid_at` is either null or greater than `asOf`. The default-off `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` flag is what surfaces preserved history, so with the flag off the read falls back to the live answer and `asOf` stays inert until edge history is retained.

Relationship output also carries an `edgeEvidenceClass`/`confidence` classification (`classifyEdgeEvidenceClass`/`edgeMetadataOutput`) that recognizes `AMBIGUOUS` evidence as weak evidence alongside `INFERRED`, and substitutes the legacy uniform tier for `CALLS` edges specifically while `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` is off. This is readiness-adjacent output formatting, not part of the self-heal repair itself -- see [`../09--edge-confidence-and-provenance/edge-evidence-classification.md`](../09--edge-confidence-and-provenance/edge-evidence-classification.md) for the full read-path contract shared with `code_graph_scan` and `code_graph_context`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1078-1092` | Handler | calls `ensureCodeGraphReady(... allowInlineIndex:true, allowInlineFullScan:false)` |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1093-1120` | Handler | returns a structured unavailable envelope on readiness crashes |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:716-782` | Handler | `classifyEdgeEvidenceClass`/`edgeMetadataOutput`: AMBIGUOUS-as-weak-evidence and CALLS-only flag-off normalization for relationship output |
| `.opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts` | Library | default-off packed BM25F symbol suggestions |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Library | read-only symbol metadata accessor for suggestions plus the `asOfEdgesFrom` and `asOfEdgesTo` time-travel readers |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:51-69` | Schema | defines the public `code_graph_query` schema, including the optional `asOf` generation parameter |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:65-70` | Tool surface | validates required `operation` and `subject` before dispatch |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/01--read-path-freshness/` | Manual Playbook | Operator-facing manual scenarios for this feature category |
| `.opencode/skills/system-code-graph/mcp_server/tests/symbol-bm25-resolver.vitest.ts` | Automated test | field weighting, near-miss scoring, packed postings and flag parsing |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Automated test | exact-match byte identity and fallback-only suggestions |

## 4. SOURCE METADATA

- Group: Read path freshness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--read-path-freshness/query-self-heal.md`

Related references:

- [01-ensure-code-graph-ready.md](./ensure-code-graph-ready.md)
- [../06--mcp-tool-surface/tool-registrations.md](../06--mcp-tool-surface/tool-registrations.md)
- [../09--edge-confidence-and-provenance/edge-evidence-classification.md](../09--edge-confidence-and-provenance/edge-evidence-classification.md)
- [../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md](../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md)
