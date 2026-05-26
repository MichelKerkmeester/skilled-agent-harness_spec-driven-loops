---
title: "Skill graph validate"
description: "Validates skill graph schema versions, broken edges, relation weights, symmetry and dependency cycles."
---

# Skill graph validate

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_validate` checks the live skill graph for schema drift, broken
edges, recommended weight-band violations, reciprocal-symmetry drift and
lightweight dependency-cycle errors.

## 2. CURRENT REALITY

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `22--context-preservation/29-skill-graph-validate.md`
