---
title: "Loop Type: Context Schema"
description: "Defines the context loop type in the shared coverage graph database, including its node kinds, valid relations, relation weights, and the SQLite schema backing all three loop types."
trigger_phrases:
  - "loop type context schema"
  - "coverage graph context"
  - "VALID_KINDS context"
  - "CONTEXT_WEIGHTS"
  - "loop_type context"
  - "coverage graph database schema"
version: 1.2.0.3
---

# Loop Type: Context Schema

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Defines the `context` loop type in the shared coverage graph database, including its node kinds, valid relations, relation weights, and the SQLite schema that backs all three loop types (`research`, `review`, `context`).

`coverage-graph-db.ts` is the foundational module shared across all deep-loop types. For `deep-context`, it defines the 8 node kinds and 11 relation types that represent codebase structure, and it assigns `REUSES` the highest relation weight (1.5), encoding the skill's reuse-first principle directly in the graph.

---

## 2. HOW IT WORKS

### Node Kinds (`VALID_KINDS.context`)

`SLICE | FILE | SYMBOL | PATTERN | REUSE_CANDIDATE | DEPENDENCY | CONSTRAINT | GAP`

These are enforced via a CHECK constraint in the `coverage_nodes` table. Nodes outside this set are rejected at the DB layer.

### Relation Types (`VALID_RELATIONS.context`)

`CONTAINS | REFERENCES | IMPORTS | DEPENDS_ON | IMPLEMENTS | EXPOSES | REUSES | CONSTRAINS | COVERED_BY | CONFIRMS | CONTRADICTS`

Relations are enforced in `CONTEXT_WEIGHTS` and validated by `upsert.cjs` before insertion.

### Relation Weights (`CONTEXT_WEIGHTS`)

| Relation | Weight | Rationale |
|---|---|---|
| `REUSES` | 1.5 | Highest; surfacing existing code to extend is the loop's primary value |
| `IMPLEMENTS` | 1.4 | Strong structural signal |
| `EXPOSES` | 1.3 | Public API surface |
| `IMPORTS` / `DEPENDS_ON` | 1.2 | Structural dependency |
| `CONSTRAINS` / `COVERED_BY` | 1.1 | Coverage and constraint tracking |
| `CONTAINS` / `REFERENCES` / `CONFIRMS` | 1.0 | Standard structural edges |
| `CONTRADICTS` | 0.8 | Disagreement — reduces rather than boosts weight |

### Database Lifecycle

`initDb(dbDir)` creates the SQLite file with WAL journaling and foreign keys, applies the schema, and writes or updates the `schema_version` row (current version: 3). Schema migrations drop and recreate tables when the version is outdated. Composite primary keys `(spec_folder, loop_type, session_id, id)` ensure two sessions with the same logical node ID never collide.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Shared | `VALID_KINDS.context`, `VALID_RELATIONS.context`, `CONTEXT_WEIGHTS`, `SCHEMA_SQL`, `initDb`, `upsertNode`, `upsertEdge`, `batchUpsert` |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Script | CLI entrypoint that calls `batchUpsert` for host-written graph events per iteration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/06--coverage-graph-schema/loop-type-context-schema.md` | Manual playbook | Verifies node and relation type constants in coverage-graph-db.ts, REUSES weight is 1.5, upsert.cjs exits 0 for a context-typed node batch |

---

## 4. SOURCE METADATA

- Group: Coverage-Graph Schema
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--coverage-graph-schema/loop-type-context-schema.md`

Related references:
- [context-node-kinds-relations.md](context-node-kinds-relations.md) — What each node kind and relation represents in context sweeps
- [context-convergence-signals.md](context-convergence-signals.md) — Signal computation over the nodes and edges defined here
