---
title: "Implementation Summary: Archived Tier and Tombstone Read Exclusions"
description: "One shared active-row predicate now governs all eleven read channels, the archived tier is implemented end to end behind a live table rebuild, soft-delete tombstones actually hide rows, and tier writes normalize — so deprecated, archived, and deleted rows stop leaking into search."
trigger_phrases:
  - "archived tier read exclusion"
  - "shared active-row predicate"
  - "tombstone visibility fix"
  - "memory_index archived check rebuild"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-03T17:26:54Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Rebuilt memory_index for archived CHECK; marked 6,090 z_archive rows; integrity+FK ok"
    next_safe_action: "Daemon restart applies the search-level archived exclusion; then phase 003"
    blockers: []
    key_files:
      - "mcp_server/lib/search/active-row-predicate.ts"
      - "mcp_server/lib/search/vector-index-schema.ts"
      - "mcp_server/scripts/migrations/rebuild-memory-index-archived-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-002-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CHECK constraint blocks tier=archived; resolved by a verified full table rebuild (operator-chosen)"
      - "Save-time dedup tombstone exclusion is phase 003 scope, not a REQ-002 read channel"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-archived-tier-and-tombstone-read-exclusions |
| **Completed** | 2026-07-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Non-active memory rows no longer leak into search. Read exclusion used to be enforced differently in every channel — three filtered deprecated rows behind a graduated flag, the rest filtered nothing — so deprecated, archived, and soft-deleted rows re-entered results through whichever channel forgot to exclude them. There is now one shared active-row predicate, and every read channel calls it.

### One predicate, eleven channels

`active-row-predicate.ts` exposes a single SQL builder and its JS twin. Vector, FTS, BM25/hybrid, graph injection, the summary lane, community members, rescue backfill, the trigger cache, keyword fallback, the structural-search fallback, and the stats/health counts all route through it. The ranked lane excludes constitutional rows (they stay surfaced through their own injection lane) and gates the deprecated/archived half on the graduated `SPECKIT_INCLUDE_ARCHIVED_DEFAULT` flag, so adopting the predicate does not silently reverse that deliberate cold-inclusion decision. A null tier reads as active; tombstoned rows are excluded unconditionally.

### The archived tier, end to end

`archived` is now a real tier (weight 0.2, no search boost, no decay) in `IMPORTANCE_TIERS`, the `ImportanceTier` union, `memory_update`'s input schemas, and the CLI's tier list. The blocker was the live database: its `memory_index` CHECK constraint only permitted six tiers, and an empirical `UPDATE ... tier='archived'` failed. Extending a baked-in CHECK requires recreating the table, so a migration rebuilds `memory_index` with an archived-inclusive CHECK while preserving all 41 indexes, the three FTS5 external-content sync triggers, and every row id. A one-shot data pass then marks the z_archive corpus archived and demotes its inflated critical/important tiers, writing prior tiers to an audit trail for rollback.

### Tombstones that actually hide, and honest tiers

Soft-delete now excludes `deleted_at` rows across search, list, triggers, stats, and dedup reads, in both single and bulk delete; bulk delete is idempotent (a second run touches zero rows) and stops hard-deleting causal edges in tombstone mode so a restore keeps the graph. Tier values are trustworthy again: writes normalize to lowercase on the update and save/reindex carry paths, and the parser derives the tier from frontmatter only, so a `[CRITICAL]` quoted in a code sample no longer promotes a document. Stats and health report a matching active-vs-raw split.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented in an isolated worktree; GPT-5.5-fast (xhigh) ran an independent adversarial review and returned FAIL with eight REQ gaps (the first pass shipped the predicate and channels but missed the archived-tier schema, bulk-delete parity, save-path normalization, the parser fix, the retro-fix migration, and an eleventh fallback channel). GPT-high remediated all eight; Opus 4.8 final-verified.

Final-verify caught that both the remediation's registry rebuild and its standalone script carried real defects that fixture tests could not surface: the rename dropped all 41 indexes without recreating them, it omitted `legacy_alter_table` so child foreign keys dangled, and the active-uniqueness index did not exclude archived, so re-tiering a formerly-deprecated row collided. Opus rewrote the registry rebuild to capture and recreate every index (patching the unique index to exclude archived), preserve FK references across the rename, and abort on any introduced FK violation — then verified the fixed rebuild on real-data database copies before running it on the live index under an atomic backup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the graduated cold-inclusion flag governing deprecated/archived | The logic-sync decision (REQ-000): the flag is default-TRUE by design, so the shared predicate defaults its cold-inclusion to that flag rather than silently switching to hard exclusion |
| Full `memory_index` table rebuild for the archived CHECK (operator-chosen) | ADR-003 assumed setting tier=archived would work, but the live CHECK rejects it; a rebuild is the clean, ADR-aligned way to extend a baked-in constraint, chosen over a writable_schema patch or an is_archived-only design |
| The active-uniqueness index must also exclude archived | Archived is non-active like deprecated; without excluding it, marking a deprecated row archived re-admits it into the partial index and collides with its logical-key twin |
| Save-time dedup keeps seeing tombstones | `save/dedup.ts` finds predecessors to supersede/resurrect; excluding tombstones there would break the resurrect path — that lane is phase 003's scope, not a REQ-002 read channel |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx tsc --build` (integrated main) | PASS (clean) |
| Phase + schema vitest (6 files) | PASS (42/42) |
| Live migration integrity_check | PASS (ok) |
| Live migration foreign_key_check | PASS (0 violations) |
| z_archive rows marked archived | PASS (6,090; 0 remain critical/important) |
| Indexes preserved / unique excludes archived | PASS (41 indexes; NOT IN includes 'archived') |
| Active-key invariant after rebuild | PASS (0 violations) |
| Rebuild verified on DB copies before live | PASS (apply + FK + rollback) |
| REQ-009 retro-fix population on live | 0 candidates (already clean post-001/002) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Search-level archived exclusion takes effect on daemon restart.** The migration marked the rows and the new code is deployed, but the running daemons hold pre-002 code from their lease directories, so they still admit archived rows until they restart — the same deploy pattern as phase 001's reindex.
2. **Three migration tools coexist.** `rebuild-memory-index-archived-check.mjs` (the all-in-one that ran on live) plus the registry rebuild in `vector-index-schema.ts` both handle the CHECK; `mark-z-archive-rows-archived.mjs` is the data-only equivalent for an already-migrated schema. They are idempotent and guarded, so running any after the live rebuild is a no-op.
3. **Rollback of the tier data is via the audit trail; the CHECK widening is not reverted by it.** A full revert restores the `pre-002-archived-rebuild-20260703` backup. Widening the CHECK to allow archived is harmless to leave in place.
<!-- /ANCHOR:limitations -->
