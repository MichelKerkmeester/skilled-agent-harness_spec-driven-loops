---
title: "Skill graph status"
description: "Reports skill graph health, staleness, families, categories, schema versions and DB status."
---

# Skill graph status

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`skill_graph_status` is the read-only health surface for the SQLite skill graph.
It reports totals, family/category breakdowns, staleness, validation status and
database availability.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Current runtime behavior is documented in the source files below.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/status.ts` | Handler |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/28-skill-graph-status.md`

<!-- /ANCHOR:source-metadata -->
