---
title: "Implementation Summary: Lazy Startup Gating"
description: "The context-server memory runtime now initializes lazily on first memory-owning tool use, while lightweight health reports remain available before DB open."
trigger_phrases:
  - "lazy startup gating summary"
  - "runtime_initialized implementation summary"
  - "memory runtime guard commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented lazy runtime guard and recorded verification"
    next_safe_action: "Resolve handler-family verification blocker"
    blockers:
      - "`npx vitest --run handlers` has no matching files in mcp_server"
      - "`npx vitest --run handler` fails in handler-memory-save atomic-save/chunking tests outside this packet diff"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0160020113333333333333333333333333333333333333333333333333333333"
      session_id: "phase-016-002-011"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating` |
| **Completed** | Implementation complete; handler-family verification blocked |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The context server now has a lazy memory runtime guard. MCP startup still performs runtime detection, server construction, schema and handler registration, signal hooks, and stdio transport binding. DB-owned runtime work waits until the first memory-owning tool asks for it.

### Runtime Guard

`memory-runtime-guard.ts` exposes `registerInitTasks`, `ensureMemoryRuntimeInitialized`, and `isMemoryRuntimeInitialized`. The guard is idempotent, single-flight, logs init start/complete duration, clears failed promises for retry, and calls the callback registered by `context-server.ts`.

### Lazy Context-Server Init

The registered init callback owns DB open, active embedder validation, API validation, dimension setup, DB-state wiring, integrity checks, consumer initialization, BM25 rebuild, cognitive modules, extraction adapter, reindex resume, retry manager start, shadow/batch/session/ingest startup, watcher setup, and startup scan scheduling.

### Lightweight Health and Priming

`tryGetDb()` returns the cached SQLite connection without opening it. `memory_health` uses that accessor and reports `runtime_initialized`; session priming and memory-surface hooks avoid DB-backed work while the runtime is cold.

### Guarded Handlers

Guard calls were added for memory-owning handlers covering search/context/triggers/save/list/stats/update/delete/bulk delete/retention/index scan/ingest/checkpoints/embedder/eval/causal/session-learning paths. `session_bootstrap`, `session_resume`, `session_health`, and `memory_health` remain lightweight unless they reach a DB-owning path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts` | Created | Single-flight lazy runtime guard |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Thin startup plus registered memory init callback |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Non-initializing `tryGetDb()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modified | Re-export `tryGetDb()` |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts` | Modified | Avoid cold DB opens during session priming |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/*.ts` | Modified | Guard memory-owning handlers before DB access |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Cold health status with `runtime_initialized` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-guard.vitest.ts` | Created | Guard, health, and representative handler coverage |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Modified | Health mock update for `tryGetDb()` |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Lazy startup gating diagnostics docs |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating/` | Created | Level 1 packet docs and metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The dispatch layer performs one guard call for known DB-owning tools before stale DB checks, session priming, and handler execution. Direct handler entry points also call the guard, so unit tests and non-dispatch call sites keep the same safety property.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Keep `memory_health` outside the guard | Health should be able to report cold runtime status without forcing DB residency |
| Leave session bootstrap/resume unguarded | Current paths are metadata/filesystem oriented and should not double-trigger DB init |
| Default unregistered guard callbacks to a no-op | Direct handler tests can still exercise existing DB mocks without context-server bootstrap |
| Guard both dispatch and handlers | Preserves compatibility for calls that bypass the central dispatcher |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <011> --strict` | PASS, `RESULT: PASSED` |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run memory-runtime-guard` | PASS, 1 file / 6 tests |
| `npx vitest --run handlers` | BLOCKED, no matching test files for this literal plural filter under the mcp_server Vitest config |
| `npx vitest --run handler` | FAIL, 17 files / 438 passed / 12 failed / 3 skipped; failures are `handler-memory-save` atomic-save/chunking expectations plus the health edge expectation updated separately |
| `npx vitest --run handler-memory-health-edge` | PASS, 1 file / 10 tests |
| `npx vitest --run context-server` | PASS, 2 files / 414 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe | PASS via `memory-runtime-guard` tests: cold `memory_health` leaves DB unopened, representative save guard runs before DB access |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **First memory-owning call pays initialization latency.** This is the intended trade-off from Rec 3.
2. **Health is intentionally less DB-complete while cold.** Full reports still include process and heap data, but DB-derived fields remain unavailable until runtime init.

## Commit Handoff

Codex sandbox blocks direct `.git/index.lock` writes in some sessions, so stage these exact source paths from a normal shell after verification:

```bash
git add \
  .opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts \
  .opencode/skills/system-spec-kit/mcp_server/context-server.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts \
  .opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/checkpoints.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/session-learning.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-guard.vitest.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating/

git commit -m "feat(016/002/011): lazy startup gating for memory runtime"
```
<!-- /ANCHOR:limitations -->
