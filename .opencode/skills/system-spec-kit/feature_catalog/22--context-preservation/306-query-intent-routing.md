---
title: "Query-intent routing"
description: "Automatic backend selection in memory_context that routes queries to code graph, Code Graph, or both based on the query-intent classifier output."
trigger_phrases:
  - "query-intent routing"
  - "memory_context backend selection"
  - "automatic query routing"
  - "structural semantic backend routing"
  - "query intent auto-route"
---

# Query-intent routing

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Automatic backend selection in memory_context that routes queries to code graph, Code Graph, or both based on the query-intent classifier output.

When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to Code Graph for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.

---

## 2. HOW IT WORKS

mcp_server/handlers/memory-context.ts (integration point)

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Integration: classifies intent and routes to backend |
| `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts` | Lib | Classification engine (structural/semantic/hybrid) |
| `.opencode/skills/system-code-graph/mcp_server/handlers/` | Handler | Structural backend (code graph query) |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/306-query-intent-routing.md`
Related references:
- [305-session-resume-tool.md](305-session-resume-tool.md) — Session resume tool
- [307-passive-context-enrichment.md](307-passive-context-enrichment.md) — Passive context enrichment
