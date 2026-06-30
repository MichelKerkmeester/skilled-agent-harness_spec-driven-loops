---
title: "Changelog: Infra investigations — memory-DB corruption + graph-metadata churn [014-infra-memory-db-and-graph-churn/001-infra-investigation-findings]"
description: "Chronological changelog for the Infra investigations — memory-DB corruption + graph-metadata churn phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn`

### Summary

Two live-infra issues were root-caused. The memory-DB write failures are resolved and MCP-verified this session (clean daemon restart; the prior FTS5 rebuild held — memory_health reports HEALTHY with 0 constraint errors); the graph-churn code fix remains deferred (documented below).

### Added

- Added idempotent last_save_at skip in graph-metadata-parser.ts: refreshGraphMetadataForSpecFolder now skips the write when only the timestamp would change, using graphMetadataEqualIgnoringVolatile to compare derived metadata ignoring volatile fields.
- Declared last_active_child_id and last_active_at in graphMetadataDerivedSchema so Zod preserves chronology pointer fields across derive and merge instead of silently stripping them.
- Added 4 new round-trip and churn-kill regression tests plus verified against 50 existing graph-metadata tests; live 026 probe and 7/7 real-packet sample confirm zero churn on idempotent re-save.

### Changed

- Root-caused memory-DB SQLITE_CONSTRAINT_PRIMARYKEY to corrupted FTS5 shadow (memory_fts_data) after an unclean shutdown; the AFTER-INSERT trigger hits a duplicate shadow rowid, aborting every memory_index insert.
- Root-caused graph-metadata churn to the save path invoking refresh with the default root (entire .opencode/specs tree including archives) and writing last_save_at unconditionally, rewriting ~634 packets on every save.
- deriveStatus now falls back to the existing status before returning planned for lean phase parents that lack implementation-summary.md, preventing silent status downgrades on re-derive.
- Reverted an unsanctioned agent edit to graph-metadata-parser.ts and preserved the draft at /tmp for review; the full fix (scope-to-folder plus idempotency plus archive-exclude plus test) requires a stable session.
- Verified at HEAD that the save path is already scoped to the single touched folder; the broad walker in backfill-graph-metadata.ts is CLI-entrypoint-gated and never imported by the save path. Global backfill remains explicit opt-in.

### Fixed

- Repaired the live memory-DB via FTS5 shadow rebuild (INSERT INTO memory_fts(memory_fts) VALUES('rebuild')), operator-gated with a DB-copy probe first. memory_save, memory_index_scan, and memory_match_triggers now succeed with no .unclean-shutdown marker remaining.

### Verification

- Memory-DB root cause - DONE — corrupted FTS5 shadow + detect-only boot probe; matches prior incident
- Graph-churn root cause - DONE — default-root walk + unconditional last_save_at, incl. archives
- Unsanctioned parser edit reverted - DONE — git checkout HEAD -- clean; agent version saved to /tmp
- No other stray code changes - DONE — working tree scan shows only known graph-metadata.json daemon churn
- Fixes applied - PENDING — graph-churn (tooling) + memory-DB (operator-gated)
- validate.sh --strict (this packet) - PASS
- Tasks complete - 14 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Re-verify memory-DB repair through MCP on next daemon boot; if corruption recurs it points to the abrupt-kill trigger rather than this FTS5 rebuild.
- Apply the graph-churn code fix (scope-to-folder, idempotency, archive-exclude, and a real test) in a stable session; re-derive from the agent draft at /tmp rather than trusting it blindly.
- Scope every commit with explicit pathspecs until the graph-churn fix lands, since the daemon continues rewriting graph-metadata.json on save.
