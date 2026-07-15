---
title: "Plan: Canonical Vector Shard Split"
description: "Implementation plan for splitting canonical memory metadata from per-profile vector/cache shards."
trigger_phrases:
  - "canonical vector shard split plan"
  - "active_vec attach plan"
  - "legacy profile db migration plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/012-canonical-vector-shard-split"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded implementation and verification plan"
    next_safe_action: "Stage source-only path list from commit handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/db-shard-migration.ts"
    session_dedup:
      fingerprint: "sha256:0160020121111111111111111111111111111111111111111111111111111111"
      session_id: "phase-016-002-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Canonical Vector Shard Split

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replace full per-profile SQLite stores with one canonical metadata database and an attached profile shard for vector/cache payloads. The split must be transparent to runtime callers and preserve a rollback path for migrated legacy files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rec 6 source evidence read.
- [x] Predecessor packets 007-011 constraints incorporated.
- [x] Scope limited to canonical/shard storage, telemetry, tests, docs, and packet files.

### Definition of Done
- [x] Strict packet validation passes.
- [x] MCP typecheck, build, and targeted regression suites pass; `handler-memory-save` matches the expected 11 pre-existing atomic-save-injection failures.
- [x] Dedicated canonical-vector-shard suite covers migration, attach, WAL, cache, profile swap, vector query, mutation, integrity, and checkpoints.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Area | Plan |
|------|------|
| Paths | Canonical `context-index.sqlite`; shard `vectors/context-vectors__<slug>.sqlite` |
| Attach | Attach active profile shard as `active_vec` after DB open and before schema/cache users run |
| Migration | Copy legacy canonical tables into `context-index.sqlite`, vector/cache tables into shard, then move legacy file to `database/migrations/` |
| Query/mutation | Qualify vector/cache access through `active_vec` with helper functions |
| Health | Report canonical/shard paths, sizes, attach state, and active profile |
| Compatibility | Keep `getDatabasePath()` alias and temp vector aliases for legacy internal callers during transition |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add profile path helpers and shard attach/detach lifecycle.
2. Add migration helper and canonical cleanup.
3. Qualify vector queries, mutations, and embedding cache access.
4. Extend health telemetry and checkpoint compatibility.
5. Add dedicated tests, docs, and packet metadata.
6. Run full verification gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run `canonical-vector-shard` for split-specific coverage.
- Run vector-index, embedding-cache, handler-memory-save, memory-runtime-guard, typecheck, and build gates for regressions.
- Use an integration-style migration probe in the dedicated suite to validate legacy file copy, shard attach, query, and metadata consistency.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 011 lazy startup gating controls when attach and migration run.
- Packet 009 profile-aware cache requires `embedding_cache` to live in the active profile shard.
- Packet 008 health telemetry is extended with canonical/shard split sizes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the moved legacy profile DB from `mcp_server/database/migrations/legacy_<slug>_<timestamp>.sqlite.bak`.
- Remove the generated canonical/shard files only after the rollback copy is verified.
- Revert source changes without committing generated `dist/` output.
<!-- /ANCHOR:rollback -->
