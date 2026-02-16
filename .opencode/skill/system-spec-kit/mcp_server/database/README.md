---
title: "MCP Server Database Storage"
description: "Runtime SQLite storage for memory index data, vectors, FTS, and coordination files."
trigger_phrases:
  - "database"
  - "sqlite"
  - "vector embeddings"
importance_tier: "normal"
---

# MCP Server Database Storage

## Overview

`dist/database/` is the canonical runtime persistence location when the MCP server runs from `dist/context-server.js`.

`database/` is the source-level compatibility view. In this repository, `database/context-index.sqlite` points to `../dist/database/context-index.sqlite`.

- Tracked in repo (source view): `.db-updated`, `.gitkeep`, `README.md`.
- Runtime-generated (canonical): `dist/database/context-index.sqlite` and WAL sidecars (`-wal`, `-shm`).

## Implemented State

- Primary table set includes `memory_index`, `vec_memories`, `memory_fts`, `checkpoints`, and `config`.
- Spec 126/127/129 alignment:
  - `memory_index.document_type` and `memory_index.spec_level` are part of schema v13.
  - Spec document indexing is first-class (not memory-only).
  - Anchor-based retrieval applies to indexed spec docs.
- `.db-updated` is used by `core/db-state.ts` to detect external writes and reinitialize connections.

## Hardening Notes

- Reinit safety is handled in `core/db-state.ts` (mutex + dependency rebind).
- Rate-limit timestamp is persisted in DB `config` table (`last_index_scan`).
- Document metadata remains preserved across update/reinforce/index paths (Spec 126 hardening follow-up).

## Operational Notes

- Database files are intentionally not committed; only control files are tracked.
- Single-database policy (this environment): use `dist/database/context-index.sqlite` as the only authoritative SQLite file.
- Source-path compatibility remains available through `database/context-index.sqlite` (symlink to canonical path).
- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
- Use `scripts/reindex-embeddings.ts` for forced rebuild workflows.

## Related

- `../core/README.md`
- `../handlers/README.md`
- `../../references/memory/memory_system.md`
