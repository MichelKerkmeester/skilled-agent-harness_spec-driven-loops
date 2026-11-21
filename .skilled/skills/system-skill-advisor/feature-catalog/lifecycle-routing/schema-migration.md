---
title: "Graph Metadata v1 to v2 Additive Backfill"
description: "Additive migration of graph-metadata.json from schema v1 to v2 that preserves existing fields and supports rollback."
trigger_phrases:
  - "schema migration"
  - "v1 v2 additive"
  - "additive backfill"
  - "schema rollback"
version: 0.8.1.0
---

# Graph Metadata v1 to v2 Additive Backfill

## 1. OVERVIEW

Evolve a skill's `graph-metadata.json` without breaking existing snapshots. Additive-only migration means v1 fields are preserved and rollback to v1 is safe.

---

## 2. HOW IT WORKS

`lib/lifecycle/schema-migration.ts` upgrades v1 graph-metadata to v2 by adding new fields (such as lifecycle lanes and derived provenance) while leaving v1 fields byte-identical. Rollback restores the pre-migration state cleanly so downgrades do not leak v2 residue. The current daemon bring-up path watches source files, and its default reindex rewrites the SQLite skill graph from source metadata, but it never runs this migration module; graph-metadata version upgrades remain a manual maintenance step. Database writes happen through trusted maintenance paths such as `advisor_rebuild` and `skill_graph_scan`; the migration helper is covered by lifecycle validation tests.

The skill graph database has a schema version of its own, `SCHEMA_VERSION` in `lib/skill-graph/skill-graph-db.ts`, separate from the graph-metadata `schema_version` this module writes. A database stored below it is deleted with its sidecar files on open and rebuilt by the next scan, never migrated, and this module plays no part in that. Playbook scenario LC-004 validates that database discard by hand. No manual scenario exercises this module.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts` | Library | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | migration and rollback invariants |
| `Playbook scenario [LC-004](../../manual-testing-playbook/lifecycle-routing/schema-migration.md).` | Reference | Related scenario for the database discard; it does not exercise this module |

---

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lifecycle-routing/schema-migration.md`

Related references:

- [05-rollback.md](./rollback.md).
- [`daemon-and-freshness/rebuild-from-source.md`](../../feature-catalog/daemon-and-freshness/rebuild-from-source.md).
- [`auto-indexing/sync.md`](../auto-indexing/sync.md).
