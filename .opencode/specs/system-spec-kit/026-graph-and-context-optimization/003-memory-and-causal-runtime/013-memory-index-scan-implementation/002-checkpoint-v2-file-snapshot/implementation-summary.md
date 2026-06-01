---
title: "Implementation Summary"
description: "Packet-creation state for checkpoint v2: the doc set is complete and the code is not yet written. This summary is reconciled per phase as Phase 1, 2, and 3 land."
trigger_phrases:
  - "checkpoint v2 implementation summary"
  - "checkpoint v2 phase status"
  - "vacuum into checkpoint progress"
  - "schema v29 implementation state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored checkpoint-v2 child packet docs"
    next_safe_action: "Dispatch Phase 1 schema v29 via cli-opencode"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - "lib/search/vector-index-store.ts"
      - "lib/search/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-v2-packet-setup"
      parent_session_id: null
    completion_pct: 0
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
| **Completed** | Not yet - packet-creation state |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is at creation state: the full Level 3 doc set is authored and the implementation has not started. Nothing has shipped yet. What follows describes what each phase will deliver so this summary can be reconciled in place as code lands.

### Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Packet setup (docs + metadata) | Done |
| Phase 1 | Schema v29 + includeEmbeddings wiring | Not started |
| Phase 2 | v2 CREATE (VACUUM INTO + manifest + selection) | Not started |
| Phase 3 | v2 RESTORE (reopen coordinator + file swap) | Not started |

### Planned: Schema v29 and the includeEmbeddings flag

Phase 1 will bump `SCHEMA_VERSION` to 29 and add the `snapshot_format` and `snapshot_path` columns so each checkpoint row records its format and snapshot location. It will also expose `includeEmbeddings` end to end through the `checkpoint_create` handler and tool schema. After this phase you can create v1 checkpoints exactly as before and read the new columns, with no create or restore behavior change yet.

### Planned: v2 CREATE

Phase 2 will add `createCheckpointV2`, which snapshots the main database and, when `includeEmbeddings` is set, the `active_vec` shard with `VACUUM INTO`, writes a manifest, and atomically renames a tmp dir into place. A scope-based selection branch sends unscoped full-DB requests to v2 and leaves scoped requests on v1. After this phase you can take a full-DB checkpoint on a large database without the `Invalid string length` failure.

### Planned: v2 RESTORE

Phase 3 will add the `reopenActiveDatabase` coordinator and `restoreCheckpointV2`, which restore by closing the live connection and swapping the snapshot files in, with `.bak` rollback and post-restore rebuilds. After this phase you can restore a full-DB checkpoint and have main and the vector shard come back consistent.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery has not started. The plan is three gated phases run by cli-opencode (`openai/gpt-5.5-fast --variant high`) inside a git worktree, each gated by `npm run typecheck` (0 new errors) plus `npm run test:core` (green) before the next. The orchestrator verifies each gate and owns all git writes. The real proof comes after a deliberate daemon rebuild and restart: a live full-DB `checkpoint_create` and a restore round-trip on the ~1 GB database, with `memory_health` reporting consistency. A mandatory post-implementation deep-review must surface no P0/P1 before any completion claim.
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
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS - this commit |
| `validate.sh --strict` on this packet | Run at packet creation; see status line |
| Phase 1 typecheck + test:core | Not started |
| Phase 2 typecheck + test:core | Not started |
| Phase 3 typecheck + test:core | Not started |
| Live full-DB create + restore round-trip on ~1 GB DB | Not started |
| Mandatory deep-review (no P0/P1) | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code shipped yet.** This is packet-creation state; all behavior described under "What Was Built" is planned, not delivered.
2. **Snapshot disk footprint.** Each v2 snapshot is roughly database-sized; the open question of a lower `MAX_CHECKPOINTS` for v2 and the free-space precheck policy is unresolved (see spec.md Open Questions).
3. **Parent pointer not updated.** This packet did not modify the parent 013 `graph-metadata.json` (no `last_active_child_id` write), to keep all writes inside this child folder. The orchestrator can set the parent pointer separately if desired.
<!-- /ANCHOR:limitations -->
