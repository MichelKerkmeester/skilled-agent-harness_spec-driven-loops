---
title: "Implementation Plan: Byte-Aware Health Telemetry"
description: "Implement process/V8 memory telemetry as an opt-in health expansion, preserve compact defaults, and wire launcher support for explicit old-space caps."
trigger_phrases:
  - "byte-aware health telemetry plan"
  - "heap profiler implementation"
  - "memory health full report"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/008-byte-aware-health-telemetry"
    last_updated_at: "2026-05-18T21:10:00Z"
    last_updated_by: "codex"
    recent_action: "Verified telemetry implementation"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/heap-profiler.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0160020081111111111111111111111111111111111111111111111111111111"
      session_id: "phase-016-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Byte-Aware Health Telemetry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, CommonJS launcher |
| **Framework** | MCP server health handler |
| **Storage** | Existing SQLite-backed memory index; no schema changes |
| **Testing** | Vitest, TypeScript typecheck, strict spec validation, build |

### Overview
Add a small telemetry module that composes `process.memoryUsage()`, `v8.getHeapStatistics()`, cache-specific byte estimates, and opt-in `v8.writeHeapSnapshot()`. The health handler gates the new section behind `includeFullReport:true`, while the launcher only applies V8 old-space caps when an operator explicitly sets the new env var.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research source read: deep-research-005 iteration 008.
- [x] Current health handler, tool cache, trigger matcher, and launcher shapes read before editing.
- [x] Files to change are frozen to packet scope.

### Definition of Done
- [x] Strict spec validation passes.
- [x] MCP server typecheck passes.
- [x] `heap-profiler` Vitest target passes.
- [x] MCP server build passes.
- [x] Live import probe returns all seven memory fields.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small telemetry facade plus opt-in handler expansion.

### Key Components
- **Heap profiler**: owns process/V8 measurement, private heap snapshot writing, and cache byte estimate composition.
- **Cache modules**: expose local estimate helpers without changing cache behavior.
- **Health handler**: validates `includeFullReport` and merges extended fields only when requested.
- **Launcher**: converts `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` into a child-only Node argument.

### Data Flow
`memory_health({ includeFullReport:true })` calls `getDetailedMemorySnapshot()` and `getCacheByteEstimates()`, then returns `memory_snapshot`, `cache_byte_estimates`, and `recommended_action` in the success payload. Heap snapshots stay outside the handler path and require a configured snapshot directory.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory_health` schema | Accepts health args | Add `includeFullReport` boolean | Schema validation and handler tests |
| `memory_health` handler | Reports diagnostics | Add gated extended memory report | Targeted Vitest |
| Tool cache | Holds cached tool responses | Add byte estimate helper | Typecheck and cache estimate test |
| Trigger matcher | Holds trigger phrases and regexes | Add regex byte estimate helper | Typecheck and cache estimate test |
| Launcher | Spawns context-server child | Add optional old-space child arg | Build and code inspection |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm research assumptions.
- [x] Read existing source and docs before editing.
- [x] Create phase packet docs.

### Phase 2: Core Implementation
- [x] Create heap profiler module.
- [x] Add byte estimate helpers to scoped cache modules.
- [x] Extend health handler and schema.
- [x] Wire launcher old-space env var.
- [x] Add operator documentation.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Run typecheck.
- [x] Run targeted Vitest.
- [x] Run build.
- [x] Run live import probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Heap snapshot guard, permissions, memory shape, cache estimates | Vitest |
| Handler | Compact default health payload and full report payload | Vitest |
| Static | Type correctness and dist generation | TypeScript, npm build |
| Spec | Level 1 packet contract | `validate.sh --strict` |
| Integration | Import new telemetry module and call snapshot function | Node dynamic import |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `v8` module | Runtime | Green | No heap snapshot or malloc telemetry |
| Existing cache modules | Internal | Green | Cache byte estimates would be incomplete |
| Vitest | Test | Green | Targeted tests unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Health payload regression, snapshot permission failure, or launcher spawn failure.
- **Procedure**: Revert the scoped telemetry module, handler/schema additions, cache estimate helpers, launcher env-var handling, tests, docs, and packet docs listed in the commit handoff.
<!-- /ANCHOR:rollback -->
