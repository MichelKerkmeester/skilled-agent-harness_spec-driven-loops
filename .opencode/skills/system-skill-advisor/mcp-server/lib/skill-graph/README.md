---
title: "Skill-graph library"
description: "SQLite schema, indexing and relationship-query helpers for the skill graph."
trigger_phrases:
  - "skill graph database"
  - "skill graph queries"
---

# Skill-graph library

---

## 1. OVERVIEW

`skill-graph/` owns the SQLite-backed skill graph used by skill-advisor handlers and diagnostics. It validates metadata, indexes nodes and edges, maps rows to domain results and exposes relationship queries.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `bfs-traversal.ts` | Traverses graph relationships breadth-first. |
| `doc-frontmatter.ts` | Reads and normalizes skill document frontmatter. |
| `metadata-sanitizer.ts` | Redacts and normalizes metadata before graph use. |
| `skill-graph-db.ts` | Owns SQLite schema, indexing, statistics and row mapping. |
| `skill-graph-queries.ts` | Provides relationship lookups and subgraph queries. |

---

## 3. BOUNDARIES

Metadata source files remain in individual skill folders. Handler wrappers call these helpers instead of writing graph tables directly. The runtime graph database is owned here.

---

## 4. VALIDATION

Run the owning MCP server test command from the repository root:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server test -- --no-file-parallelism --maxWorkers=1
```

---

## 5. RELATED

- [`Skill-graph handlers`](../../handlers/skill-graph/README.md)
- [`Skill-root metadata contract`](../../../../sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md)
