---
title: "Tool registrations"
description: "MCP registration and dispatch surface for mk-code-index code_graph, detect_changes and structural tool references."
trigger_phrases:
  - "tool registrations"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.12
---

# Tool registrations

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `mk-code-index` runtime exposes code graph, detect_changes and structural tools through the code graph dispatcher. The deep-loop coverage-graph tool family is not MCP-registered; those scripts are invoked through the deep-loop runtime CLI — convergence and upsert fire from the research/review `*_auto.yaml` steps, status from the ai-council workflows, and query is invoked directly.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual MCP dispatch. Coverage-graph scripts are called by command YAML through CLI invocations, not through the MCP dispatcher.

### Class

manual. Tool registration is availability, not automation.

### Caveats / Fallback

Schema validation rejects malformed tool calls before handler execution for registered names.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp-server/tools/code-graph-tools.ts:20-31` | Tool surface | registers `code_graph_*` and `detect_changes` names |
| `.opencode/skills/system-code-graph/mcp-server/tools/code-graph-tools.ts:60-100` | Tool surface | dispatches those names to handlers |
| `.opencode/skills/system-code-graph/mcp-server/tool-schemas.ts:19-216` | Schema | defines code graph, detect_changes and structural schemas |
| `.opencode/skills/system-spec-kit/mcp-server/tools/index.ts` | Tool surface | intentionally omits coverage-graph dispatch; this tool family is CLI-invoked and NOT registered as MCP tools |
| `.opencode/skills/system-deep-loop/runtime/scripts/*.cjs` | Implementation | deep-loop coverage-graph CLI scripts: convergence/upsert fire from the research/review `*_auto.yaml` steps, status from the ai-council workflows, query is invoked directly |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/mcp-tool-surface/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: MCP tool surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-tool-surface/tool-registrations.md`

Related references:

- [../read-path-freshness/query-self-heal.md](../../feature-catalog/read-path-freshness/query-self-heal.md)
- [../../manual-testing-playbook/mcp-tool-surface/tool-call-shape-validation.md](../../manual-testing-playbook/mcp-tool-surface/tool-call-shape-validation.md)
