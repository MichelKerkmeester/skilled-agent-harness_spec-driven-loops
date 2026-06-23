---
title: "deep_loop_graph_status"
description: "Manual coverage-graph status tool for session-scoped node/edge counts, relation breakdowns, signals and momentum."
trigger_phrases:
  - "deep_loop_graph_status"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.10
---

# deep_loop_graph_status

<!-- sk-doc-template: skill_asset_feature_catalog -->

> **STATUS (arc-118):** `deep_loop_graph_status` is NOT a registered MCP tool. It is an internal deep-loop-runtime `.cjs` script (under `.opencode/skills/deep-loop-runtime/scripts/`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

## 1. OVERVIEW

`deep_loop_graph_status` reports deep-loop graph health for a session namespace. It is useful for dashboards and synthesis checks.

## 2. HOW IT WORKS

### Trigger / Invocation Path

Invoked internally by the deep-loop runtime as a `.cjs` script. There is no MCP routing or command YAML auto-fire for status.

### Class

manual. The script runs only when invoked explicitly by the deep-loop runtime.

### Caveats / Fallback

Empty graphs return zero counts and null signals. Use upsert-enabled deep loops to populate graphEvents first.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:33-89` | Handler | validates input and returns scoped stats, signals and momentum |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:33-49` | Tool surface | registers and dispatches the tool |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:678-690` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/deep-loop-graph-status.md`

Related references:

- [01-deep-loop-graph-query.md](./deep-loop-graph-query.md)
- [04-deep-loop-graph-convergence.md](./deep-loop-graph-convergence.md)
