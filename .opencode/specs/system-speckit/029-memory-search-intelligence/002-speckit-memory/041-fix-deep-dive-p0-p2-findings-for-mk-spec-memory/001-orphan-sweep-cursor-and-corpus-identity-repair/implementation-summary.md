---
title: "Implementation Summary: Orphan-Sweep Cursor and Corpus Identity Repair"
description: "Persisted the orphan-sweep cursor, repointed the active projection on moves, and ran the corpus-repair migration that drained 11,129 dead rows, healed 4,313 track-renamed rows, and deprecated ~5,000 duplicate/old-track rows."
trigger_phrases:
  - "orphan sweep cursor persistence"
  - "corpus identity repair migration"
  - "system-speckit track heal"
  - "duplicate content collapse"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/001-orphan-sweep-cursor-and-corpus-identity-repair"
    last_updated_at: "2026-07-04T17:51:11.784Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran corpus-repair migration under checkpoint; SQL invariant 0 violations, integrity ok"
    next_safe_action: "Phase 002 completes the search-level exclusion of the deprecated rows"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/incremental-index.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/scripts/migrations/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-001-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Completion gate is the SQL-level invariant (met, 0 violations); search-level exclusion is phase 002's job"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-orphan-sweep-cursor-and-corpus-identity-repair |
| **Completed** | 2026-07-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The orphan sweep can finally catch up. Its cursor is now persisted in the config table and fed back on each scan, so the sweep advances through the whole index instead of re-checking the same ~200 lowest-id rows forever. Move reconciliation now repoints the active projection (not just the memory-index row) and covers failed-embedding rows, so a renamed packet stays searchable. Near-duplicate hints are written in the JSON shape the reader expects rather than a bare id.

Three dry-run-first migration scripts then repaired the corpus itself. Each defaults to a count-only dry run; a real run requires an explicit `--apply` plus either a reconciliation baseline count or a checkpoint id, so a mis-fire cannot silently mass-delete.

### Corpus-repair migration (executed under checkpoint)

Run against the live index after an atomic backup (`context-index.sqlite.pre-001-corpus-repair-20260703`, the rollback point):

- **Drain**: deleted 11,129 file-absent dead-path rows (unhealed `system-spec-kit` track remnants whose files no longer exist).
- **Heal**: repointed 4,313 track-renamed rows from `system-spec-kit/` to `system-speckit/`.
- **Collapse**: deprecated 4,991 duplicate-content losers (keeping the winner per logical key), plus 7 old-track twins with matching anchors.

Result: 33,728 to 22,599 rows; cross-prefix active duplicate pairs to 0; **zero active old-track spec rows**; the SQL invariant "one active row per logical key" holds with **0 violations** under the full unique-index key; `PRAGMA integrity_check` = ok.

### Rollback runbook

The atomic backup is the single restore point. To revert the entire repair: stop the memory daemon, `cp context-index.sqlite.pre-001-corpus-repair-20260703 context-index.sqlite`, remove the `-wal`/`-shm` sidecars, and restart. Because drain is the only hard-delete step and removes strictly file-absent rows, a partial restore is also count-reconcilable: the pre-drain dead-row count (11,129) equals the deleted count, so a re-drain is idempotent. Heal and collapse are reversible tier/path flips, not deletes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/memory-index.ts` | Modified | Persist and feed back the orphan-sweep cursor via the config table |
| `mcp_server/lib/storage/incremental-index.ts` | Modified | Repoint `active_memory_projection` on moves; cover failed-embedding rows |
| `mcp_server/lib/storage/near-duplicate.ts` | Modified | Write `near_duplicate_of` as the JSON hint shape the reader consumes |
| `mcp_server/scripts/migrations/drain-file-absent-dead-path-rows.mjs` | Created | Delete file-absent rows; dry-run default, baseline-count gated |
| `mcp_server/scripts/migrations/heal-system-speckit-track-identity.mjs` | Created | Repoint track-renamed rows; checkpoint-id gated |
| `mcp_server/scripts/migrations/collapse-duplicate-content-rows.mjs` | Created | Deprecate duplicate-content losers; checkpoint-id gated |
| `mcp_server/tests/orphan-sweep-corpus-repair.vitest.ts` | Created | Unit coverage for cursor, projection, and backfill |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) wrote the code and the dry-run-gated scripts in an isolated worktree; Opus 4.8 verified (build clean, 5/5 unit tests) and ran the destructive migration directly under an atomic backup, applying drain, heal, then collapse and verifying the invariant and integrity after each step. The migration mutates the live index (a gitignored artifact); the code and scripts are what land in git.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Completion gate is the SQL invariant, not the search result | The decided fork: 001 makes one active row per logical key; making search actually exclude the deprecated losers is phase 002's consistent-predicate work |
| Deprecate old-track twins rather than delete | Reversible, and it preserves lineage; the drain only removes genuinely file-absent rows |
| Baseline-count / checkpoint-id gates on apply | A destructive run over the shared 1.3GB index must reconcile against an expected count or a recorded checkpoint before it mutates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS (clean) |
| Phase vitest | PASS (5/5) |
| Migration dry-runs vs apply | PASS (counts matched; apply gated) |
| SQL invariant (one active row per logical key) | PASS (0 violations, full unique-index key) |
| `PRAGMA integrity_check` | PASS (ok) |
| Active old-track rows remaining | 0 |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deprecated rows still surface in search until phase 002 lands.** The old-track rows are deprecated, but the non-vector channels (FTS/BM25/graph) do not yet filter deprecated consistently — that is exactly phase 002's shared-predicate work. A daemon reindex plus 002 completes the search-level cleanup.
2. **Collapse targets duplicate content-hash, not same-logical-key-different-content.** The 7 old-track anchored twins were handled directly; a broader supersession pass is folded into the phase 002/003 predicate and save-dedup work.
<!-- /ANCHOR:limitations -->
