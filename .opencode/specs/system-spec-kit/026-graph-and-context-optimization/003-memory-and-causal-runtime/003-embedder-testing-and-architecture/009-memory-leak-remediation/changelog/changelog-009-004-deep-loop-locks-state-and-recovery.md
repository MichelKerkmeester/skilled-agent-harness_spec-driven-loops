---
title: "Deep Loop Locks State and Recovery - Phase 004"
description: "Three shared deep-loop safety primitives shipped: loop-lock.ts with PID/TTL/heartbeat lock semantics. jsonl-repair.ts with append-safe JSONL write and corrupt-tail repair. atomic-state.ts with temp-write-fsync-rename replacement. Wired into executor-audit.ts and post-dispatch-validate.ts. Fifteen targeted Vitest cases passed. Full deep-loop regression suite (129 tests) clean."
trigger_phrases:
  - "deep loop locks state recovery"
  - "loop-lock.ts pid ttl heartbeat"
  - "jsonl repair corrupt trailing"
  - "atomic state write deep-loop"
  - "memory leak remediation phase 004"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Advisory locks in the deep-loop runtime carried no PID, no TTL, no heartbeat metadata. A killed run left a stale lock that blocked the next run indefinitely. JSONL state files were rewritten in full on each append, making partial-write corruption unrecoverable. Interrupted runs could lose provenance or trigger duplicate dispatches with no detection path.

Phase 004 added three shared TypeScript helpers that make deep-loop runs interruption-safe. `loop-lock.ts` acquires a packet-scoped `.deep-loop.lock` JSON file carrying owner PID, TTL, heartbeat, stale-recovery metadata. `jsonl-repair.ts` appends records with `appendFileSync` and repairs corrupt trailing bytes without touching valid earlier records. `atomic-state.ts` replaces full state files through a temp-write-fsync-rename sequence that leaves no partial state on crash.

Both active writers were wired to the new helpers. `executor-audit.ts` appends iteration-start and dispatch-failure events through the shared append path. `post-dispatch-validate.ts` repairs corrupt JSONL before reading the latest record. Executor audit metadata now persists `kind` instead of `type` with a legacy fallback for YAML runtimes. Fifteen targeted Vitest cases covered the new helpers. The full deep-loop regression suite (129 tests across 16 files) remained clean.

### Added

- `loop-lock.ts` with `LoopLockData`, `LoopLockHeldError`, `processAlive(pid)`, `isStaleLoopLock(data, now)`, `acquireLoopLock(lockPath, data)`, `refreshLoopLock(lockPath, ownerPid)`, `releaseLoopLock(lockPath, ownerPid)`
- `jsonl-repair.ts` with `repairJsonlTail(path)` and `appendJsonlRecord(path, record)` preserving valid records while stripping only corrupt trailing bytes
- `atomic-state.ts` with `writeStateAtomic(path, data)` using temp write, fsync, rename, with temp cleanup on failure
- Vitest suite for `loop-lock.ts` covering acquire, refresh, release, stale TTL, dead-PID reclaim, live-holder refusal, sequential concurrent-run behavior
- Vitest suite for `jsonl-repair.ts` covering corrupt trailing line, kill-during-append partial recovery, empty file, clean no-op, concurrent append record counts
- Vitest suite for `atomic-state.ts` covering JSON write, replacement preserving parseability, cleanup when rename fails or target directory is invalid
- B5 cross-process lock replay in `deep-loop-runtime/tests/unit/loop-lock.vitest.ts` with two child Node processes racing behind a barrier

### Changed

- `executor-audit.ts` now appends `iteration_start` and `dispatch_failure` records through the shared JSONL append helper and normalizes `executor.type` to `executor.kind` for persisted audit records
- `post-dispatch-validate.ts` now calls `repairJsonlTail` before reading the latest state record and appends `verification_degraded` through the shared append helper
- Deep-research and deep-review audit metadata now persists executor identity as `kind` not `type`

### Fixed

- Stale `.deep-loop.lock` from a killed run blocked the next same-packet run indefinitely. Dead-PID and TTL-expiry reclaim paths now recover without manual intervention.
- JSONL state corruption from a partial append was unrecoverable. `repairJsonlTail` strips only invalid tail bytes and preserves all preceding valid records.
- Full-file rewrite on each state append created a window where a crash left zero bytes. `writeStateAtomic` eliminates that window through atomic rename.
- `executor-audit.ts` did not handle legacy YAML runtimes that pass `config.executor.type`. A fallback normalizes the field before persisting.

### Verification

| Check | Result |
|-------|--------|
| Targeted new-helper Vitest (3 files) | Passed. 3 files. 15 tests passed. |
| Full deep-loop Vitest regression | Passed. 16 files. 1 skipped. 129 tests passed. 5 todo. |
| B5 cross-process lock replay | Passed. 7 of 7 cases. Exactly one fresh acquire wins per race. |
| MCP server typecheck | Passed. Exit 0. |
| MCP server build | Passed. Exit 0. |
| OpenCode alignment drift | Passed. 0 errors. 44 warnings all outside changed files. |
| Phase 004 strict validation | Passed. `validate.sh --strict` exited 0 with `RESULT: PASSED`. |
| Parent arc strict validation | Passed. `validate.sh --strict` exited 0 with `RESULT: PASSED`. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` (NEW) | Packet-scoped lock with PID, TTL, heartbeat, acquire, refresh, release, stale reclaim |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` (NEW) | Append-safe JSONL writes and corrupt-tail repair |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` (NEW) | Temp-write-fsync-rename replacement for full state files |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Shared append helper wired. Legacy `type` normalized to `kind`. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Repair call added before state read. Shared append helper wired. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/loop-lock.vitest.ts` (NEW) | Vitest suite for lock acquire, refresh, release, reclaim, refusal |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/jsonl-repair.vitest.ts` (NEW) | Vitest suite for corrupt-tail, partial, empty, no-op, concurrent cases |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/atomic-state.vitest.ts` (NEW) | Vitest suite for write, replace, cleanup-on-failure cases |

### Follow-Ups

- Add a heartbeat timer to the command runner. `loop-lock.ts` exposes `refreshLoopLock` but does not schedule the interval. Each workflow runtime must wire its own cadence.
- Rename `config.executor.type` to `config.executor.kind` in the deep-research and deep-review YAML assets. This phase normalized persisted audit records only. The YAML runtime config field still uses `type` as its branch selector.
- Evaluate migrating `ai-council` CommonJS persistence helpers to the shared TypeScript helper modules. The new helpers define the semantics. Council-specific adoption is a smaller follow-up if the parent arc requires it.
