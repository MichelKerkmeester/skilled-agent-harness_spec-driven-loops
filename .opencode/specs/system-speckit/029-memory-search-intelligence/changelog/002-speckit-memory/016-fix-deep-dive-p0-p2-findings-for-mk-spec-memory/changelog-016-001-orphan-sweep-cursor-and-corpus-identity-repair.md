---
title: "Changelog: Orphan-Sweep Cursor and Corpus Identity Repair [016/001-orphan-sweep-cursor-and-corpus-identity-repair]"
description: "Persisted the orphan-sweep cursor, repointed the active projection on moves and ran the corpus-repair migration that drained file-absent rows, healed the system-spec-kit to system-speckit track rename and collapsed duplicate-content rows."
trigger_phrases:
  - "orphan sweep cursor changelog"
  - "corpus identity repair migration"
  - "system-speckit track heal"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The orphan sweep can now catch up and the corpus identity is repaired. The sweep cursor is persisted in the config table and fed back on each scan, so the sweep advances through the whole index instead of re-checking the same lowest-id rows forever. A corpus-repair migration then ran against the live index under an atomic backup. It drained 11,129 file-absent dead-path rows. It healed 4,313 rows from the old `system-spec-kit` track to `system-speckit`. It deprecated 4,991 duplicate-content losers plus 7 old-track twins. The index went from 33,728 to 22,599 rows with zero active old-track spec rows left. Shipped in `4ae4ae1e96`.

### Added

- Orphan-sweep cursor persistence in the config table, fed back on each scan.
- Three dry-run-first migration scripts for drain, heal and collapse. Each defaults to a count-only dry run and requires an explicit `--apply` plus a baseline count or a checkpoint id, so a mis-fire cannot silently mass-delete.
- Unit coverage for the cursor, projection and backfill.

### Changed

- Move reconciliation now repoints the active projection instead of just the memory-index row. It also covers failed-embedding rows, so a renamed packet stays searchable.
- Near-duplicate hints are written in the JSON shape the reader consumes instead of a bare id.

### Fixed

- The live corpus lost its cross-prefix active duplicate pairs. The SQL invariant of one active row per logical key now holds with zero violations under the full unique-index key.
- `PRAGMA integrity_check` returns ok after the repair.

### Verification

- `npm run build` clean.
- Phase vitest 5 of 5.
- SQL invariant zero violations. `integrity_check` ok. Zero active old-track rows.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/handlers/memory-index.ts` persists and feeds back the orphan-sweep cursor.
- `mcp_server/lib/storage/incremental-index.ts` repoints the active projection on moves.
- `mcp_server/lib/storage/near-duplicate.ts` writes the reader-consumed hint shape.
- `mcp_server/scripts/migrations/` adds the drain, heal and collapse scripts.
- `mcp_server/tests/orphan-sweep-corpus-repair.vitest.ts` adds the unit coverage.

### Follow-Ups

- Deprecated rows still surface in search until phase 002 lands and a daemon reindex runs.
- Rollback is the named backup `context-index.sqlite.pre-001-corpus-repair-20260703`.
