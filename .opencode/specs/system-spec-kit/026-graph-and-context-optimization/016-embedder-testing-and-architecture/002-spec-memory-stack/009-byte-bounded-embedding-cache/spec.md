---
title: "Feature Specification: Byte-Bounded Embedding Cache"
description: "Convert the persistent embedding cache from a global count cap to byte-bounded, profile-aware, document/query-aware storage with health telemetry and query-cache wiring."
trigger_phrases:
  - "byte-bounded embedding cache"
  - "profile-aware embedding cache"
  - "query embedding cache"
  - "embedding cache byte budgets"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/009-byte-bounded-embedding-cache"
    last_updated_at: "2026-05-18T21:40:00Z"
    last_updated_by: "codex"
    recent_action: "Verified profile-aware byte cache"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
    session_dedup:
      fingerprint: "sha256:0160020090000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-002-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Byte-Bounded Embedding Cache

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The persistent `embedding_cache` table is capped by a global row count and keyed only by content hash, model, and dimensions. That lets historical embedder profiles accumulate without byte limits, and it prevents task-specific query/document embeddings from being cached safely.

### Purpose
Make the embedding cache byte-bounded, profile-keyed, and task-keyed so document writes and search queries can reuse compatible vectors without unbounded SQLite residency across embedder switches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Migrate `embedding_cache` to add `profile_key` and `input_kind`.
- Preserve legacy lookup/store callers while enabling exact profile/kind lookups.
- Replace count-only eviction with global, per-profile, query, and secondary entry budgets.
- Wire document save and query search paths to the scoped cache.
- Extend full `memory_health` reports with real embedding-cache bytes and profile/kind breakdowns.
- Add focused Vitest coverage and operator docs.

### Out of Scope
- Changing vector table selection or re-index semantics.
- Altering minimal `memory_health` payloads when `includeFullReport:false`.
- Committing generated `mcp_server/dist/` output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Modify | Schema migration, scoped cache API, byte-budget eviction |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` | Modify | Document cache lookup/store passes profile and kind |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modify | Query embedding cache lookup/store |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Full health report real bytes and profile breakdown |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedding-cache-byte-bounded.vitest.ts` | Create | Migration, keying, budget, and pragma coverage |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Profile-aware caching docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | New cache budget env vars |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cache schema stores profile and input kind | Fresh and migrated DBs expose `profile_key` and `input_kind` |
| REQ-002 | Profile/task keying prevents collisions | Same hash can exist for multiple profiles and for document/query kinds |
| REQ-003 | Byte budgets replace global count-only eviction | Global, profile, and query caps evict LRU rows under configured byte limits |
| REQ-004 | Legacy callers remain compatible | `lookupEmbedding(db, hash, model, dim)` still returns cached rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Document and query call sites use scoped cache keys | Save path uses `document`; search query path uses `query` |
| REQ-006 | Health report exposes real cache bytes | `includeFullReport:true` includes `embedding_cache_by_profile` |
| REQ-007 | Operator docs cover budgets | ENV reference and embedder architecture docs describe all four env vars |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for the 009 packet.
- **SC-002**: MCP server typecheck, targeted byte-bounded cache tests, existing cache tests, and build pass.
- **SC-003**: Integration probe verifies eviction on a fresh DB and observes `PRAGMA shrink_memory`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cloud embedding cache rows may evict sooner than before | Medium | Defaults are generous: 100 MB global, 50 MB per profile, 25 MB queries |
| Risk | Legacy DB migration must be idempotent | High | Detect columns before rename/create/insert/drop migration |
| Risk | Query cache must not reuse document vectors | High | Persist `input_kind` and include it in exact lookups |
| Dependency | Active embedder metadata | Medium | Derive profile key from `vec_metadata`, fall back to model/dim when absent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
