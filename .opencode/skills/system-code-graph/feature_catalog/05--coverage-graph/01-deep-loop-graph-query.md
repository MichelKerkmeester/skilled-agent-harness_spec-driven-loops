---
title: "deep_loop_graph_query"
description: "Manual coverage-graph read tool for uncovered questions, unverified claims, contradictions, provenance chains, coverage gaps and hot nodes."
trigger_phrases:
  - "deep_loop_graph_query"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# deep_loop_graph_query

## 1. OVERVIEW

`deep_loop_graph_query` is the read side of the deep-loop coverage graph. It inspects research/review graph state but does not run from command YAML automatically.

## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. There is no YAML, bootstrap, watcher or after-tool auto-fire path.

### Class

manual. The tool runs only when an operator calls it explicitly.

### Caveats / Fallback

Requires `specFolder`, `loopType` and `sessionId`. Reads are session-scoped.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:42-120` | Handler | validates namespace fields and routes query types |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:33-49` | Tool surface | registers and dispatches the tool |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:660-676` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/01-deep-loop-graph-query.md`

Related references:

- [02-deep-loop-graph-status.md](./02-deep-loop-graph-status.md)
- [03-deep-loop-graph-upsert.md](./03-deep-loop-graph-upsert.md)
