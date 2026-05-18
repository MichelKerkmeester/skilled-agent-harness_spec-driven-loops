---
title: "Implementation Plan: 005 substrate-stability-instrumentation"
description: "Add process RSS and circuit-flap observability to Memory MCP health surfaces without changing save/search/embed behavior."
trigger_phrases:
  - "substrate stability instrumentation plan"
  - "memory health rss instrumentation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/032-substrate-repair-followups/005-stability-instrumentation"
    last_updated_at: "2026-05-14T11:25:36Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented stability instrumentation"
    next_safe_action: "Respawn Memory MCP daemon and call memory_health for live field verification"
    blockers:
      - "Live MCP daemon restart was not available from this Codex sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "cli-codex-005-stability-instrumentation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Instrumentation should be source-plus-dist because build output may be flaky."
---
# Implementation Plan: 005 substrate-stability-instrumentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and generated JavaScript |
| **Framework** | system-spec-kit Memory MCP server |
| **Storage** | None; in-memory telemetry only |
| **Testing** | TypeScript typecheck, spec validation, source/dist grep verification |

### Overview
Add lightweight observability to the existing Memory MCP daemon: RSS at startup, process memory fields in `memory_health`, and an embedding retry circuit-flap flag derived from recent circuit state transitions. The implementation is intentionally read-only from the perspective of save/search/embed paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope fixed to packet 005 and three runtime source anchors.
- [x] Existing health response and retry circuit code read before edits.
- [x] Dist mirror requirement confirmed from packet spec.

### Definition of Done
- [x] Startup log emits process pid, RSS MB, and uptime 0s after transport connect.
- [x] `memory_health.data.process` exposes pid, RSS MB, and uptime seconds.
- [x] `memory_health.data.embeddingRetry` exposes flapping state and transition count.
- [x] `resource-map.md` documents the five requested threshold rows.
- [x] Source and dist mirrors carry equivalent edits.
- [x] Live daemon verification path documented when sandbox restart is unavailable.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Instrumentation-only patch using existing Memory MCP response envelopes and retry-manager module state.

### Key Components
- **Startup logger**: emits `[health] startup pid=... rss=...MB uptime=0s` after `server.connect`.
- **Process health snapshot**: computes `pid`, `rss_mb`, and `uptime_seconds` once per `memory_health` request.
- **Circuit transition buffer**: keeps circuit open/close timestamps for a 10-minute window.
- **Flap accessor**: returns `flapping` when the transition count is greater than 2 in that window.

### Data Flow
`retry-manager` records only actual circuit state transitions. `memory-crud-health` merges `getEmbeddingRetryStats()` with `getCircuitFlapState()` and includes the process snapshot in all successful health response shapes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-crud-health.ts` | Builds `memory_health` response data | Add process and flap fields | `rg -n "processHealth|getCircuitFlapState|transitionsInLast10Min"` |
| `retry-manager.ts` | Owns provider circuit state | Add transition buffer and accessor | `rg -n "CIRCUIT_TRANSITION_WINDOW_MS|recordCircuitTransition|getCircuitFlapState"` |
| `context-server.ts` | Starts Memory MCP daemon transport | Add startup RSS log | `rg -n "\\[health\\] startup"` |
| `dist/**` mirrors | Runtime JS output used when build is skipped | Mirror equivalent JS edits | source/dist grep parity |
| packet docs | Level 2 documentation and threshold map | Create/update docs | `validate.sh --strict` |

Required inventories:
- Same-class producers: circuit state changes are limited to `recordProviderFailure()` and `isProviderCircuitOpen()` auto-close.
- Consumers of changed symbols: `memory-crud-health.ts` imports `getCircuitFlapState()`; no other consumer required.
- Matrix axes: full health report, divergent alias report, auto-repair confirmation response, circuit closed/open/cooldown-expired, source/dist runtime.
- Algorithm invariant: transition timestamps are recorded only when the breaker changes open/closed state, not on every provider failure.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet `spec.md`.
- [x] Read `memory-crud-health.ts`.
- [x] Read `retry-manager.ts` and `context-server.ts`.
- [x] Read dist mirrors before editing.

### Phase 2: Core Implementation
- [x] Add startup RSS log in source and dist context server.
- [x] Add circuit transition buffer and flap accessor in source and dist retry manager.
- [x] Add process and flap fields in source and dist memory health handler.
- [x] Add threshold-focused `resource-map.md`.

### Phase 3: Verification
- [x] Run source/dist grep checks.
- [x] Run TypeScript typecheck for the MCP server package.
- [x] Run packet spec validation.
- [x] Document live MCP respawn verification path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Required field and log presence in source/dist | `rg` |
| Typecheck | MCP server TypeScript surface | `npm run typecheck` in `mcp_server` |
| Spec validation | Level 2 packet docs and metadata | `validate.sh --strict` |
| Manual runtime | Daemon startup log plus `memory_health` output | Deferred until Memory MCP daemon respawn |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js `process.memoryUsage()` | Runtime API | Green | RSS field unavailable if Node runtime changes |
| Existing retry-manager circuit state | Internal module state | Green | Flap counter must not change retry behavior |
| Memory MCP daemon respawn | Runtime operation | Yellow | Live response verification deferred |
| Dist mirror | Build artifact | Green | Runtime can use patched JS even if build is unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Startup stderr log causes integration noise, or health response field shape conflicts with a consumer.
- **Procedure**: Revert the three source edits, the three dist mirror edits, and packet docs for 005. No database or behavior migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Core Implementation -> Verification -> Daemon Respawn Check
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Existing packet spec | Core Implementation |
| Core Implementation | Source and dist reads | Verification |
| Verification | Code patches and docs | Completion metadata |
| Daemon Respawn Check | External MCP restart | Live field confirmation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Medium | 30 minutes |
| Documentation | Medium | 30 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed instrumentation does not write to DB.
- [x] Confirmed retry thresholds and cooldown are unchanged.
- [x] Confirmed kill-switch remains documentation only.

### Rollback Steps
1. Remove the startup RSS log line from source and dist context server.
2. Remove circuit transition state and `getCircuitFlapState()` from source and dist retry manager.
3. Remove `process` and flap fields from source and dist health response construction.
4. Restore packet status to planned only if the work is intentionally abandoned.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: code revert only.
<!-- /ANCHOR:enhanced-rollback -->
