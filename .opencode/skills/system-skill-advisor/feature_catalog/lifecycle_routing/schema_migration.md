---
title: "Schema v1 to v2 Additive Backfill"
description: "Additive schema migration between graph-metadata v1 and v2 that preserves existing data and supports rollback."
trigger_phrases:
  - "schema migration"
  - "v1 v2 additive"
  - "additive backfill"
  - "schema rollback"
version: 0.8.0.14
---

# Schema v1 to v2 Additive Backfill

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Evolve graph metadata without breaking existing snapshots. Additive-only migration means v1 fields are preserved and rollback to v1 is safe.

## 2. HOW IT WORKS

`lib/lifecycle/schema-migration.ts` upgrades v1 graph-metadata to v2 by adding new fields (such as lifecycle lanes and derived provenance) while leaving v1 fields byte-identical. Rollback restores the pre-migration state cleanly so downgrades do not leak v2 residue. The current daemon bring-up path watches source files, and its default reindex rewrites the SQLite skill graph from source metadata — but it never runs this migration module; graph-metadata version upgrades remain a manual maintenance step. Database writes happen through trusted maintenance paths such as `advisor_rebuild` and `skill_graph_scan`; the migration helper is covered by lifecycle validation tests.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/schema-migration.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/rollback.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | migration and rollback invariants |
| `Playbook scenario [LC-004](../../manual_testing_playbook/lifecycle_routing/schema_migration.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `lifecycle-routing/schema-migration.md`

Related references:

- [05-rollback.md](./rollback.md).
- [`daemon-and-freshness/rebuild-from-source.md`](../daemon_and_freshness/rebuild_from_source.md).
- [`auto-indexing/sync.md`](../auto_indexing/sync.md).
