---
title: "EX-037 -- Checkpoint v2 file-snapshot round-trip (checkpoint_create / checkpoint_restore)"
description: "This scenario validates the v2 file-based full-DB checkpoint path for `EX-037`. It focuses on a VACUUM-INTO create then a restore round-trip, asserting snapshot_format/snapshot_path, restore-journal crash-safety, and the sharded active_vec case."
---

# EX-037 -- Checkpoint v2 file-snapshot round-trip (checkpoint_create / checkpoint_restore)

## 1. OVERVIEW

This scenario validates Checkpoint v2 file-based full-DB snapshots for `EX-037`. It focuses on a full-DB `checkpoint_create` that snapshots the database with SQLite `VACUUM INTO` (rather than the v1 `JSON.stringify` BLOB), then a `checkpoint_restore` round-trip that swaps the active DB files in place. Run it against a disposable copy of the database so the in-place restore never touches production.

Unlike the v1 checkpoint scenarios (`EX-015`..`EX-018`), the v2 path is selected for unscoped full-DB requests. On a sharded runtime the vectors live in the attached `active_vec` shard, so the create snapshots both the main DB and the shard when `includeEmbeddings` is set, and the restore swaps both files in through the `reopenActiveDatabase` coordinator. The user-observable value is a real rollback net on the production-sized database, where v1 throws `Invalid string length`.

> **Sandbox-only.** This scenario creates and restores a full-DB snapshot. Run it only against a disposable copy of the database, never on an active project DB. The `VACUUM INTO` create and the restore both complete in seconds on the production-sized DB.

---

## 2. SCENARIO CONTRACT

- Objective: Full-DB v2 create then restore round-trip with format and consistency verification.
- Real user request: `I'm about to run a risky migration on the full memory DB. Take a real rollback checkpoint, then prove I can restore it.`
- Prompt: `Validate the v2 full-DB checkpoint path: create an unscoped checkpoint with includeEmbeddings, confirm snapshot_format='v2' and a snapshot_path directory, then restore it in place against a disposable DB copy and confirm memory_health consistency. Return a concise pass/fail verdict with cited field names.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `snapshot_format='v2'`, a populated `snapshot_path` snapshot directory, a `manifest.json` recording the main/vec table split, restore round-trip restores main plus the `active_vec` shard, and `memory_health` reports consistent row totals.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the v2 snapshot is created with no `Invalid string length` and the restore round-trip restores a consistent database.

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate the v2 full-DB checkpoint create against checkpoint_create(name, includeEmbeddings:true) with no scope. Verify the new checkpoint records snapshot_format='v2' and a populated snapshot_path, and that no Invalid string length error is thrown. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. checkpoint_create(name:`<checkpoint-name>`, includeEmbeddings:true)
2. checkpoint_list()
3. Inspect the created snapshot directory under the checkpoints path for `snapshot-main.sqlite`, the optional `snapshot-vec.sqlite`, and `manifest.json`.

### Expected

The unscoped full-DB request routes to v2: the `checkpoints` row carries `snapshot_format='v2'` and a `snapshot_path` directory, `memory_snapshot` is NULL, and `manifest.json` records the main-vs-vec table split. No `Invalid string length` error appears.

### Evidence

Create output, `checkpoint_list` row showing the v2 format, and the snapshot directory contents (main snapshot, optional vec snapshot, manifest).

### Pass / Fail

- **Pass**: the v2 snapshot directory and `manifest.json` exist, the row shows `snapshot_format='v2'`, and no string-size error is raised
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

If the request falls back to v1 on a sharded daemon, inspect `lib/storage/checkpoints.ts` `hasMainVectorPayloadTables` — the v2-selection gate must key on `vec_memories` only, because shard-attach slimming intentionally retains `vec_metadata` in main. Inspect `createCheckpointV2` (`lib/storage/checkpoints.ts`) and the `VACUUM main INTO` / `VACUUM active_vec INTO` calls if the snapshot files are missing.

---

### Prompt

```
As a lifecycle validation operator, validate the v2 restore round-trip against checkpoint_restore for the v2 checkpoint, run against a disposable DB copy so the in-place swap never touches production. Verify main and the active_vec shard are restored and memory_health reports rowsTotal == ftsRowsTotal == vecRowsTotal. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Point the MCP server at a disposable copy of the database (set `MEMORY_DB_PATH` / `SPEC_KIT_DB_DIR` to the sandbox copy before the daemon starts) so the in-place restore never touches production.
2. checkpoint_restore(name:`<checkpoint-name>`) — the restore swaps the active DB files in place via the reopen coordinator; there is no per-call scratch target.
3. memory_health() and confirm the index/consistency block reports aligned totals.

### Expected

Restore routes through `reopenActiveDatabase`, which checkpoints both schemas, detaches the shard, closes the connection, swaps the snapshot files in, and reopens via `initialize_db` (reattaching the shard and reloading sqlite-vec). After restore, `memory_health` reports `rowsTotal == ftsRowsTotal == vecRowsTotal`.

### Evidence

Restore transcript, the post-restore `memory_health` index/consistency block, and confirmation the server was pointed at the disposable DB copy so production was untouched.

### Pass / Fail

- **Pass**: the restore completes through the reopen coordinator and `memory_health` reports aligned row totals on the restored disposable DB copy
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `reopenActiveDatabase` in `lib/search/vector-index-store.ts` if the shard fails to reattach, and `restoreCheckpointV2` in `lib/storage/checkpoints.ts` for the file-swap and `.bak` rollback path.

---

### Prompt

```
As a lifecycle validation operator, validate the restore-journal crash-safety note for the v2 restore path. Confirm the two-phase journal (swap-pending -> swap-done) means an interrupted restore rolls back only while pending and keeps the restored snapshot once done. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Review the restore-journal contract in `lib/storage/checkpoints.ts` (`.restore-journal.json`, phases `swap-pending` and `swap-done`).
2. Confirm the boot-recovery behavior: a restore interrupted while `swap-pending` rolls back from `.bak`; a restore already `swap-done` keeps the restored snapshot.

### Expected

The v2 restore writes a `.restore-journal.json` with phase `swap-pending` before the file swap and advances it to `swap-done` after. Boot recovery rolls back only the still-pending case, so an operator who interrupts a restore mid-swap recovers a consistent database.

### Evidence

The journal-phase contract from `lib/storage/checkpoints.ts` and the documented boot-recovery rule.

### Pass / Fail

- **Pass**: the two-phase journal contract is present and the pending-vs-done recovery rule is correct
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect the `RestoreJournalPhase` type and `writeRestoreJournal` usage in `lib/storage/checkpoints.ts` if recovery rolls back a completed restore or keeps a half-swapped one.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Checkpoint v2 create/restore: `mcp_server/lib/storage/checkpoints.ts` (`createCheckpointV2`, `restoreCheckpointV2`, `VACUUM ... INTO`, `.restore-journal.json`)
- Reopen coordinator: `mcp_server/lib/search/vector-index-store.ts` (`reopenActiveDatabase`)
- Schema marker: `mcp_server/lib/search/vector-index-schema.ts` (migration v29: `snapshot_format`, `snapshot_path`)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-037
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/050-checkpoint-v2-file-snapshot-roundtrip.md`
- Source anchors read: `mcp_server/lib/storage/checkpoints.ts` (`createCheckpointV2` ~L2181, `VACUUM main INTO`/`VACUUM active_vec INTO` ~L2217/2220, `restoreCheckpointV2` ~L2489, `RestoreJournalPhase` ~L385, `RESTORE_JOURNAL_NAME` ~L117); `mcp_server/lib/search/vector-index-schema.ts` (migration v29 `snapshot_format`/`snapshot_path` ~L1375-1381)
- Destructive: Yes — sandbox-only; restore swaps the active DB files in place, so the server must be pointed at a disposable DB copy.
- Runtime policy: Real execution only; no mocked snapshot or fake restore.
