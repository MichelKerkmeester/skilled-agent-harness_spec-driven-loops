---
title: "Query self-heal"
description: "code_graph_query invokes ensureCodeGraphReady with selective inline indexing allowed and full inline scans suppressed."
trigger_phrases:
  - "query self heal"
  - "system-code-graph feature catalog"
  - "query self-heal"
importance_tier: "important"
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

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1078-1092` | Handler | calls `ensureCodeGraphReady(... allowInlineIndex:true, allowInlineFullScan:false)` |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1093-1120` | Handler | returns a structured unavailable envelope on readiness crashes |
| `.opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts` | Library | default-off packed BM25F symbol suggestions |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Library | read-only symbol metadata accessor for suggestions |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:51-69` | Schema | defines the public `code_graph_query` schema |
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
- [../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md](../../manual_testing_playbook/01--read-path-freshness/query-self-heal-stale-file.md)
