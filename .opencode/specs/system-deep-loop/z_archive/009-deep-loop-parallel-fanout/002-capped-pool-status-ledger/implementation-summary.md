---
title: "Implementation Summary: Phase 002 — Capped worker pool + status ledger"
description: "New scripts/fanout-pool.cjs implementing runCappedPool (concurrency-capped generalization of council multi-seat-dispatch with never-throws per-item settlement + ordered results) plus settleItem, buildPoolSummary, appendStatusLedger, writeOrchestrationSummary. 10/10 new unit tests pass."
trigger_phrases:
  - "123 phase 002 implementation summary"
  - "fanout-pool capped pool done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/002-capped-pool-status-ledger"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 002 complete: fanout-pool.cjs + 10 tests; full suite 171/171 green"
    next_safe_action: "Phase 003: spawn worker + --artifact-dir-override YAML branch"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary — Phase 002: Capped worker pool + status ledger

## What changed (verified)

1. **`.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`** (NEW):
   - `runCappedPool({ items, concurrency, worker, now?, onEvent? })` — runs items through an async `worker` with at most `concurrency` in flight (clamped >=1). Generalizes council `dispatchCouncilSeats` by adding the concurrency cap (the `xargs -P K` shape) while keeping its never-throws settlement + ordered results. Returns `{ results: [...ordered], summary: { total, succeeded, failed, all_failed } }`. Empty pool => `all_failed:false`.
   - `settleItem(...)` — per-item settlement that never throws (worker rejection captured as a `rejected` result with normalized `{name,message}`), mirroring council `settleSeat`; emits optional `started`/`completed`/`failed` ledger events via `onEvent`.
   - `buildPoolSummary(results)` — ordered-results + summary envelope.
   - `appendStatusLedger(path, entry)` — append one JSONL lifecycle event (generalizes packet-122 `orchestration-status.log`).
   - `writeOrchestrationSummary(path, summary)` — pretty-JSON run summary.
   - The `worker` is INJECTED (pure primitive); the real per-lineage spawn worker + the CLI entry (arg parse / JSON-out / exit codes via `cli-guards.cjs`) are Phase 003.

2. **`.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`** (NEW, 10 tests):
   - `runCappedPool`: cap-not-exceeded (deterministic gated worker via macrotask flush + entered/in-flight tracking), input-order preserved under out-of-order completion, single-failure isolation, all-failed summary, empty pool, concurrency<1 clamps to 1, per-item ledger events (started+completed / started+failed), invalid-args TypeErrors.
   - status ledger: JSONL append (incl. mkdir of nested dir), pretty-JSON summary write (round-trips via tmpdir).

## Note on a fixed test bug
The cap-not-exceeded test first FAILED (9/10) due to a races-the-pump assertion (counted microtask ticks). Fixed the TEST (not the pool): switched to a macrotask `flush()` and asserted on an append-only `entered` list + live `inFlight` set. The pool code was correct throughout. Re-run: 10/10 pass.

## Verification
- `fanout-pool.vitest.ts`: 10/10 pass.
- Full `deep-loop-runtime/tests/unit/`: **171/171 pass, 18 files, 0 failures** (EXIT 0) — no regressions; the `loop-lock` cross-process flake did not recur in this run. `fanout-pool.cjs` is a new standalone module no existing file imports; only it + its new test changed.

## Out of scope (Phase 003+)
Per-lineage spawn worker (Option B: shell the existing command into `{artifact_dir}/lineages/{label}/`); `--artifact-dir-override` YAML branch; salvage; coverage-graph per-sessionId; consumer merges; command flags; docs.
