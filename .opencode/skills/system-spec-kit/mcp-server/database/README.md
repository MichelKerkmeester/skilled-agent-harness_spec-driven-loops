---
title: "MCP Server Database Storage"
description: "Runtime database directory for memory, code graph, evaluation and state marker files."
trigger_phrases:
  - "database"
  - "sqlite storage"
  - "database directory"
---

# MCP Server Database Storage

---

## 1. OVERVIEW

`mcp-server/database/` is the default runtime storage directory for MCP server SQLite files. It is a data directory, not a TypeScript source module folder.

Current responsibilities:

- Store local memory index, FTS and checkpoint data at runtime.
- Store per-embedder vector shards under `vectors/` per ADR-012.
- Store checkpoint-v2 snapshots and restore bookkeeping under `checkpoints/`.
- Hold generated repair and corruption artifacts beside the live database when runtime or maintenance paths create root-level `.corrupt-*` or `.pre-repair-*` copies; `backups/` remains an operator-maintained holding area.
- Hold reserved space for future per-server schema migrations under `migrations/`.
- Store structural code graph and evaluation databases when the default path is active.
- Provide marker files used by runtime state checks.
- Hold launcher runtime files: the owner lease, and (when `SPECKIT_LAUNCHER_LOG` is enabled, the default) the persistent launcher log `.mk-spec-memory-launcher.log` plus its rotated `.prev.log` generation. These are gitignored runtime artifacts, not source.

The default path is resolved through shared path and config helpers. Runtime variables such as `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` can point storage elsewhere.

Four subdirectories live alongside the SQLite databases. `vectors/` holds per-embedder shard files, with one shard per provider, model and dimension. `checkpoints/` holds checkpoint-v2 snapshots plus the restore journal and `.needs-rebuild` sentinel, written by the daemon. `backups/` is an operator- and recovery-maintained area for manually placed pre-migration safety copies and quarantined corrupt databases, with no wired runtime writer. Runtime and maintenance repair paths may instead leave `context-index.sqlite.corrupt-*` or `context-index.sqlite.pre-repair-*` files in the database root; prune those root-level artifacts with the same verification and retention rules as backups. `migrations/` is reserved infrastructure for future per-server schema migrations and is empty today. See [`./vectors/README.md`](./vectors/README.md), [`./checkpoints/README.md`](./checkpoints/README.md), [`./backups/README.md`](./backups/README.md), and [`./migrations/README.md`](./migrations/README.md) for the rules that govern each folder.

---

## 2. ARCHITECTURE

```text
MCP server runtime
        │
        ▼
shared path and config helpers
        │
        ▼
mcp-server/database/
        │
        +--> state marker files
        +--> generated SQLite databases
        `--> generated SQLite sidecar files
```

---

## 3. PACKAGE TOPOLOGY

```text
database/
+-- README.md       # Directory guide
+-- .gitkeep        # Keeps the runtime directory present in clean checkouts
+-- .db-updated     # Runtime update marker
+-- vectors/        # Per-embedder vector shards (ADR-012)
+-- checkpoints/    # Checkpoint-v2 snapshots + restore journal (daemon-written)
+-- backups/        # Operator/recovery safety copies + corruption quarantine
`-- migrations/     # Reserved for future per-server schema migrations
```

Generated database files are runtime artifacts. They are not source modules and should not be listed as key source files.

---

## 4. DIRECTORY TREE

```text
database/
+-- README.md
+-- .gitkeep
+-- .db-updated
+-- *.sqlite                       # Generated runtime databases
+-- *.sqlite.corrupt-*             # Root-level corruption quarantine artifacts
+-- *.sqlite.pre-repair-*          # Root-level pre-repair safety copies
+-- *.db                           # Generated runtime databases
+-- *-wal                          # Generated SQLite write-ahead logs
+-- *-shm                          # Generated SQLite shared-memory files
+-- vectors/
|   +-- README.md                  # Per-embedder shard rules
|   `-- context-vectors__*.sqlite  # Generated per-embedder shards
+-- checkpoints/
|   +-- README.md                  # Checkpoint snapshot + restore rules
|   `-- <name>/snapshot-*.sqlite   # VACUUM-INTO checkpoint snapshots (daemon-written)
+-- backups/
|   +-- README.md                  # Safety-copy + quarantine conventions
|   `-- context-index-*.sqlite     # Pre-migration / pre-breaking-change / CORRUPT copies
`-- migrations/
    +-- README.md                  # Future migration policy
    `-- .gitkeep                   # Keeps the reserved folder present
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `README.md` | Explains the database directory contract. |
| `.gitkeep` | Keeps the directory available before runtime files exist. |
| `.db-updated` | Stores the last database update timestamp for runtime refresh checks. |
| `vectors/` | Per-embedder vector shard directory governed by ADR-012. See [`./vectors/README.md`](./vectors/README.md). |
| `checkpoints/` | Checkpoint-v2 snapshots, restore journal, and `.needs-rebuild` sentinel, written by the daemon. See [`./checkpoints/README.md`](./checkpoints/README.md). |
| `backups/` | Operator/recovery safety copies of the metadata DB and quarantined corrupt databases when manually moved there. See [`./backups/README.md`](./backups/README.md). |
| `migrations/` | Reserved directory for future per-server schema migrations. See [`./migrations/README.md`](./migrations/README.md). |

Runtime artifacts include `context-index*.sqlite`, `code-graph.sqlite`, `speckit-eval.db`, `*-wal` and `*-shm` files. Root-level `context-index.sqlite.corrupt-*` files are quarantined corrupt copies, and root-level `context-index.sqlite.pre-repair-*` files are pre-repair safety copies; keep only the most recent copy needed for recovery evidence and delete stale ones after the live database has passed health checks. Vector shards live in `vectors/` as `context-vectors__<provider>__<model>__<dim>[__<quant>].sqlite`. The active production shard today is `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` at about 15 MB. Treat all of these as generated data, not source files.

---

## 6. BOUNDARIES AND FLOW

This directory owns storage location only. Schema creation, indexing, code graph scans and health checks live in MCP server code and scripts outside this folder. Vector shard schemas under `vectors/` are created lazily on first attach by `mcp-server/dist/lib/search/vector-index-store.js` through `ensure_vector_shard_schema()`, which derives the dim-tagged virtual table name from `vector_table_name_for_profile()`. The `migrations/` folder stays empty until a true breaking schema change ships. The runtime uses `CREATE TABLE IF NOT EXISTS` for normal schema evolution.

Main flow:

```text
runtime config -> database path resolution -> SQLite read or write -> .db-updated marker refresh -> health or search tools observe state
```

Do not commit generated SQLite databases, vector shards or sidecar files. The existing `.gitignore` for this folder already covers `*.sqlite`, `*.sqlite-shm` and `*.sqlite-wal` patterns. Test fixtures that need a real database belong outside this runtime directory.

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/database/README.md
```

Use MCP memory and code graph health tools to validate live database state.

---

## 8. RELATED

- `./vectors/README.md`
- `./checkpoints/README.md`
- `./backups/README.md`
- `./migrations/README.md`
- `../core/README.md`
- `../handlers/README.md`
- `../../references/memory/memory-system.md`
- `../../scripts/memory/README.md`
