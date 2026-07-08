---
title: Deep Loop Runtime Coverage Graph Schema
description: SQLite schema, node kinds, relation kinds, indexes, lifecycle, and namespace rules for the deep-loop-runtime coverage graph.
trigger_phrases:
  - "coverage graph schema"
  - "deep-loop graph sqlite"
  - "coverage_nodes table"
  - "coverage_edges table"
importance_tier: normal
contextType: implementation
version: 1.4.0.4
---

# Deep Loop Runtime Coverage Graph Schema

SQLite schema and operational notes for `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`.

---

## 1. OVERVIEW

The coverage graph is session-scoped evidence storage for deep-research and deep-review loops. It is owned by `lib/coverage-graph/coverage-graph-db.ts` and exposed through direct scripts under `scripts/`.

Schema version: `2`.

Storage directory: `.opencode/skills/deep-loop-runtime/database/`.

Database file: `deep-loop-graph.sqlite`.

---

## 2. LOOP TYPES

| Loop type | Meaning |
|---|---|
| `research` | Deep-research question, finding, claim, and source graph. |
| `review` | Deep-review graph over DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER and TEST node kinds (see §3 authoritative table). |

---

## 3. NODE KINDS

### Research Node Kinds

| Kind | Meaning |
|---|---|
| `QUESTION` | Research question or unresolved branch. |
| `FINDING` | Discovered answer or synthesis item. |
| `CLAIM` | Claim needing support or verification. |
| `SOURCE` | Evidence source. |

### Review Node Kinds

| Kind | Meaning |
|---|---|
| `DIMENSION` | Review dimension. |
| `FILE` | Reviewed or hotspot file. |
| `FINDING` | Review finding. |
| `EVIDENCE` | Evidence item. |
| `REMEDIATION` | Fix or mitigation. |
| `BUG_CLASS` | Finding taxonomy class. |
| `INVARIANT` | Required invariant. |
| `PRODUCER` | Producer surface. |
| `CONSUMER` | Consumer surface. |
| `TEST` | Test evidence. |

---

## 4. RELATION TYPES

| Research relation | Default weight |
|---|---:|
| `ANSWERS` | 1.3 |
| `SUPPORTS` | 1.0 |
| `CONTRADICTS` | 0.8 |
| `SUPERSEDES` | 1.5 |
| `DERIVED_FROM` | 1.0 |
| `COVERS` | 1.1 |
| `CITES` | 1.0 |

| Review relation | Default weight |
|---|---:|
| `COVERS` | 1.3 |
| `EVIDENCE_FOR` | 1.0 |
| `CONTRADICTS` | 0.8 |
| `RESOLVES` | 1.5 |
| `CONFIRMS` | 1.0 |
| `ESCALATES` | 1.2 |
| `IN_DIMENSION` | 1.0 |
| `IN_FILE` | 1.0 |

Weights are clamped to `[0.0, 2.0]` by `clampWeight()`.

---

## 5. TABLES

### coverage_nodes

| Column | Type | Notes |
|---|---|---|
| `spec_folder` | TEXT NOT NULL | Packet or spec namespace. |
| `loop_type` | TEXT NOT NULL | Research or review. |
| `session_id` | TEXT NOT NULL | Lineage namespace. |
| `id` | TEXT NOT NULL | Logical node id. |
| `kind` | TEXT NOT NULL | Loop-type allow-list validated by scripts. |
| `name` | TEXT NOT NULL | Human-readable label. |
| `content_hash` | TEXT | Optional content hash. |
| `iteration` | INTEGER | Iteration that produced the node. |
| `metadata` | TEXT | JSON metadata. |
| `created_at` | TEXT | Default `datetime('now')`. |
| `updated_at` | TEXT | Updated on upsert. |

Primary key: `(spec_folder, loop_type, session_id, id)`.

### coverage_edges

| Column | Type | Notes |
|---|---|---|
| `spec_folder` | TEXT NOT NULL | Packet or spec namespace. |
| `loop_type` | TEXT NOT NULL | Research or review. |
| `session_id` | TEXT NOT NULL | Lineage namespace. |
| `id` | TEXT NOT NULL | Logical edge id. |
| `source_id` | TEXT NOT NULL | Source node id. |
| `target_id` | TEXT NOT NULL | Target node id. |
| `relation` | TEXT NOT NULL | Loop-type allow-list validated by scripts. |
| `weight` | REAL | Default 1.0, check 0.0 through 2.0. |
| `metadata` | TEXT | JSON metadata. |
| `created_at` | TEXT | Default `datetime('now')`. |

Primary key: `(spec_folder, loop_type, session_id, id)`. Foreign keys reference source and target nodes in the same namespace. Self-loops are rejected.

### coverage_snapshots

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Snapshot id. |
| `spec_folder` | TEXT NOT NULL | Packet or spec namespace. |
| `loop_type` | TEXT NOT NULL | Research or review. |
| `session_id` | TEXT NOT NULL | Session namespace. |
| `iteration` | INTEGER NOT NULL | Iteration number. |
| `metrics` | TEXT | JSON metrics. |
| `node_count` | INTEGER | Node count at snapshot time. |
| `edge_count` | INTEGER | Edge count at snapshot time. |
| `created_at` | TEXT | Default `datetime('now')`. |

Unique key: `(spec_folder, loop_type, session_id, iteration)`.

### schema_version

| Column | Type | Notes |
|---|---|---|
| `version` | INTEGER NOT NULL | Current schema version. |

---

## 6. INDEXES

| Index | Table | Columns |
|---|---|---|
| `idx_coverage_folder_type` | `coverage_nodes` | `spec_folder`, `loop_type` |
| `idx_coverage_kind` | `coverage_nodes` | `kind` |
| `idx_coverage_session` | `coverage_nodes` | `spec_folder`, `loop_type`, `session_id` |
| `idx_coverage_iteration` | `coverage_nodes` | `iteration` |
| `idx_coverage_edge_source` | `coverage_edges` | `spec_folder`, `loop_type`, `session_id`, `source_id` |
| `idx_coverage_edge_target` | `coverage_edges` | `spec_folder`, `loop_type`, `session_id`, `target_id` |
| `idx_coverage_edge_relation` | `coverage_edges` | `relation` |
| `idx_coverage_edge_folder_type` | `coverage_edges` | `spec_folder`, `loop_type` |
| `idx_coverage_edge_session` | `coverage_edges` | `spec_folder`, `loop_type`, `session_id` |
| `idx_coverage_snapshot_session` | `coverage_snapshots` | `session_id` |

---

## 7. LIFECYCLE

- `initDb(dbDir)` creates storage, opens SQLite, enables WAL, enables foreign keys, migrates old schema, executes schema SQL, and writes `schema_version`.
- `getDb()` lazily initializes with `COVERAGE_GRAPH_DATABASE_DIR`.
- `closeDb()` closes and clears the singleton connection.
- Scripts call `closeDb()` in `finally`.
- Version upgrades from v1 to v2 drop graph tables because this DB is a dev coverage cache rather than durable packet state.

---

## 8. SOURCE ANCHORS

| Path | Role |
|---|---|
| `lib/coverage-graph/coverage-graph-db.ts` | Authoritative schema and DB lifecycle. |
| `lib/coverage-graph/coverage-graph-query.ts` | Read models over the schema. |
| `lib/coverage-graph/coverage-graph-signals.ts` | Signal extraction and snapshots. |
| `scripts/upsert.cjs` | Public mutation entry point. |
| `scripts/status.cjs` | Public status entry point. |
| `tests/lifecycle/db-open-close.vitest.ts` | Lifecycle regression coverage. |

