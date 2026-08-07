---
title: "Spec Memory Stack Phase 011: Lazy Startup Gating"
description: "The context-server memory runtime now initializes lazily on the first memory-owning tool call. DB open, BM25 warmup, reindex resume, retry manager plus startup scan no longer run at MCP process start. Lightweight health diagnostics remain available before runtime init."
trigger_phrases:
  - "lazy startup gating"
  - "memory runtime guard"
  - "context server lazy init"
  - "runtime_initialized health field"
  - "tryGetDb non-initializing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/011-lazy-startup-gating` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The context server opened SQLite and started all memory-owned background work unconditionally at MCP process startup. That tied idle startup to DB residency, BM25 warmup, reindex resume, retry jobs plus startup scans even when the caller only needed lightweight tool discovery or a health check.

A lazy memory runtime guard now splits startup into two stages. The thin MCP bootstrap handles process arg parsing, server construction, tool schema and handler registration, runtime detection, signal hooks plus stdio transport binding. DB open, integrity checks, active-embedder validation, consumer initialization, BM25 rebuild, cognitive modules, extraction adapter, reindex resume, retry manager, shadow and batch startup, watcher setup plus startup scan scheduling all move behind `ensureMemoryRuntimeInitialized()` and run only when the first memory-owning tool asks for them.

`memory_health` was updated to remain callable before DB init and reports `runtime_initialized: false` in cold state. Session priming and memory-surface hooks skip DB-backed work while the runtime is cold.

### Added

- `memory-runtime-guard.ts` with idempotent single-flight initialization exposing `registerInitTasks`, `ensureMemoryRuntimeInitialized` plus `isMemoryRuntimeInitialized`
- `tryGetDb()` on `vector-index-store.ts` that returns the cached SQLite connection without forcing initialization
- Re-export of `tryGetDb()` from `vector-index.ts`
- `runtime_initialized` boolean field on `memory_health` cold-state response
- `memory-runtime-guard.vitest.ts` with 6 tests covering the guard, cold health behavior plus a representative guarded handler

### Changed

- `context-server.ts` startup path split into thin MCP bootstrap (always runs) and registered memory init callback (runs on first memory-owning call)
- `memory-crud-health.ts` now uses `tryGetDb()` and reports `runtime_initialized` without opening DB
- Memory-owning handlers guarded before DB access: search, context, save, triggers, list, stats, update, delete, bulk-delete, retention sweep, embedder list/set/status, checkpoints, index scan, ingest, eval reporting, causal graph plus session learning
- `memory-surface.ts` hooks skip DB-backed priming while runtime is cold
- Embedder architecture diagnostics docs updated with lazy startup gating explanation and `runtime_initialized` field description

### Fixed

- MCP server startup blocked on DB open, BM25 warmup plus background job initialization even for callers that only needed tool schemas or health data. Lazy guard eliminates this unconditional cost.

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <011> --strict` | PASS. exit 0, zero errors, zero warnings |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run memory-runtime-guard` | PASS. 1 file, 6 tests |
| `npx vitest --run handler-memory-health-edge` | PASS. 1 file, 10 tests |
| `npx vitest --run context-server` | PASS. 2 files, 414 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe | PASS. Cold `memory_health` leaves DB unopened. Representative save guard runs init before DB access. |
| `npx vitest --run handler` | PRE-EXISTING FAILURES. 17 files, 438 passed, 12 failed, 3 skipped. `handler-memory-save` atomic-save/chunking failures confirmed pre-existing on main before this packet via git stash test. Not introduced by the guard. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/memory-runtime-guard.ts` | Created (NEW) | Single-flight lazy runtime guard with init logging and retry-clear |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Thin MCP bootstrap plus registered memory init callback behind the guard |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Non-initializing `tryGetDb()` that returns null when DB is not yet open |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modified | Re-export of `tryGetDb()` for caller convenience |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts` | Modified | Skip DB-backed priming while runtime is cold |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Cold health status with `runtime_initialized` field. Uses `tryGetDb()` instead of forcing DB open |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/*.ts` | Modified | Guard calls added before DB access in memory-owning handlers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-runtime-guard.vitest.ts` | Created (NEW) | Guard, cold health plus representative handler coverage |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` | Modified | Health mock updated for `tryGetDb()` accessor |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Lazy startup gating diagnostics section with `runtime_initialized` field docs |

### Follow-Ups

- Resolve pre-existing `handler-memory-save` atomic-save and chunking test failures confirmed present on main before this packet. Track in a separate follow-on packet.
- First memory-owning call pays initialization latency. This is the accepted trade-off from deep-research-005 iter-010 Finding 3. Document the latency profile if measurements reveal a p99 concern.
- `memory_health` reports reduced DB-derived fields while cold. Evaluate whether callers that depend on DB-derived health fields need an explicit wait-for-ready option.
