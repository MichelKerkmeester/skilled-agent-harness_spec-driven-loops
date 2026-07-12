---
title: "MCP auto-priming"
description: "First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call."
trigger_phrases:
  - "mcp auto-priming"
  - "PrimePackage"
  - "first-call session context injection"
  - "constitutional memories priming"
  - "session priming mcp"
version: 3.6.0.8
---

# MCP auto-priming

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

First-call session context injection that delivers a Prime Package containing constitutional memories, code graph status, and triggered context on the first MCP tool call.

The spec-doc record-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.

---

## 2. HOW IT WORKS

mcp_server/hooks/memory-surface.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface with priming state tracking and PrimePackage assembly |
| `mcp_server/hooks/response-hints.ts` | Hook | Injects Prime Package into MCP response envelope hints |
| `mcp_server/handlers/session-health.ts` | Handler | Exposes primingStatus (primed/not_primed) |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `context_preservation/mcp_auto_priming.md`
Related references:
- [query-intent-classifier.md](query_intent_classifier.md) — Query-intent classifier
- [session-health-tool.md](session_health_tool.md) — Session health tool
