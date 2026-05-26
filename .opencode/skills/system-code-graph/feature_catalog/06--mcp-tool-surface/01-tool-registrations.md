---
title: "Tool registrations"
description: "MCP registration and dispatch surface for mk-code-index code_graph, detect_changes, structural and deep-loop coverage graph references."
trigger_phrases:
  - "tool registrations"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# Tool registrations

## 1. OVERVIEW

The `mk-code-index` runtime exposes code graph, detect_changes and structural tools through the code graph dispatcher. Deep-loop coverage graph tools still dispatch through the system-spec-kit MCP server.

## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual MCP dispatch. Some coverage graph tools are called by command YAML, but the dispatcher itself only routes requested tool names.

### Class

manual. Tool registration is availability, not automation.

### Caveats / Fallback

Schema validation rejects malformed tool calls before handler execution for registered names.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:20-31` | Tool surface | registers `code_graph_*` and `detect_changes` names |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:60-100` | Tool surface | dispatches those names to handlers |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:30-49` | Tool surface | registers and dispatches deep-loop coverage graph tools |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:19-216` | Schema | defines code graph, detect_changes and structural schemas |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:613-705` | Schema | defines deep-loop coverage graph schemas |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/06--mcp-tool-surface/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: MCP tool surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-tool-surface/01-tool-registrations.md`

Related references:

- [../01--read-path-freshness/02-query-self-heal.md](../01--read-path-freshness/02-query-self-heal.md)
- [../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md](../../manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md)
