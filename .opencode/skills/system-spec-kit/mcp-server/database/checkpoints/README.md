---
title: "Database Checkpoints: Snapshot and Restore Storage"
description: "Runtime storage for checkpoint-v2 VACUUM-INTO snapshots, the restore journal, the rebuild sentinel, and pre-restore safety backups."
trigger_phrases:
  - "checkpoint snapshots"
  - "checkpoint_create storage"
  - "restore journal"
  - "needs-rebuild sentinel"
---

# Database Checkpoints: Snapshot and Restore Storage

> Runtime home for checkpoint-v2 snapshots and the restore machinery. Written only by the mk-spec-memory daemon. Often empty between checkpoints.

---

## 1. OVERVIEW

`database/checkpoints/` is the runtime directory where the MCP server stores point-in-time snapshots of the canonical metadata database and its active vector shard, plus the bookkeeping files that make a restore crash-safe.

Current responsibilities:

- Hold one subdirectory per checkpoint, each containing the VACUUM-INTO snapshot files produced by `checkpoint_create` (checkpoint-v2).
- Hold the **restore journal** that drives the atomic live/backup swap during `checkpoint_restore`.
- Hold the **`.needs-rebuild` sentinel**, which flags one of two distinct failure classes (see
  §4 below): a half-finished restore, which the daemon self-heals on the next boot, pre-scan, or
  scan-lease; or physical database corruption, which it deliberately does NOT auto-repair.
- Hold `restore-backups/`, the safety copies the raw restore script writes before it overwrites a live database.

The directory is created lazily with mode `0700` (owner-only) the first time a checkpoint is taken, so a clean checkout or a daemon that has never checkpointed will show only this `README.md`. Snapshot files are runtime artifacts: the repo-root `.gitignore` ignores `database/**/*.sqlite*`, so the `.sqlite`/`-shm`/`-wal` files here are never committed while this `README.md` keeps the directory present.

The default location is `<db-dir>/checkpoints`. It moves with the database when `MEMORY_DB_PATH` / `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` redirect storage.

---

## 2. ARCHITECTURE

```text
checkpoint_create  ──►  lib/storage/checkpoints.ts (createCheckpoint, v2)
                              │
                              ├─ mkdir checkpoints/<name>/  (mode 0700)
                              ├─ VACUUM main       INTO checkpoints/<name>/snapshot-main.sqlite
                              └─ VACUUM active_vec INTO checkpoints/<name>/snapshot-vec.sqlite
                                     │
                                     ▼
                    checkpoints table row records snapshot_path + snapshot_format
                                     │
checkpoint_restore ──►  restore journal written ──► live ⇄ backup atomic rename swap
                                     │
                          .needs-rebuild sentinel cleared on success;
                          left behind on crash so the next boot rebuilds
```

---

## 3. DIRECTORY TREE

```text
checkpoints/
+-- README.md                          # This file (keeps the runtime directory present)
+-- <checkpoint-name>/                 # One subdirectory per checkpoint
|   +-- snapshot-main.sqlite           # VACUUM main INTO — metadata + FTS snapshot
|   +-- snapshot-vec.sqlite            # VACUUM active_vec INTO — vector shard snapshot
|   `-- <manifest>                     # Checkpoint-v2 manifest read on restore
+-- <restore-journal>                  # Drives the atomic live/backup swap during restore
+-- .needs-rebuild                     # Sentinel: a restore did not finish; rebuild on next boot
`-- restore-backups/                   # Pre-restore safety copies written by restore-checkpoint.ts
    `-- <ts>__pre-restore-<dbname>     # Timestamped copy of the target DB before it is replaced
```

Everything except `README.md` is a generated runtime artifact.

---

## 4. WHAT LIVES HERE

| Entry | Written by | Purpose |
|---|---|---|
| `<name>/snapshot-main.sqlite` | `createCheckpoint` (`VACUUM main INTO`) | Self-contained snapshot of `context-index.sqlite` (metadata, FTS, checkpoint tables). |
| `<name>/snapshot-vec.sqlite` | `createCheckpoint` (`VACUUM active_vec INTO`) | Snapshot of the attached vector shard, so a restore keeps embeddings consistent with metadata. |
| `<name>/` manifest | `createCheckpoint` / `loadCheckpointV2Manifest` | Records the snapshot set so `restoreCheckpointV2` can validate and replay it. |
| restore journal | `restoreCheckpoint` | Records the in-flight live/backup file moves so an interrupted restore is recoverable. |
| `.needs-rebuild` | restore path | Set while a restore is mid-flight; its presence on boot triggers `repairNeedsRebuildSentinel` to rebuild derived state. |
| `restore-backups/` | `scripts/migrations/restore-checkpoint.ts` | Timestamped copy of a target database taken before the raw restore overwrites it. |

The `checkpoints` table inside `context-index.sqlite` stores each checkpoint's `snapshot_path` and `snapshot_format` (schema v29), which is how the daemon maps a checkpoint row to its subdirectory here.

### `.needs-rebuild`'s two sentinel classes

The sentinel file is shared by two failure classes with very different severity. Its `source`
field (a small JSON payload, not just a bare marker file) discriminates them:

| `source` | Meaning | Auto-repaired? |
|---|---|---|
| `swap_done_recovery` | A restore's live/backup file swap completed, but the daemon crashed before the derived-artifact rebuild (FTS shadow, BM25, communities, degree snapshots) finished. The main database itself is structurally sound and openable. | **Yes** — `repairNeedsRebuildSentinel` reruns the derived-artifact rebuild against the live connection and clears the sentinel on success. |
| `post_crash_integrity_probe` | A post-crash `PRAGMA quick_check(1)` found physical page corruption in the main database itself. | **No** — `repairNeedsRebuildSentinel` recognizes this class and skips the rebuild entirely (it would run repair SQL against tables the daemon itself already proved unsound), leaving the sentinel in place and logging a warning. Recovery requires the manual checkpoint-restore procedure below. |

A daemon boot that hits the corruption class also refuses to start (fail-safe by design) and logs
the sentinel's path plus a pointer to this section before exiting — see §5's recovery step.

---

## 5. LIFECYCLE AND FLOW

- **Create** — `checkpoint_create` (handler `handlers/checkpoints.ts` → `lib/storage/checkpoints.ts:createCheckpoint`) makes `checkpoints/<name>/` at mode `0700` and runs `VACUUM main INTO` and `VACUUM active_vec INTO` (busy-retry with backoff). `memory_bulk_delete` takes the same kind of safety checkpoint before a destructive delete.
- **List** — `checkpoint_list` reads the `checkpoints` table, filtered by spec-folder scope.
- **Restore** — `checkpoint_restore` writes the restore journal, renames the live database files to sibling `.bak` files during the file-swap, then atomically renames the snapshot into place (`live ⇄ backup`). `restoreCheckpointV2` validates the manifest before swapping. The `restore-backups/` directory is used by the raw restore migration script, not the MCP restore handler.
- **Self-heal** — on boot / pre-scan / scan-lease, the daemon sweeps stale checkpoint temp dirs and orphan snapshot dirs, and `repairNeedsRebuildSentinel` acts on a leftover `.needs-rebuild` — auto-repairing the derived-only class, skipping the corruption class (see §4).
- **Manual recovery from a corruption-class `.needs-rebuild`** — the daemon will not boot against a physically corrupt main database and does not attempt an automatic restore. A corruption-class sentinel is never auto-cleared (by design — `repairNeedsRebuildSentinel` only skips it, it never deletes it), so it persists until a human removes it. To recover: (1) stop the daemon if it is crash-looping; (2) restore a known-good snapshot with the `checkpoint_restore` MCP tool, or run `scripts/migrations/restore-checkpoint.ts` directly against a prior checkpoint under `checkpoints/<name>/`; (3) once the restored database opens and passes its own boot-time integrity probe, manually delete the stale `.needs-rebuild` file so it stops being (correctly, but now unnecessarily) treated as a live corruption signal; (4) restart the daemon.
- **Delete** — `checkpoint_delete` removes the row and its snapshot subdirectory.

---

## 6. BOUNDARIES

| Boundary | Rule |
|---|---|
| Writes | Only the mk-spec-memory daemon (`lib/storage/checkpoints.ts`) and the migration scripts write here. |
| Permissions | The directory is owner-only (`0700`). Do not loosen it; snapshots are full database copies. |
| Manual edits | Do not hand-edit snapshots or the journal. A torn snapshot set makes a restore unsafe. |
| Commits | Do not commit `.sqlite`, `-shm`, or `-wal` files. The repo-root `.gitignore` already covers `database/**/*.sqlite*`. |
| Cleanup | Stale temp dirs and orphan snapshot dirs are swept automatically; do not delete `<name>/` dirs that still have a live `checkpoints` row. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  --type readme \
  .opencode/skills/system-spec-kit/mcp-server/database/checkpoints/README.md
```

Use the `checkpoint_create`, `checkpoint_list`, and `checkpoint_restore` MCP tools to exercise live checkpoint state. Inspect snapshot files only on a copy, never while the daemon holds the live database.

---

## 8. RELATED

- [`../README.md`](../README.md) — Parent database directory contract.
- [`../vectors/README.md`](../vectors/README.md) — The `active_vec` shard that `VACUUM active_vec INTO` snapshots here.
- [`../../lib/storage/checkpoints.ts`](../../lib/storage/checkpoints.ts) — Canonical create/list/restore/delete + restore journal and `.needs-rebuild` sentinel.
- [`../../handlers/checkpoints.ts`](../../handlers/checkpoints.ts) — MCP tool handlers for the checkpoint lifecycle.
- [`../../scripts/migrations/create-checkpoint.ts`](../../scripts/migrations/create-checkpoint.ts) — CLI checkpoint creation (default out `<db-dir>/checkpoints`).
- [`../../scripts/migrations/restore-checkpoint.ts`](../../scripts/migrations/restore-checkpoint.ts) — Raw restore with pre-restore backup into `restore-backups/`.
