---
title: "Passive context enrichment"
description: "Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every MCP response without explicit user action."
trigger_phrases:
  - "passive context enrichment"
  - "auto-enrichment pipeline"
  - "constitutional memory injection"
  - "triggered memory auto-surface"
  - "mcp response enrichment"
---

# Passive context enrichment

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Server-side auto-enrichment pipeline that injects constitutional memories, triggered memories, and code graph status into every MCP response without explicit user action.

The spec-doc record-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched spec-doc records are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.

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
- Feature file path: `22--context-preservation/307-passive-context-enrichment.md`
Related references:
- [306-query-intent-routing.md](306-query-intent-routing.md) — Query-intent routing
- [308-gemini-cli-hooks.md](308-gemini-cli-hooks.md) — Gemini CLI hooks
