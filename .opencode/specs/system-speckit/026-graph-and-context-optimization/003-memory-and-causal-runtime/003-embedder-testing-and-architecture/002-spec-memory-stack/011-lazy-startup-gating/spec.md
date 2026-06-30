---
title: "Feature Specification: Lazy Startup Gating"
description: "Defer context-server memory runtime initialization until first memory-owning tool use while preserving lightweight health diagnostics."
trigger_phrases:
  - "lazy startup gating"
  - "memory runtime guard"
  - "runtime_initialized memory_health"
  - "context server lazy init"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented lazy runtime guard and ran verification gates"
    next_safe_action: "Resolve handler verification blocker"
    blockers:
      - "`npx vitest --run handlers` has no matching test files in mcp_server; singular `handler` exposes existing handler-memory-save failures outside this packet diff"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts"
    session_dedup:
      fingerprint: "sha256:0160020110000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-002-011"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Lazy Startup Gating

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented - Handler Verification Blocked |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`context-server.ts` opens SQLite and starts memory-owned background work during MCP startup. That keeps idle startup tied to DB residency, BM25 warmup, retry jobs, reindex resume, and startup scans even when the caller only needs lightweight tool discovery or health.

### Purpose
Split startup into a thin MCP bootstrap and a lazy memory-runtime guard so the first memory-owning tool initializes the database and dependent runtime work. `memory_health` remains callable before initialization and reports that the runtime is still cold.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `memory-runtime-guard.ts` with idempotent single-flight initialization.
- Register context-server DB, integrity, consumer, BM25, reindex, retry, watcher, and scan startup work behind the guard.
- Add `tryGetDb()` so health and session priming can inspect DB state without opening SQLite.
- Guard memory-owning handlers before DB access.
- Update `memory_health` with `runtime_initialized` while preserving compact telemetry.
- Add focused Vitest coverage and operator docs.

### Out of Scope
- New environment variables.
- Rewriting handler internals beyond guard injection.
- Moving SQLite writes outside the MCP process.
- Committing generated `mcp_server/dist/` output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts` | Create | Single-flight runtime guard |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Thin bootstrap plus registered init callback |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Non-initializing DB accessor |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/` | Modify | Guard DB-owning handlers |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Lightweight pre-init health status |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-guard.vitest.ts` | Create | Guard, health, and representative handler coverage |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Lazy startup gating docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime guard is idempotent and single-flight | Concurrent callers share one init promise; later calls return immediately |
| REQ-002 | Heavy memory startup work is lazy | DB open, integrity checks, BM25 warmup, reindex resume, retry manager, and startup scan run only behind guard |
| REQ-003 | Memory tools preserve behavior | DB-owning handlers initialize runtime before accessing the database |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Health stays lightweight | `memory_health` works pre-init and reports `runtime_initialized: false` without opening DB |
| REQ-005 | `tryGetDb()` is non-initializing | Returns `null` pre-init and the cached connection post-init |
| REQ-006 | Docs capture first-call latency trade-off | Embedder architecture diagnostics note explains lazy init and health field |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for the 011 packet.
- **SC-002**: MCP server typecheck, targeted guard tests, handler regression tests, context-server tests, and build pass or failures are documented with concrete blockers.
- **SC-003**: Integration probe verifies `memory_health` does not initialize runtime, a representative memory tool initializes once, and health reports initialized afterward.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | First memory call becomes slower | Medium | Accept per research and document trade-off |
| Risk | Pre-dispatch hooks accidentally open DB | High | Skip DB-backed priming until runtime is initialized or required |
| Risk | Handler direct unit tests bypass context-server registration | Medium | Guard tolerates missing registration and handlers retain existing DB access behavior |
| Dependency | Existing vector-index schema initialization | High | Guard wraps existing init path without schema redesign |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
