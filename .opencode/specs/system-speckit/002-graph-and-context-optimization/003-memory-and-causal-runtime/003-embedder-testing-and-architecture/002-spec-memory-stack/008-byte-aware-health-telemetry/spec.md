---
title: "Feature Specification: Byte-Aware Health Telemetry"
description: "Add byte-aware memory diagnostics to context-server health reporting, opt-in V8 heap snapshots, and launcher support for explicit old-space caps. This packet implements Rec 7 from deep-research-005 so future memory reduction work can verify what is actually retained in RSS."
trigger_phrases:
  - "byte-aware health telemetry"
  - "heap snapshot opt-in"
  - "memory_health includeFullReport"
  - "context server old space cap"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry"
    last_updated_at: "2026-05-18T21:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed byte-aware telemetry packet"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0160020080000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Byte-Aware Health Telemetry

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
The live context-server RSS dropped sharply after the embedder cleanup packets, but `memory_health` still cannot attribute RSS to V8 heap, external memory, ArrayBuffers, or retained caches. Without byte-aware telemetry, future memory packets can mistake SQLite/native/external residency for JavaScript heap retention.

### Purpose
Expose opt-in, byte-aware diagnostics that help operators verify future memory reductions without changing the default compact health payload or enabling heap snapshots by default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `heap-profiler.ts` with process/V8 memory snapshot, opt-in snapshot writing, and cache byte estimates.
- Gate expanded `memory_health` telemetry behind `includeFullReport:true`.
- Add explicit launcher support for `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB`.
- Document the diagnostics surface and environment variables.
- Add focused Vitest coverage for profiler behavior and health payload compatibility.

### Out of Scope
- Reducing RSS directly; this packet is diagnostic only.
- Refactoring BM25 memory layout or cache eviction policy; those belong to future Recs 3/4/5/6 packets.
- Enabling heap snapshots or old-space caps by default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts` | Create | Detailed memory snapshot, heap snapshot writer, cache byte estimates |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Add `includeFullReport` handling and recommended action |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Add schema for `includeFullReport` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts` | Modify | Add tool cache byte estimate helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` | Modify | Add regex/cache byte estimate helper |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Pass configured old-space cap to context-server child |
| `.opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts` | Create | Profiler and health telemetry tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Document memory diagnostics |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document new env vars |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detailed memory snapshot exposes RSS, heap, external, ArrayBuffer, and V8 malloc fields | `getDetailedMemorySnapshot()` returns all seven requested numeric fields |
| REQ-002 | Heap snapshots are opt-in only | `writeHeapSnapshot()` throws without `SPECKIT_HEAP_SNAPSHOT_DIR` and writes private files when configured |
| REQ-003 | Default `memory_health` shape is backward compatible | `includeFullReport:false` omits extended telemetry fields |
| REQ-004 | Full health report includes byte-aware telemetry | `includeFullReport:true` returns memory snapshot, cache byte estimates, and `recommended_action` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Launcher old-space cap is explicit and child-only | `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` appends `--max-old-space-size=<mb>` only when set |
| REQ-006 | Operator docs explain safe usage | ENV reference and embedder architecture docs describe snapshot sensitivity and cap default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes for the 008 packet.
- **SC-002**: MCP server typecheck, targeted Vitest, and build all pass.
- **SC-003**: Live integration probe can import the new module and read all seven memory fields.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Heap snapshots can contain sensitive process memory | High | Require explicit `SPECKIT_HEAP_SNAPSHOT_DIR` and private permissions |
| Risk | Old-space caps can crash the daemon if set too low | Medium | Leave unset by default and document profiling-only use |
| Dependency | Existing cache modules expose enough counters | Low | Add byte estimate helpers only in scoped cache files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
