---
title: "deep_loop_graph_status"
description: "Manual coverage-graph status tool for session-scoped node/edge counts, relation breakdowns, signals and momentum."
trigger_phrases:
  - "deep_loop_graph_status"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# deep_loop_graph_status

## 1. OVERVIEW

`deep_loop_graph_status` reports deep-loop graph health for a session namespace. It is useful for dashboards and synthesis checks.

## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Direct MCP call only. There is no command YAML auto-fire for status.

### Class

manual. The tool runs only when an operator calls it explicitly.

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
- Feature file path: `05--coverage-graph/02-deep-loop-graph-status.md`

Related references:

- [01-deep-loop-graph-query.md](./01-deep-loop-graph-query.md)
- [04-deep-loop-graph-convergence.md](./04-deep-loop-graph-convergence.md)
