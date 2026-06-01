---
title: "Spec Memory Runtime Retention Cleanup"
description: "Bounded runtime retention and cooperative cleanup for Spec Kit Memory process-local state: timers, caches, sessions, queues, retries, audit rotation, embedder sidecar hardening."
trigger_phrases:
  - "spec memory runtime retention cleanup"
  - "bounded cache timer registry shutdown hooks"
  - "memory leak remediation phase 9"
  - "BoundedMap TtlMap audit rotation"
  - "embedder sidecar hardening parent death"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

The broad system-spec-kit audit identified in-process retention risks across memory scan, routing, search, ingest, retry, audit, embedder paths that could accumulate without any orphaned external processes. Phase 009 addressed all identified surfaces by introducing bounded data structures, a process-wide timer registry, a shutdown hook system and cooperative cleanup integration across 17 existing modules. Embedder sidecar calls received env allowlisting, request timeout termination and parent-death polling to ensure owned child processes exit when the parent disappears. All existing public APIs remained behavior-compatible.

### Added

- `mcp_server/lib/memory/bounded-cache.ts` (NEW): `BoundedMap<K,V>` with LRU refresh-on-read/write semantics and `TtlMap<K,V>` with lazy expiry over the bounded map
- `mcp_server/lib/memory/audit-rotation.ts` (NEW): size-triggered audit rotation with retained-rotated-file pruning configurable via `SPECKIT_SEARCH_DECISION_AUDIT_MAX_FILES`
- `mcp_server/lib/runtime/timer-registry.ts` (NEW): process-wide timer registration, clear-one, clear-all, count introspection used by all long-lived timers
- `mcp_server/lib/runtime/shutdown-hooks.ts` (NEW): bounded shutdown hook registration with per-hook timeout and process signal hooks
- `mcp_server/tests/lib/memory/bounded-cache.vitest.ts` (NEW): unit tests for `BoundedMap` and `TtlMap` LRU and expiry semantics
- `mcp_server/tests/lib/memory/audit-rotation.vitest.ts` (NEW): unit tests for audit rotation size triggers and retained-file pruning

### Changed

- `mcp_server/lib/providers/retry-manager.ts`: capped retry retention by max pending rows and max age, aborts retry work during shutdown, routes the background interval through the timer registry
- `mcp_server/lib/enrichment/retry-budget.ts`: replaced unbounded retry budget map with `BoundedMap` capped at `SPECKIT_RETRY_BUDGET_MAX_ENTRIES` (default 2,000)
- `mcp_server/lib/routing/content-router.ts`: replaced Tier 3 in-memory router cache with a bounded TTL cache capped at `SPECKIT_ROUTER_CACHE_MAX_ENTRIES` (default 500)
- `mcp_server/lib/search/session-state.ts`: caps per-session seen result IDs, open questions, preferred anchors to prevent unbounded accumulation per session
- `mcp_server/lib/ops/job-queue.ts`: adds `SPECKIT_INGEST_QUEUE_MAX_PENDING` (default 1,000) pending-job cap, aborts oldest overflow jobs with explicit error records
- `mcp_server/context-server.ts`: routes graph enrichment and shutdown deadline timers through the registry, runs shutdown hooks and clears registered timers in fatal shutdown

### Fixed

- `mcp_server/handlers/memory-index.ts`: wraps index-scan lease completion in `try/finally` so leases release on success, early return or throw rather than leaking on exception
- `mcp_server/lib/embedders/sidecar-client.ts` and `sidecar-worker.ts`: hardened sidecar process ownership with env allowlisting, request timeout termination, parent PID propagation and child-side parent-death polling. Fixes sidecar workers that previously outlived the parent on macOS.
- `mcp_server/lib/search/decision-audit.ts`: audit writes now rotate before append and prune old rotated files, fixing unbounded audit log growth
- `mcp_server/lib/session/session-manager.ts`: registers session cleanup, stale cleanup, retention sweep intervals with the shutdown registry, fixing timers that previously ran past process teardown

### Verification

| Command | Result | Evidence |
|---------|--------|----------|
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/memory/ mcp_server/tests/lib/runtime/ --config mcp_server/vitest.config.ts` | PASSED | 4 files, 8 tests passed |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/providers/ mcp_server/tests/memory-runtime-retention.vitest.ts --config mcp_server/vitest.config.ts` | PASSED | 3 files, 9 tests passed |
| B5 fixture-validity replay (`memory-runtime-retention.vitest.ts`) | PASSED | 250 save/search/index workload calls with retained cap assertions. Targeted runs 4 of 4 passed. |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASSED | Exit 0 |
| `npm run build --workspace=@spec-kit/mcp-server` | PASSED | Exit 0; `tsc --build` plus `node scripts/finalize-dist.mjs` |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` | PASSED | Exit 0. 0 errors, 44 non-blocking pre-existing warnings. |

### Files Changed

| File | Action | Notes |
|------|--------|-------|
| `mcp_server/lib/memory/bounded-cache.ts` | Created | `BoundedMap` and `TtlMap` with LRU and lazy TTL eviction |
| `mcp_server/lib/memory/audit-rotation.ts` | Created | Size-triggered rotation with retained-file pruning |
| `mcp_server/lib/runtime/timer-registry.ts` | Created | Process-wide timer registration and introspection |
| `mcp_server/lib/runtime/shutdown-hooks.ts` | Created | Bounded hook registry with per-hook timeout and signal hooks |
| `mcp_server/tests/lib/memory/bounded-cache.vitest.ts` | Created | Unit tests for `BoundedMap` and `TtlMap` |
| `mcp_server/tests/lib/memory/audit-rotation.vitest.ts` | Created | Unit tests for rotation triggers and pruning |
| `mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts` | Created | Unit tests for shutdown hook registry |
| `mcp_server/tests/lib/runtime/timer-registry.vitest.ts` | Created | Unit tests for timer registry |
| `mcp_server/tests/memory-runtime-retention.vitest.ts` | Created | Integration tests for retention cap assertions under workload |
| `mcp_server/tests/providers/retry-retention.vitest.ts` | Created | Tests for retry pending cap and overflow abort |
| `mcp_server/lib/providers/retry-manager.ts` | Modified | Retention cap, age-based abort, shutdown integration |
| `mcp_server/lib/enrichment/retry-budget.ts` | Modified | Replaced unbounded map with `BoundedMap` |
| `mcp_server/lib/routing/content-router.ts` | Modified | Replaced Tier 3 cache with bounded TTL cache |
| `mcp_server/lib/search/session-state.ts` | Modified | Per-session accumulator caps |
| `mcp_server/lib/ops/job-queue.ts` | Modified | Pending-job cap with overflow abort |
| `mcp_server/handlers/memory-index.ts` | Modified | Lease release in `try/finally` |
| `mcp_server/lib/embedders/sidecar-client.ts` | Modified | Env allowlist, request timeout, parent PID propagation |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Modified | Parent-death polling, child-side exit on parent disappearance |
| `mcp_server/lib/search/decision-audit.ts` | Modified | Audit writes rotate before append with retained-file cap |
| `mcp_server/lib/session/session-manager.ts` | Modified | Cleanup intervals registered through shutdown registry |
| `mcp_server/context-server.ts` | Modified | Timer registry and shutdown hook integration for fatal teardown |

### Follow-Ups

- Audit remaining memory/search/routing/session/queue paths for any unbounded `new Map()` or `new Set()` retention not covered by this phase.
- Audit timer usage across `mcp_server/lib/**` and `mcp_server/context-server.ts` to confirm all long-lived timers route through the timer registry.
- Confirm macOS parent-death polling behavior is preserved after the sidecar execution path retirement that followed this phase.
