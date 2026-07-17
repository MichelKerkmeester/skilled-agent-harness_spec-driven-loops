---
title: "Plan: Lazy Startup Gating"
description: "Implementation plan for deferring context-server memory runtime initialization until first memory-owning tool use."
trigger_phrases:
  - "lazy startup gating plan"
  - "memory runtime guard plan"
  - "context server lazy init plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification outcomes"
    next_safe_action: "Resolve handler-family verification blocker"
    blockers:
      - "`npx vitest --run handlers` does not match files; `npx vitest --run handler` fails in existing handler-memory-save tests"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts"
    session_dedup:
      fingerprint: "sha256:0160020111111111111111111111111111111111111111111111111111111111"
      session_id: "phase-016-002-011"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Plan: Lazy Startup Gating

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Move memory-owned startup work out of MCP bootstrap and into a single-flight runtime guard. The server still registers schemas, handlers, signal hooks, runtime detection, and stdio transport immediately; database/search/background consumers initialize on the first memory-owning tool call.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rec 3 source evidence and predecessor constraints read.
- [x] Scope limited to context-server lazy init, DB accessor, handler guard wiring, health, tests, docs, and packet files.
- [x] Verification gates identified.

### Definition of Done
- [x] Strict packet validation passes.
- [ ] Typecheck, targeted tests, handler/context-server regressions, and build pass.
- [x] Integration probe verifies cold health and first memory-call initialization.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Area | Plan |
|------|------|
| Guard module | Add `memory-runtime-guard.ts` with `registerInitTasks`, `ensureMemoryRuntimeInitialized`, and `isMemoryRuntimeInitialized` |
| Bootstrap | Register the context-server init callback before `server.connect(transport)` |
| DB accessor | Add `tryGetDb()` to expose the cached connection without calling `initializeDb()` |
| Tool dispatch | Guard all DB-owning tools before stale DB checks, session priming, and handler bodies |
| Health | Keep `memory_health` lightweight by using `tryGetDb()` and reporting `runtime_initialized` |
| Session priming | Avoid DB-backed priming until runtime is already initialized or the current tool requires it |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add guard and non-initializing DB accessor.
2. Move heavy context-server startup tasks behind registered init callback.
3. Wire guard into memory-owning handlers and dispatch path.
4. Update `memory_health`, session priming, tests, and memory diagnostics docs.
5. Run strict packet validation, typecheck, targeted tests, handler/context-server regressions, build, and integration probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Expected Result |
|-------|-----------------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <011> --strict` | `RESULT: PASSED` |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | Exit 0 |
| `npx vitest --run memory-runtime-guard` | Guard and lazy health tests pass |
| `npx vitest --run handlers` | Existing handler tests pass |
| `npx vitest --run context-server` | Startup tests pass or are updated for lazy bootstrap |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | Exit 0 |
| Integration probe | Pre-init health stays cold; representative memory call initializes once; post-init health is warm |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing vector-index store | Internal | Green | Runtime guard cannot open or inspect DB state |
| Existing handler registry | Internal | Green | Guard routing list could miss DB-owning tools |
| Prior sidecar routing packet | Internal | Green | Local embedder lifecycle must remain lazy and gated |
| Existing health telemetry | Internal | Green | Cold health shape must stay backward compatible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the guard registration and handler guard calls, restore eager `vectorIndex.initializeDb()` and dependent startup work in `main()`, and remove the `runtime_initialized` health addition. No schema rollback is required because this packet does not add migrations or environment variables.
<!-- /ANCHOR:rollback -->
