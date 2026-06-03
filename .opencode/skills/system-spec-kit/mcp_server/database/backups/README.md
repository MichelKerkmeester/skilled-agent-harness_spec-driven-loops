---
title: "Database Backups: Point-in-Time Safety Copies and Corruption Quarantine"
description: "Operator and recovery holding area for pre-migration and pre-breaking-change copies of the metadata database and for quarantined corrupt databases."
trigger_phrases:
  - "database backups"
  - "pre-migration backup"
  - "corrupt database quarantine"
  - "context-index backup"
---

# Database Backups: Point-in-Time Safety Copies and Corruption Quarantine

> Holding area for full copies of `context-index.sqlite` taken before risky, irreversible operations, and for databases quarantined after corruption. **Not written by any wired runtime code path** — this is an operator- and recovery-maintained folder.

---

## 1. OVERVIEW

`database/backups/` holds point-in-time copies of the canonical metadata database (`context-index.sqlite`) made before operations that cannot be cleanly undone, together with corrupt databases that were moved aside during recovery.

Unlike the sibling runtime directories, this one has **no automatic writer in the current source tree**. A grep of `mcp_server/lib`, `mcp_server/handlers`, and `mcp_server/scripts` finds no code that targets `database/backups/`; the only `backups` path the daemon manages is `../checkpoints/restore-backups/` (see [`../checkpoints/README.md`](../checkpoints/README.md)). Copies land here through two channels:

1. **Operator / migration safety copies** — a full copy taken (typically by hand or by a maintenance step) before a schema-version migration or a breaking change, so the prior database can be restored if the change goes wrong.
2. **Corruption quarantine** — a database that failed an integrity check is moved aside with a `.CORRUPT` marker so a healthy database can take its place, while the bad file is preserved for forensics.

The repo-root `.gitignore` ignores `database/**/*.sqlite*`, so the copies here (often 400 MB–1 GB+ each) are never committed; this `README.md` keeps the directory present in a clean checkout.

---

## 2. OBSERVED CONTENTS AND NAMING

These copies follow conventional, human-readable names rather than a code-enforced schema:

| Pattern | Meaning |
|---|---|
| `context-index-PRE-BC-<YYYYMMDD-HHMMSS>.sqlite` | Copy taken **before a breaking change** to the database or its handling. |
| `context-index-PRE-V<NN>-<YYYYMMDD-HHMMSS>.sqlite` | Copy taken **before migrating to schema version `NN`** (e.g. `PRE-V30` before the schema-v30 migration). |
| `context-index.CORRUPT-<YYYYMMDD-HHMMSS>.sqlite` | A database **quarantined after corruption** was detected, kept for diagnosis. |
| `*-shm` / `*-wal` siblings | SQLite sidecar files copied alongside a snapshot. They carry no value once the main file is at rest and can be discarded with it. |

Because the names are a convention, keep them descriptive (what was about to happen + a timestamp) so a future reader can tell why each copy exists.

---

## 3. STRUCTURE

```text
backups/
+-- README.md                                          # This file (keeps the directory present)
+-- context-index-PRE-BC-<ts>.sqlite                   # Pre-breaking-change copy
+-- context-index-PRE-V<NN>-<ts>.sqlite                # Pre-schema-migration copy
`-- context-index.CORRUPT-<ts>.sqlite                  # Quarantined corrupt database
```

---

## 4. WHEN A COPY BELONGS HERE (AND WHEN IT DOES NOT)

Put a copy here before an irreversible, database-wide operation: a schema-version migration, a breaking change to the storage format, or a destructive maintenance action — and move a corrupt database here during recovery.

Do **not** use this folder for the mechanisms the daemon already manages:

| Need | Correct location |
|---|---|
| Snapshot you intend to restore from | `../checkpoints/` (checkpoint-v2 `VACUUM ... INTO` snapshots via `checkpoint_create`). |
| Safety copy auto-written during a checkpoint restore | `../checkpoints/restore-backups/` (handled by `scripts/migrations/restore-checkpoint.ts`). |
| Legacy vector-shard relocation | Handled in place by `lib/search/db-shard-migration.ts` (renames the legacy shard alongside `vectors/`). |

---

## 5. BOUNDARIES AND RETENTION

| Boundary | Rule |
|---|---|
| Ownership | Operator/recovery-maintained. No runtime code reads or writes this folder, so nothing prunes it automatically. |
| Restoring | Never put a `.CORRUPT` file back as the live database. Restore from a `PRE-*` copy or a verified checkpoint instead. |
| Verify first | Confirm a copy opens as SQLite (`PRAGMA integrity_check`) before trusting it as a restore source. |
| Retention | Keep the most recent `PRE-*` copy until the new schema/behavior is proven, then prune older ones — these files are large. A `.CORRUPT` quarantine can be deleted once recovery is confirmed and a healthy backup exists. |
| Commits | Do not commit `.sqlite`, `-shm`, or `-wal` files. The repo-root `.gitignore` already covers `database/**/*.sqlite*`. |

---

## 6. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py \
  --type readme \
  .opencode/skills/system-spec-kit/mcp_server/database/backups/README.md
```

Use the SQLite CLI on a copy to validate any backup before relying on it. Use `memory_health` to confirm the live database is sound before deleting a recent safety copy.

---

## 7. RELATED

- [`../README.md`](../README.md) — Parent database directory contract.
- [`../checkpoints/README.md`](../checkpoints/README.md) — Code-managed snapshots and the `restore-backups/` safety copies.
- [`../../lib/storage/checkpoints.ts`](../../lib/storage/checkpoints.ts) — Checkpoint create/restore and the restore journal.
- [`../../lib/search/db-shard-migration.ts`](../../lib/search/db-shard-migration.ts) — Legacy shard relocation (renames in place; does not use this folder).
- [`../../context-server.ts`](../../context-server.ts) — Boot-time corruption detection and the FTS corruption runbook.
