---
title: "At-Rest WAL Durability: Bounded Autocheckpoint and Dual-Schema TRUNCATE"
description: "The vector index now bounds WAL growth on the main context index and the attached active vector shard. It checkpoints both schemas before detach on graceful close and runs periodic best-effort TRUNCATE every five minutes while keeping production synchronous=NORMAL."
trigger_phrases:
  - "at-rest WAL durability"
  - "wal_autocheckpoint 256"
  - "checkpointAllWal"
  - "active_vec wal checkpoint"
  - "dual-schema WAL TRUNCATE"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Packet 008 added a close-time WAL TRUNCATE for the main context index but left the attached active vector shard unguarded. The live `context-index.sqlite-wal` was approximately 9.2 MiB (2349 pages) beside a roughly 1.0 GiB index that is not write-hot. This packet bounds WAL exposure on both connections by setting `wal_autocheckpoint = 256` on the main DB and the `active_vec` shard. It re-sequences `close_db()` so the shard TRUNCATE runs before the main TRUNCATE and before detach. It also adds a `checkpointAllWal()` helper that `context-server.ts` calls every five minutes via the existing timer registry. Production remains `synchronous=NORMAL` because a copy-based benchmark showed that adding APFS `fullfsync=ON` raised p99 latency by 19.576ms, making that flip a separate benchmark-gated decision.

### Added

- `checkpointAllWal()` helper in `vector-index-store.ts` that performs best-effort shard and main TRUNCATE without closing the connection
- Re-export of `checkpointAllWal()` through `vector-index.ts` beside existing store helpers
- Five-minute unref'd interval in `context-server.ts` that calls `vectorIndex.checkpointAllWal()` after `server.connect(transport)`
- Regression tests in `vector-index-store.vitest.ts` covering close checkpoint order and helper dual-schema behavior
- Copy-based WAL durability benchmark script in `scratch/wal-durability-benchmark.mjs`

### Changed

- Main DB initialization now sets `wal_autocheckpoint = 256` immediately after `synchronous = NORMAL` in `vector-index-store.ts`
- Active shard schema initialization now sets `active_vec.wal_autocheckpoint = 256` when the shard schema is ensured
- `close_db()` re-sequenced to run `active_vec.wal_checkpoint(TRUNCATE)` then the existing bare main TRUNCATE then detach then close

### Fixed

- Active vector shard WAL was left uncheckpointed on graceful close because `close_db()` detached the shard before any shard TRUNCATE could run
- Steady-state WAL growth was unbounded on both connections. The 256-page autocheckpoint cap now limits recoverable frames after an ungraceful daemon exit

### Verification

- `npm run build --workspace=@spec-kit/mcp-server` from `.opencode/skills/system-spec-kit`: PASS (`tsc --build && node scripts/finalize-dist.mjs` exited 0)
- `vitest run tests/vector-index-store.vitest.ts tests/lifecycle-shutdown.vitest.ts tests/context-server.vitest.ts tests/memory-runtime-retention.vitest.ts` from `mcp_server`: PASS (4 files, 389 tests)
- `node scratch/wal-durability-benchmark.mjs` from repo root: PASS (copy-only benchmark completed, results written to `scratch/wal-durability-benchmark-results.json`)
- `validate.sh --strict` on the packet folder: evidence recorded in checklist. Strict-validate 0 errors 0 warnings per implementation-summary

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Main and shard autocheckpoint pragmas, dual-schema close checkpointing, `checkpointAllWal()` helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modified | Re-export `checkpointAllWal()` beside store helpers |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Register five-minute unref'd WAL checkpoint interval after transport connect |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts` | Modified | Assert shard checkpoint runs before detach and helper checkpoints both schemas |
| `.opencode/specs/.../010-at-rest-wal-durability/scratch/wal-durability-benchmark.mjs` | Created (NEW) | Copy-only SQLite durability benchmark script |

### Follow-Ups

- Evaluate a production flip to `synchronous=FULL` plus `fullfsync=ON` on main and shard connections if a broader daemon benchmark shows the fullfsync tail cost is tolerable under real save volume.
- Confirm autocheckpoint and periodic TRUNCATE behavior holds under high write-volume stress beyond the 200-transaction copy benchmark.
