---
title: "Changelog: Archived Tier and Tombstone Read Exclusions [016/002-archived-tier-and-tombstone-read-exclusions]"
description: "Routed all eleven read channels through one shared active-row predicate, implemented the archived tier end to end behind a live memory_index rebuild and made soft-delete tombstones actually hide rows."
trigger_phrases:
  - "archived tier changelog"
  - "shared active-row predicate"
  - "tombstone read exclusion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

Non-active memory rows no longer leak into search. Read exclusion used to differ in every channel, so deprecated, archived and soft-deleted rows re-entered results through whichever channel forgot to exclude them. There is now one shared active-row predicate and all eleven read channels call it. The `archived` tier is real end to end. The live `memory_index` CHECK constraint only permitted six tiers, so a migration rebuilt the table with an archived-inclusive CHECK while preserving all 41 indexes, the three FTS5 sync triggers and every row id. A data pass then marked 6,090 z_archive rows archived and demoted their inflated tiers. Shipped in `8142e1dae3`.

### Added

- One shared active-row predicate as a SQL builder and its JS twin, called by all eleven read channels.
- The `archived` tier end to end at weight 0.2 with no boost and no decay, wired into the tier tables, the `ImportanceTier` union, `memory_update` schemas and the CLI.
- A migration that rebuilds `memory_index` with an archived-inclusive CHECK, preserving every index, the FTS5 triggers and every row id.

### Changed

- Every read channel routes through the shared predicate: vector, FTS, BM25 hybrid, graph injection, summary lane, community members, rescue backfill, trigger cache, keyword fallback, structural fallback and the stats and health counts.
- Tier writes normalize to lowercase on the update and save or reindex carry paths.
- The parser derives the tier from frontmatter only, so a `[CRITICAL]` quoted in a code sample no longer promotes a document.

### Fixed

- Soft-delete now hides `deleted_at` rows across search, list, triggers, stats and dedup reads, in single and bulk delete.
- Bulk delete is idempotent and stops hard-deleting causal edges in tombstone mode, so a restore keeps the graph.
- The registry rebuild defect where a rename dropped all 41 indexes and dangled child foreign keys was rewritten to capture and recreate every index and preserve FK references.
- The active-uniqueness index now excludes archived, so re-tiering a deprecated row to archived no longer collides with its logical-key twin.

### Verification

- `npx tsc --build` clean.
- Phase and schema vitest 42 of 42 across 6 files.
- Live migration `integrity_check` ok and `foreign_key_check` zero violations.
- 6,090 z_archive rows marked archived with zero left critical or important.
- 41 indexes preserved and the unique index excludes archived.
- Rebuild verified on real-data DB copies before the live run.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/search/active-row-predicate.ts` is the shared predicate.
- `mcp_server/lib/search/vector-index-schema.ts` carries the registry rebuild.
- `mcp_server/scripts/migrations/rebuild-memory-index-archived-check.mjs` is the live all-in-one rebuild.

### Follow-Ups

- Search-level archived exclusion takes effect on daemon restart, the same deploy pattern as phase 001.
- Rollback of the tier data is via the audit trail. A full revert restores `context-index.sqlite.pre-002-archived-rebuild-20260703`.
