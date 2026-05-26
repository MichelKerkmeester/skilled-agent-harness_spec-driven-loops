---
title: "Skill Graph Library: SQLite Metadata Graph"
description: "Indexes skill graph metadata into SQLite and exposes relationship query helpers."
trigger_phrases:
  - "skill graph database"
  - "skill graph queries"
---

# Skill Graph Library: SQLite Metadata Graph

## 1. OVERVIEW

This folder owns the SQLite-backed skill graph used to index `.opencode/skills/*/graph-metadata.json` files. It stores skill nodes, typed relationships and graph metadata, then exposes query helpers for MCP tools and diagnostics.

## 2. DIRECTORY TREE

```text
skill-graph/
+-- skill-graph-db.ts       # SQLite schema, indexing and stats
+-- skill-graph-queries.ts  # Prepared graph relationship queries
`-- README.md               # Folder orientation
```

## 3. KEY FILES

| File | Role |
|---|---|
| `skill-graph-db.ts` | Initializes `skill-graph.sqlite`, validates metadata, indexes nodes and edges, handles stats and row mapping. |
| `skill-graph-queries.ts` | Provides relationship lookups such as dependencies, dependents, family members, hubs, orphans, paths and subgraphs. |

## 4. ENTRYPOINTS

- `indexSkillMetadata(skillDir)` scans skill graph metadata and updates SQLite rows.
- `getStats()` reports graph counts, families, edge types and database status.
- `dependsOn()`, `dependents()`, `enhances()`, `enhancedBy()`, `familyMembers()`, `conflicts()`, `transitivePath()`, `hubSkills()`, `orphans()` and `subgraph()` read graph relationships.

## 5. BOUNDARIES

- This folder owns `skill-graph.sqlite` schema and query logic.
- Metadata source files remain under individual skill folders.
- Tool wrappers should call these helpers rather than writing graph tables directly.

## 6. VALIDATION

Run from the repository root:

```bash
npm test -- --runInBand
```

## 7. RELATED

- `../../tools/skill-graph-tools.ts`
- `../freshness/sqlite-integrity.ts`
- `.opencode/skills/*/graph-metadata.json`
