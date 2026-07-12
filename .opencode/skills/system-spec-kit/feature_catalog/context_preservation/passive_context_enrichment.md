---
title: "Passive context enrichment"
description: "Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every tool response served by this MCP server (system-spec-kit's own mcp_server), without explicit user action."
trigger_phrases:
  - "passive context enrichment"
  - "auto-enrichment pipeline"
  - "constitutional memory injection"
  - "triggered memory auto-surface"
  - "mcp response enrichment"
version: 3.6.0.8
---

# Passive context enrichment

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every tool response served by this MCP server (system-spec-kit's own mcp_server), without explicit user action.

The spec-doc record-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched spec-doc records are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.

Scope note: this pipeline lives inside system-spec-kit's own `mcp_server` process and only enriches tool calls dispatched through that server's `context-server.ts`. It does not reach into other independently-running MCP servers (e.g. system-skill-advisor, system-code-graph) — those servers have no shared code path into this hook chain and would need their own local enrichment implementation to surface equivalent hints.

---

## 2. HOW IT WORKS

mcp_server/hooks/memory-surface.ts, mcp_server/hooks/response-hints.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface constitutional + triggered memories + code graph status |
| `mcp_server/hooks/response-hints.ts` | Hook | Response envelope enrichment with token estimation |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation-specific enrichment (save/update/delete feedback) |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `context_preservation/passive_context_enrichment.md`
Related references:
- [query-intent-routing.md](query_intent_routing.md) — Query-intent routing
