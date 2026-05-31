---
title: "Migration checkpoint scripts"
description: "Migration checkpoint scripts create and restore raw SQLite file-level backups for pre-migration safety outside the MCP checkpoint tables."
trigger_phrases:
  - migration checkpoint scripts
  - create-checkpoint
  - restore-checkpoint
  - SQLite file backup
  - pre-migration safety
---

# Migration checkpoint scripts

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Migration checkpoint scripts create and restore raw SQLite file-level backups for pre-migration safety outside the MCP checkpoint tables.

Before the system upgrades its database structure, these scripts take a full backup of the database file so you can roll back if something goes wrong. It is like making a photocopy of an important form before you fill it in: if you make a mistake, you can start over from the clean copy.

---

## 2. HOW IT WORKS

Two raw SQLite helpers live under `mcp_server/scripts/migrations/` for pre-migration safety outside the MCP checkpoint tables.

`create-checkpoint.ts` copies a target SQLite file into a timestamped checkpoint file, writes a JSON sidecar with schema version, size, note and memory roadmap rollout metadata and supports `--json` output for automation. `restore-checkpoint.ts` restores a checkpoint into a target database path, creates a timestamped pre-restore backup when replacing an existing file and verifies that the restored file opens as SQLite before reporting success.

These scripts are intentionally separate from the `checkpoint_create` / `checkpoint_restore` MCP tools. The MCP tools serialize logical memory state into the `checkpoints` table, while the migration helpers operate directly on database files so schema and migration experiments can be rolled back even when the logical checkpoint tables themselves are in flux.

Both scripts now expose testable helpers (`parseArgs`, `main`, `runCreateCheckpoint`, `runRestoreCheckpoint`) so behavior can be verified without spawning a separate process.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/scripts/migrations/create-checkpoint.ts` | Script | Raw SQLite checkpoint creation and sidecar metadata emission |
| `mcp_server/scripts/migrations/restore-checkpoint.ts` | Script | Raw SQLite checkpoint restore with optional pre-restore backup |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Memory roadmap metadata attached to checkpoint sidecars |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/migration-checkpoint-scripts.vitest.ts` | Automated test | Checkpoint creation, metadata sidecars, restore behavior and backup creation |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/212-migration-checkpoint-scripts.md`

Related references:
- [211-watcher-delete-rename-cleanup.md](211-watcher-delete-rename-cleanup.md) — Watcher delete/rename cleanup
- [213-schema-compatibility-validation.md](213-schema-compatibility-validation.md) — Schema compatibility validation

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 127
