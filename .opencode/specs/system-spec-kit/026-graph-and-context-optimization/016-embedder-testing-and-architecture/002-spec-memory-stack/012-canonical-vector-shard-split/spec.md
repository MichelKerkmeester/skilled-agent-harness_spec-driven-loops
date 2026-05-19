---
title: "Feature Specification: Canonical Vector Shard Split"
description: "Split spec-memory storage into a stable canonical metadata DB plus per-profile attached vector/cache shards."
trigger_phrases:
  - "canonical vector shard split"
  - "context-index.sqlite canonical db"
  - "active_vec vector shard"
  - "per-profile vector shard"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented canonical metadata DB plus active vector shard split"
    next_safe_action: "Stage source-only path list from commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/canonical-vector-shard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020120000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-002-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Canonical Vector Shard Split

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented - Verified |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Embedding-profile experiments currently create full per-profile `context-index__<slug>.sqlite` stores. That duplicates canonical memory metadata, lineage, FTS, governance, checkpoints, and session state across profile files and can keep old vector/cache pages hot during profile switches.

### Purpose
Use one stable canonical metadata DB, `context-index.sqlite`, and move profile-specific vector/cache payloads into attached shard files under `vectors/context-vectors__<slug>.sqlite`. The active shard is attached as `active_vec` during guarded memory-runtime initialization.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add canonical/shard path helpers while keeping `getDatabasePath()` backward compatible.
- Attach, detach, and telemetry helpers for `active_vec`.
- Migrate legacy single-profile DBs into canonical plus shard files, preserving rollback backups.
- Move vector, dim-table, and embedding-cache reads/writes to the active shard.
- Keep canonical metadata, lineage, FTS, projection, governance, checkpoints, and session state in `context-index.sqlite`.
- Add shard integrity checks, WAL coverage, health telemetry, tests, and storage-layout docs.

### Out of Scope
- New environment variables.
- Deleting migrated legacy DB backups automatically.
- Committing generated `mcp_server/dist/` output.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- `getCanonicalDatabasePath(baseDir)` returns `context-index.sqlite`.
- `getVectorShardPath(baseDir)` creates `vectors/` and returns `context-vectors__<slug>.sqlite`.
- Runtime init migrates active legacy profile DBs before attaching the active shard.
- `active_vec` uses WAL and low-memory shard pragmas.
- Shard `vec_metadata` must match the canonical active embedder provider, model, and dimension.
- Full `memory_health` reports canonical and active shard paths, sizes, attach status, and profile.
- Existing checkpoint tables continue to live in the canonical DB.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Fresh canonical stores create an attached shard with vector/cache schema.
- Legacy single DB migration moves vector/cache payloads to a shard and stages the old file under `database/migrations/`.
- Vector search, vector mutations, embedding cache, profile swaps, checkpoint operations, and runtime guard behavior pass targeted tests.
- Both canonical and shard files use WAL.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Migration is destructive only in the sense that the legacy live path is moved; the backup remains in `database/migrations/` for rollback.
- Attached sqlite-vec virtual tables must stay compatible with WAL and checkpoint operations.
- Existing callers that still use unqualified `vec_memories` depend on temporary aliases until follow-up cleanup removes them.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this packet.
<!-- /ANCHOR:questions -->
