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

> **STATUS (arc-118):** `deep_loop_graph_status` is NOT a registered MCP tool. It is an internal runtime/ `.cjs` script (under `.opencode/skills/system-deep-loop/runtime/scripts/`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

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
| `.opencode/skills/system-deep-loop/runtime/scripts/status.cjs` | Implementation | CLI script (argv-parsed via `parseArgs`); invoked directly from the deep YAMLs, NOT an MCP tool |
| `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` and `deep-ai-council-confirm.yaml` | Call site | invoked as the `graph_status` step (`--loop-type council`) in the ai-council workflows |
| `.opencode/skills/system-spec-kit/mcp-server/tools/index.ts` | Tool surface | intentionally omits coverage-graph dispatch; this tool family is CLI-invoked and NOT registered as MCP tools |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `coverage-graph/deep-loop-graph-status.md`

Related references:

- [01-deep-loop-graph-query.md](../../feature-catalog/coverage-graph/deep-loop-graph-query.md)
- [04-deep-loop-graph-convergence.md](../../feature-catalog/coverage-graph/deep-loop-graph-convergence.md)
