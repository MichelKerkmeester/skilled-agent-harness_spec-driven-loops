---
title: "Skill graph validate"
description: "Validates skill graph schema versions, broken edges, relation weights, symmetry, dependency cycles and derived-freshness warnings."
trigger_phrases:
  - "skill graph validate"
  - "skill_graph_validate"
  - "validate skill graph schema"
  - "broken edges dependency cycles"
  - "reciprocal symmetry drift"
version: 0.8.0.11
---

# Skill graph validate

<!-- sk-doc-template: skill_asset_feature_catalog -->

**Owned by**: `mk_skill_advisor` MCP server (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_validate` checks the live skill graph for schema drift, broken
edges, recommended weight-band violations, reciprocal-symmetry drift and
lightweight dependency-cycle errors. For schema-v2 nodes it also emits
`DERIVED-FRESHNESS` warnings when the `derived` payload is invalid or missing,
has no parseable sync timestamp, or carries a stale `sanitizer_version`.

## 2. HOW IT WORKS

Current runtime behavior is documented in the source files below.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/mcp-server/tools/skill-graph-tools.ts` | Public MCP descriptor |
| `system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts` | Handler |

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-surface/skill-graph-validate.md`
Related references:
- [skill-graph-status.md](../../feature-catalog/mcp-surface/skill-graph-status.md) — Skill graph status
