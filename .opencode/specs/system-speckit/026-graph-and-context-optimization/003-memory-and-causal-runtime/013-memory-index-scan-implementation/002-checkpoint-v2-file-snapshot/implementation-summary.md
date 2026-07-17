---
title: "Implementation Summary"
description: "Checkpoint v2 is shipped, gate-fixed, and live-verified. Phases 1-7 (schema v29, v2 CREATE, v2 RESTORE, journal crash-safety) landed on main; a post-deploy live verification caught and fixed a v2-selection gate bug that had left the feature inert on sharded runtimes. Full-DB create + restore round-trip proven on the production database."
trigger_phrases:
  - "checkpoint v2 implementation summary"
  - "checkpoint v2 phase status"
  - "vacuum into checkpoint progress"
  - "schema v29 implementation state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot"
    last_updated_at: "2026-06-02T10:03:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checkpoint-v2 shipped, gate-fixed (cce4fe931d), live-verified, deployed to main"
    next_safe_action: "None binding; front-proxy (E) shipped; needs-rebuild sentinel shipped (013/005)"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - "lib/search/vector-index-store.ts"
      - "lib/search/vector-index-schema.ts"
      - "tests/checkpoints-v2-create.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-v2-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-checkpoint-v2-file-snapshot |
| **Completed** | 2026-06-01 — shipped, gate-fixed, and live-verified |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A v2 file-based full-DB checkpoint path. Unscoped full-DB `checkpoint_create` now snapshots the main database with SQLite `VACUUM INTO` (and, when `includeEmbeddings` is set, the attached `active_vec` shard), records `snapshot_format='v2'` plus `snapshot_path`, and leaves `memory_snapshot` NULL. The v1 scoped JSON path is untouched. Restore swaps the snapshot files in through a `reopenActiveDatabase` coordinator, guarded by a two-phase restore journal and `.bak` rollback.

### Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Packet setup (docs + metadata) | Done |
| Phase 1 | Schema v29 + `includeEmbeddings` wiring | Done |
| Phase 2 | v2 CREATE (VACUUM INTO + manifest + selection branch) | Done |
| Phase 3 | v2 RESTORE (reopen coordinator + file swap + `.bak`) | Done |
| Phase 4-7 | Journal crash-safety remediation (two-phase `swap-pending`/`swap-done`, shard-aware recovery, fsync durability) | Done |
| Post-deploy fix | v2-selection gate corrected after live verification (see below) | Done |

### Shipped behavior

- **Schema v29 + flag.** `SCHEMA_VERSION` bumped 28→29 with additive `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT` columns on `checkpoints`; `includeEmbeddings` exposed end to end through the `checkpoint_create` handler and tool schema.
- **v2 CREATE.** `createCheckpointV2` snapshots main and (when embeddings are included and a shard is attached) the `active_vec` shard with `VACUUM INTO`, writes `manifest.json`, and atomically renames a tmp dir into place. A scope-based selection branch routes unscoped full-DB requests to v2 and leaves scoped requests on v1.
- **v2 RESTORE.** `reopenActiveDatabase` closes the live connection and swaps snapshot files in, with `.bak` rollback, a two-phase journal (`swap-pending`→`swap-done`; boot recovery rolls back only while pending and keeps the restored snapshot once done), shard-aware recovery, fsync durability, and post-restore rebuilds (FTS, communities, entities, degree snapshots, lineage).

### Post-deploy fix — v2 selection was inert (caught by live verification)

The live verification this session revealed the shipped feature did **not activate** on the production (sharded) runtime. The v2 selection gate (`hasMainVectorPayloadTables`) treated the presence of `vec_memories` **or `vec_metadata`** in main as "vector payload in main" and fell back to v1. But the shard-attach slimming (`drop_canonical_vector_payload_tables`) intentionally **retains** the small `vec_metadata` config table in main (a dimension fallback) while dropping `vec_memories`. So on every sharded daemon the gate always saw `vec_metadata` and silently chose v1 — the exact `Invalid string length` path v2 exists to prevent. The fix gates on `vec_memories` only, plus a regression test reproducing the daemon post-slim state. Committed as `cce4fe931d`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phases 1-7 were implemented via cli-opencode (`openai/gpt-5.5-fast --variant high`) in a worktree, each gated by `npm run typecheck` (0 new errors) plus targeted vitest, with a multi-lens review before merge (returned SAFE TO DEPLOY, P0/P1 none). The orchestrator owned all git writes.

The real proof came after a deliberate `dist/` rebuild: a live full-DB `checkpoint_create` and a restore round-trip on the ~300 MB production database. That live step is what surfaced the inert-selection bug — the multi-lens review and the unit tests passed because the tests never modeled the daemon's post-slim state (main retaining `vec_metadata`). The bug was fixed, redeployed, and re-verified live.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| File-based `VACUUM INTO` over chunked NDJSON | It is the direct inverse of the failing `JSON.stringify` and removes the string ceiling with no extra serialization layer. |
| Restore by whole-file swap over row-copy | Row-copy re-fires `ON DELETE CASCADE`/`SET NULL` and the append-only `mutation_ledger` ABORT triggers, and cannot copy a vec0 virtual table; a file swap makes the snapshot the database directly. |
| Version marker via schema v29 columns over a metadata-JSON flag | Columns make selection and pruning cheap reads, and the `DEFAULT 'v1'` classifies every legacy checkpoint with no backfill. |
| Leave scoped checkpoints on v1 | The bug only affects full-DB serialization; rewriting the small, working scoped path would add risk for no user benefit. |
| Gate v2 selection on `vec_memories` only | `vec_metadata` is intentionally retained in main by shard-attach slimming, so gating on it left v2 permanently inert on sharded runtimes (see post-deploy fix). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS |
| `npm run typecheck` | PASS — 0 errors (post-fix) |
| Targeted vitest (v2 create/restore, v29 schema, handler) | PASS — 76/76, incl. new gate regression test |
| Multi-lens review (no P0/P1) | PASS — SAFE TO DEPLOY (note: missed the inert-selection bug; live verify caught it) |
| Live full-DB v2 CREATE on ~300 MB production DB | PASS — `snapshot_format=v2`, 297 MB main + 72 MB shard snapshot in 0.37 s, no `Invalid string length`; `PRAGMA integrity_check` ok on both files |
| Live restore round-trip (isolated scratch via real `reopenActiveDatabase`) | PASS — restored 9665 memories, `rowsTotal==ftsRowsTotal==vecRowsTotal`, errors `[]`, production untouched |
| v2-selection gate bug fixed + redeployed + re-verified | PASS — commit `cce4fe931d` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Snapshot disk footprint.** Each v2 snapshot is roughly database-sized (here ~369 MB for main+shard); the open question of a lower `MAX_CHECKPOINTS` for v2 and the free-space precheck policy remains as documented (see spec.md Open Questions). Non-blocking.
2. **Pre-existing degraded index.** Live `memory_health` consistency shows `orphanedFiles: 28` (old-path orphan rows from the 013 restructure) — equal `rowsTotal/ftsRowsTotal/vecRowsTotal`, alignment not data loss. This is the separate item-G cleanup, not a checkpoint-v2 issue.
3. **4 P2 fast-follows (non-blocking, documented in the 002 handover):** stale-`.bak` fsync ordering, post-`swap-done` in-process-revert determinism, a `.needs-rebuild` sentinel for post-`swap-done` derived staleness, and `.unclean-shutdown` git hygiene.
4. **Restore reopen coverage.** The real `reopenActiveDatabase` is exercised only by the live verification (unit tests inject a mock `reopen`); a future test could drive the real coordinator against a temp DB.
<!-- /ANCHOR:limitations -->
