---
title: "Skill graph scan"
description: "Indexes skill graph metadata into the SQLite-backed skill graph."
---

# Skill graph scan

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_scan` indexes `.opencode/skills/*/graph-metadata.json` files into
the SQLite skill graph. It is the maintenance entry point for refreshing skill
relationships before structural skill queries.

## 2. CURRENT REALITY

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/26-skill-graph-scan.md`
