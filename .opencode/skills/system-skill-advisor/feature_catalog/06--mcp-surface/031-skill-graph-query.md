---
title: "Skill graph query"
description: "Runs relationship traversals over the SQLite-backed skill graph."
trigger_phrases:
  - "skill graph query"
  - "skill_graph_query"
  - "traverse skill relationships"
  - "relationship traversals"
  - "query skill dependencies"
---

# Skill graph query

<!-- sk-doc-template: skill_asset_feature_catalog -->

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_query` reads the live skill graph with query types such as
`depends_on`, `dependents`, `enhances`, `family_members`, `transitive_path`,
`hub_skills`, `orphans` and `subgraph`.

## 2. HOW IT WORKS

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/query.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/031-skill-graph-query.md`
Related references:
- [030-skill-graph-scan.md](030-skill-graph-scan.md) — Skill graph scan
- [032-skill-graph-status.md](032-skill-graph-status.md) — Skill graph status
