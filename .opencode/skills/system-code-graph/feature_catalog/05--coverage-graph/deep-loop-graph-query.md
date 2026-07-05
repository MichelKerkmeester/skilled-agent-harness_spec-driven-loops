---
title: "deep_loop_graph_query"
description: "Manual coverage-graph read tool for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps and hot nodes."
trigger_phrases:
  - "deep_loop_graph_query"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.10
---

# deep_loop_graph_query

<!-- sk-doc-template: skill_asset_feature_catalog -->

> **STATUS (arc-118):** `deep_loop_graph_query` is NOT a registered MCP tool. It is an internal deep-loop-runtime `.cjs` script (under `.opencode/skills/deep-loop-runtime/scripts/`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

## 1. OVERVIEW

`deep_loop_graph_query` is the read side of the deep-loop coverage graph. It inspects research/review graph state but does not run from command YAML automatically.

## 2. HOW IT WORKS

### Trigger / Invocation Path

Invoked internally by the deep-loop runtime as a `.cjs` script. There is no MCP routing, YAML, bootstrap, watcher or after-tool auto-fire path.

### Class

manual. The script runs only when invoked explicitly by the deep-loop runtime.

### Caveats / Fallback

Requires `specFolder`, `loopType` and `sessionId`. Reads are session-scoped.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Implementation | CLI script (argv-parsed via `parseArgs`); invoked directly from the deep YAMLs, NOT an MCP tool |
| `.opencode/skills/deep-loop-runtime/references/integration_points.md` | Call site | `query.cjs` is a read-only query entry with no `*_auto.yaml` auto-step; it is invoked directly via the deep-loop runtime CLI (see integration_points.md), consistent with the no-auto-fire note above |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Tool surface | intentionally omits coverage-graph dispatch; this tool family is CLI-invoked and NOT registered as MCP tools |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/deep-loop-graph-query.md`

Related references:

- [02-deep-loop-graph-status.md](./deep-loop-graph-status.md)
- [03-deep-loop-graph-upsert.md](./deep-loop-graph-upsert.md)
