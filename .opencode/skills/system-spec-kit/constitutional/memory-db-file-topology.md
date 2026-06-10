---
title: "MEMORY — Spec-Kit DB File Topology (index vs vectors are SEPARATE files)"
importanceTier: constitutional
contextType: reference
last_confirmed: "2026-06-04"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - where is the memory database
  - context-index.sqlite location
  - where are embeddings stored
  - vector store location
  - wipe the memory db
  - reindex the memory db
  - restore the memory db
  - db integrity check
  - quick_check memory
  - causal graph location
  - daemon socket location
  - database parts locations
---

# Memory — Spec-Kit DB File Topology

> The Spec Kit Memory daemon stores its data across **multiple files**, not one. The lexical/index DB and the **embedding vectors live in separate SQLite files**. Treat them as one unit for any wipe / restore / integrity / reindex operation.

## Rule

The memory data lives under `.opencode/skills/system-spec-kit/mcp_server/database/`, split across distinct files. **Embeddings are NOT inside `context-index.sqlite`** — they are in separate per-embedding-profile files under `database/vectors/`. Any operation that wipes, restores, backs up, or integrity-checks the memory store **must treat the index DB and the active vector store together**, or the index and vectors silently diverge.

### Where each part lives

- **Main index DB** — `database/context-index.sqlite` (+ `-wal`, `-shm`).
  Holds lexical + FTS (`memory_index`, `memory_fts*`), the **causal graph** (`causal_edges`, `memory_entities`, `entity_catalog`, `memory_summaries`, `graph_communities`), `checkpoints`, `config`, `vec_metadata` (vector *metadata/linkage*, not the vectors), and scoring/working tables. Schema version in `schema_version` (currently v30, `journal_mode=wal`).
- **Embedding vectors** — `database/vectors/` — one SQLite file **per embedding profile**, filename encodes `provider__model__dim`:
  - `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` (+ `-wal`, `-shm`) — the active Ollama store (~70MB). Contains the vec0 virtual tables (`vec_768`, `vec_memories`, `vec_memories_rowids`) and an `embedding_cache` (hash-keyed) that lets a reindex reuse vectors without re-embedding.
  - `context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` — alternate (hf-local) profile.
- **Checkpoints** — `database/checkpoints/` (v2 `VACUUM INTO` snapshots). **Backups** — `database/backups/`. **Migrations** — `database/migrations/`.
- **Runtime state (in `database/`)** — `.mk-spec-memory-launcher.json` (the shared-daemon **lease**: `{pid, ownerPid, childPid}`), `.unclean-shutdown` and `.needs-rebuild` (boot self-heal **sentinels**).
- **IPC socket (NOT under `database/`)** — `/tmp/mk-spec-memory/daemon-ipc.sock`, dir pinned by `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory`. New sessions bridge to the owner daemon over this socket.
- **Path overrides** — `SPECKIT_DB_DIR` / `SPEC_KIT_DB_DIR` move the DB dir; the vector filename is auto-derived from the active embedding profile (provider/model/dim).

## Why

On 2026-06-04 an operator assumed embeddings lived inside `context-index.sqlite`. A `quick_check`/wipe/recovery that touched only `context-index.sqlite` would have left the `database/vectors/` store unmanaged, diverging index rows from their vectors. Real corruption hit `memory_index` (from a concurrent **second** direct SQLite connection writing while the daemon was live — a single-writer violation), and recovery required reasoning about both files. Knowing the split up front prevents half-recoveries, false "DB is clean" conclusions, and orphaned vectors. (Owner directive, 2026-06-04.)

## How to apply

1. **Wipe / restore / backup** → act on **both** `context-index.sqlite` (+ wal/shm) **and** `database/vectors/<active-profile>.sqlite` (+ wal/shm) as a unit. A full from-source reindex discards the causal graph (it lives in `context-index.sqlite`), so plan to re-enrich after.
2. **Integrity** → run `PRAGMA quick_check` on **each** file; reconcile `memory_index` count vs `memory_fts` count vs vector rows. `quick_check ok` on the index alone does **not** certify embeddings.
3. **Single-writer discipline** → the daemon is the sole writer. **Never** open a second direct SQLite connection (e.g. a backfill script) against the live DB while the daemon runs — that caused the 2026-06-04 corruption. Backfill through the daemon, or with the daemon stopped (exclusive).
4. **Recycle via the supervisor, never external child-kill** → to recycle, SIGTERM the **launcher** (it supervises respawn + lease) or let the RSS watchdog; do not `kill`/`pkill` the daemon **child** directly (it races the supervisor and the lease `childPid`, and can wedge new-session connects).
5. **Connectivity check (read-only)** → a JSON-RPC `initialize` to `/tmp/mk-spec-memory/daemon-ipc.sock` returning in <100ms with `serverInfo.name=mk-spec-memory` means new sessions will connect; no process action needed.

## When this rule does NOT apply

- Read-only inspection (you may open any file with `?mode=ro` without coordinating the pair).
- Routine `memory_save` / search through the daemon (it manages the index↔vector linkage internally).
