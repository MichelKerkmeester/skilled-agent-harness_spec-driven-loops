---
title: "Skill graph status"
description: "Reports skill graph health, staleness, families, categories, schema versions and DB status."
trigger_phrases:
  - "skill graph status"
  - "skill_graph_status"
  - "check skill graph health"
  - "skill graph staleness"
  - "skill graph db availability"
version: 0.8.0.10
---

# Skill graph status

<!-- sk-doc-template: skill_asset_feature_catalog -->

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_status` is the read-only health surface for the SQLite skill graph.
It reports totals, family/category breakdowns, staleness, validation status and
database availability.

## 2. HOW IT WORKS

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/status.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `mcp-surface/skill-graph-status.md`
Related references:
- [skill-graph-query.md](../mcp_surface/skill_graph_query.md) — Skill graph query
- [skill-graph-validate.md](../mcp_surface/skill_graph_validate.md) — Skill graph validate
