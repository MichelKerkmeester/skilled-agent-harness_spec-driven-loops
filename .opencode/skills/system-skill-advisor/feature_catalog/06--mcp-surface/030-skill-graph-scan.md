---
title: "Skill graph scan"
description: "Indexes skill graph metadata into the SQLite-backed skill graph."
trigger_phrases:
  - "skill graph scan"
  - "skill_graph_scan"
  - "index skill graph metadata"
  - "sqlite-backed skill graph"
  - "refresh skill relationships"
---

# Skill graph scan

<!-- sk-doc-template: skill_asset_feature_catalog -->

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_scan` indexes `.opencode/skills/*/graph-metadata.json` files into
the SQLite skill graph. It is the maintenance entry point for refreshing skill
relationships before structural skill queries.

## 2. HOW IT WORKS

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/030-skill-graph-scan.md`
Related references:
- [029-advisor-rebuild.md](029-advisor-rebuild.md) — advisor_rebuild MCP Tool
- [031-skill-graph-query.md](031-skill-graph-query.md) — Skill graph query
