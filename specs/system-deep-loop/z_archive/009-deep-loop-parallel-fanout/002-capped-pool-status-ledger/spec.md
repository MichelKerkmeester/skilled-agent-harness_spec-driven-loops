---
title: "Phase 002: Capped worker pool + status ledger"
description: "New deep-loop-runtime/scripts/fanout-pool.cjs implementing runCappedPool (generalize council multi-seat-dispatch with a concurrency cap) + orchestration-status.log JSONL + orchestration-summary.json."
trigger_phrases:
  - "123 phase 002 pool"
  - "fanout-pool.cjs capped pool"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/002-capped-pool-status-ledger"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 2 complete — fanout-pool.cjs (runCappedPool, settleItem, buildPoolSummary, appendStatusLedger, writeOrchestrationSummary) + 10 unit tests green; 171/171 full suite"
    next_safe_action: "Phase 003 done; packet 123 fully shipped"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 002 — Capped worker pool + status ledger

## Purpose
Provide the concurrency-capped fan-out orchestrator primitive (the one thing the council dispatcher lacks).

## Scope
- New `deep-loop-runtime/scripts/fanout-pool.cjs` (script-entry contract like `scripts/convergence.cjs`: tsx bootstrap, JSON-out, exit 0/1/2/3 via `scripts/lib/cli-guards.cjs`).
- `runCappedPool({items, concurrency, worker})`: ≤concurrency promises in flight; per-item try/catch (one failure never sinks the pool); allSettled-style results with timing/status (mirror `multi-seat-dispatch.cjs`).
- Status ledger: `{artifact_dir}/orchestration-status.log` (JSONL per-lineage events) + `{artifact_dir}/orchestration-summary.json` (`total/succeeded/failed/salvaged/perLineage[]`).

## Success
- New `tests/unit/fanout-pool.vitest.ts` (modeled on `tests/council/multi-seat-dispatch.vitest.ts`): cap respected; isolation on reject; all-fail summary; ledger shape. Full vitest green.

## Out of scope
Per-lineage spawn (003); the `worker` is mockable here.
