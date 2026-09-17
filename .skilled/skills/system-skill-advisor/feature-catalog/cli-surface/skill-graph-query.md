---
title: "Skill graph query"
description: "Runs relationship traversals over the SQLite-backed skill graph."
trigger_phrases:
  - "skill graph query"
  - "skill_graph_query"
  - "traverse skill relationships"
  - "relationship traversals"
  - "query skill dependencies"
version: 0.8.0.10
---

# Skill graph query

<!-- sk-doc-template: skill_asset_feature_catalog -->

**Owned by**: the `system-skill-advisor` CLI front door and its daemon (since `013/009/008`).

## 1. OVERVIEW

`skill_graph_query` reads the live skill graph with query types such as
`depends_on`, `dependents`, `enhances`, `family_members`, `transitive_path`,
`hub_skills`, `orphans` and `subgraph`.

---

## 2. HOW IT WORKS

Current runtime behavior is documented in the source files below.

---

## 3. SOURCE FILES

| File | Role |
|------|------|
| `system-skill-advisor/runtime/tools/skill-graph-tools.ts` | Public command descriptor |
| `system-skill-advisor/runtime/handlers/skill-graph/query.ts` | Handler |

---

## 4. SOURCE METADATA
- Group: Context Preservation And Code Graph
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-surface/skill-graph-query.md`
Related references:
- [skill-graph-scan.md](../../feature-catalog/cli-surface/skill-graph-scan.md) — Skill graph scan
- [skill-graph-status.md](../../feature-catalog/cli-surface/skill-graph-status.md) — Skill graph status
