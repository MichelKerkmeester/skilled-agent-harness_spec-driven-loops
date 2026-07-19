---
title: "Tool routing enforcement"
description: "5-layer active enforcement system that routes AI tool selection: semantic queries to Code Graph, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement."
trigger_phrases:
  - "tool routing enforcement"
  - "buildServerInstructions"
  - "mcp-level tool routing"
  - "5-layer routing enforcement"
  - "active tool selection enforcement"
version: 3.6.0.10
---

# Tool routing enforcement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

5-layer active enforcement system that routes AI tool selection: semantic queries to Code Graph, structural queries to Code Graph, exact text to Grep — replacing passive CLAUDE.md instructions with MCP-level enforcement.

The implementation addresses the root cause of AI tool misjudgment by adding active enforcement at the MCP layer. Five complementary layers work together: (1) buildServerInstructions() injects routing rules into every MCP session, (2) PrimePackage includes routingRules directives during session priming, (3) tool response hints detect code-search patterns and redirect to appropriate tools, (4) runtime instruction files (`CLAUDE.md`, `AGENTS.md`) contain active decision trees, and (5) the canonical resume/bootstrap surfaces (`/speckit:resume`, `session_bootstrap()`, `session_resume()`) reuse the same routing contract instead of a separate bootstrap agent. This makes correct tool selection structurally enforced rather than instructionally suggested.

---

## 2. HOW IT WORKS

mcp-server/context-server.ts (buildServerInstructions), mcp-server/hooks/memory-surface.ts (PrimePackage routing), mcp-server/hooks/response-hints.ts (reactive hints)

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/context-server.ts` | Server | Tool-routing section in buildServerInstructions() with availability checks |
| `mcp-server/hooks/memory-surface.ts` | Hook | PrimePackage.routingRules with Code Graph/Code Graph directives |
| `mcp-server/hooks/response-hints.ts` | Hook | Reactive hints detecting code-search patterns in tool calls |
| `mcp-server/tool-schemas.ts` | Schema | Enriched tool descriptions with routing guidance |
| `mcp-server/lib/session/session-snapshot.ts` | Lib | codeGraphAvailable and routingRecommendation in session state |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/tool-routing-enforcement.md`
Related references:
- [context-preservation-metrics.md](../../feature-catalog/context-preservation/context-preservation-metrics.md) — Context preservation metrics
- [resource-map-template.md](../../feature-catalog/context-preservation/resource-map-template.md) — Resource map template
