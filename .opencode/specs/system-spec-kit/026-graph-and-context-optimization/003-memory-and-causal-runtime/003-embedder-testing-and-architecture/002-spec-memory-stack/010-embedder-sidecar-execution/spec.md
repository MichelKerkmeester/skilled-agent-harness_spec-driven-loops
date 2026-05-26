---
title: "Feature Specification: Embedder Sidecar Execution"
description: "Isolate heavy local embedder runtimes into lazy child-process sidecars while keeping vector cache and SQLite writes in the MCP process."
trigger_phrases:
  - "embedder sidecar execution"
  - "hf-local sidecar"
  - "local embedder process isolation"
  - "sidecar_workers memory health"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified embedder sidecar execution"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0160020100000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Embedder Sidecar Execution

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
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remaining in-process local embedding provider, `hf-local`, loads Transformers.js model state into the MCP daemon. That keeps the daemon's RSS high after local embedding use, while Ollama, Voyage, and OpenAI already keep model memory outside the MCP process.

### Purpose
Route local in-process embedding runtimes through lazy child-process sidecars so heavy model memory can be evicted after idle, while query caching, reindex vector writes, and database ownership remain in the MCP process.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a JSONL stdio sidecar client implementing `EmbedderAdapter`.
- Add a sidecar worker that lazily creates concrete shared embedding providers.
- Add execution policy env vars for `auto`, `direct`, and `sidecar`.
- Route query embedding and reindex jobs through the execution router.
- Add full-report health telemetry for currently spawned sidecar workers.
- Add focused Vitest coverage and operator docs.

### Out of Scope
- Moving SQLite writes, cache writes, or vector table mutation into sidecars.
- Changing the active embedder selection precedence.
- Reintroducing llama-cpp provider source.
- Committing generated `mcp_server/dist/` output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Create | JSONL stdio client, lazy fork, ping, idle eviction |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Create | Child process provider runner |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Create | Direct/sidecar policy router |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modify | Query embedding uses execution router |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Reindex jobs use execution router |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Full report includes `sidecar_workers` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts` | Create | Sidecar lifecycle and policy tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Sidecar execution docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Sidecar env vars |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sidecar client implements `EmbedderAdapter` | `embed()` returns `Float32Array[]` and supports query/document input type |
| REQ-002 | Worker is lazy and multiplexed | No fork before first embed; numeric ids correlate responses |
| REQ-003 | Idle eviction removes local model RSS | Worker exits after configured idle timeout and respawns on next request |
| REQ-004 | Health ping protects requests | Ping timeout causes respawn before embedding |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `auto` policy sidecars local in-process providers | `hf-local`, future `sentence-transformers`, and future `llama-cpp` route sidecar; Ollama/Voyage/OpenAI stay direct |
| REQ-006 | Call sites preserve DB ownership | Query and reindex embeddings use router; cache and vector writes stay in MCP process |
| REQ-007 | Full health report lists live workers | `memory_health({includeFullReport:true})` includes `sidecar_workers` |
| REQ-008 | Backward compatibility remains transparent | Existing query embedding callers still receive the same return shape |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for the 010 packet.
- **SC-002**: MCP server typecheck, targeted sidecar tests, existing embedder tests, and build pass.
- **SC-003**: Integration probe verifies five sidecar embed requests reuse one worker, idle eviction occurs, and the next request respawns.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sidecar spawn adds first-request latency | Medium | Keep direct policy available and document idle trade-off |
| Risk | Worker failures can hide behind stdio protocol | High | Return structured error responses and reject matching request promises |
| Risk | Signal hooks can interfere with daemon shutdown | Medium | Keep shutdown best-effort and avoid eager sidecar creation |
| Dependency | Shared embedding factory | High | Worker uses existing provider factory to preserve provider behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
