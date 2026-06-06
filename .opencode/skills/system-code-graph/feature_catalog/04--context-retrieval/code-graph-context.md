---
title: "code_graph_context"
description: "LLM-oriented context retrieval surface that expands seeds into compact graph neighborhoods while preserving readiness and partial-output metadata."
trigger_phrases:
  - "code_graph_context"
  - "system-code-graph feature catalog"
importance_tier: "important"
---

# code_graph_context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_context` returns compact structural neighborhoods for LLM use. It accepts manual, graph and Code Graph seeds and embeds readiness metadata in both success and blocked responses.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual tool call only. `code_graph_context` auto-fire is half because readiness work happens only after requested dispatch.

### Class

half. The tool self-checks readiness on invocation. No ambient hook calls it automatically.

### Caveats / Fallback

Blocked responses omit graph answers. Follow `requiredAction:"code_graph_scan"` or use semantic search plus `rg`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:154-169` | Handler | runs read-path readiness with selective indexing allowed and full scans suppressed |
| `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:184-229` | Handler | returns blocked payloads with required action and fallback decision |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:79-117` | Schema | defines the public schema, seed formats and blocked-read contract |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:75-76` | Tool surface | dispatches the handler |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/04--context-retrieval/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Context retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--context-retrieval/code-graph-context.md`

Related references:

- [02-context-handler.md](./context-handler.md)
- [../01--read-path-freshness/ensure-code-graph-ready.md](../01--read-path-freshness/ensure-code-graph-ready.md)
- [../../manual_testing_playbook/04--context-retrieval/008-code-graph-context-readiness-block.md](../../manual_testing_playbook/04--context-retrieval/008-code-graph-context-readiness-block.md)
