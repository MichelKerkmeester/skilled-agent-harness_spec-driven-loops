---
title: "Changelog: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster) [004-deep-loop/003-fanout-failure-recovery]"
description: "Chronological changelog for the Deep Loop Fan-out Failure Recovery (028/004 resilience cluster) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-fanout-failure-recovery` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

Deep-loop fan-out recovery now has bounded, deterministic failure handling while keeping the runtime's fire-and-exit shape. Failed lineages receive fixed failure classes, transient failures can retry alone within a durable budget, orphaned lineages are marked from the status ledger and recovery mode refuses missing or corrupt expected state instead of silently starting fresh. The cluster shipped in commit `c1f2466811`.

### Added

- Bounded failure classes for timeout, exit and salvage-miss cases in `fanout-pool.cjs`.
- A transient or fatal classifier in `cli-guards.cjs`, derived from timeout, exit-code and salvage signals.
- Transient retry scheduling that re-dispatches only the failed lineage and honors a durable retry count.
- Explicit existing-state validation for recovery runs in `reduce-state.cjs`.
- Orphan markers for started-without-terminal lineages found in the status ledger.

### Changed

- Fan-out workers now pass upstream timeout, exit-code and salvage signals through to pool settlement.
- Retry budgets default to `5` and are config-overridable.
- Retry counts come from `orchestration-status.log`, so a crash does not reset the budget.
- Fresh-start reducer behavior remains available when recovery mode is not requested.

### Fixed

- Pool summaries now include fixed per-class failure rollups.
- Retry success counts as success rather than failure.
- Retry exhaustion surfaces as a real failure with the correct run exit code.
- Recovery mode no longer treats a missing expected JSONL state as a valid fresh run.

### Verification

- Baseline typecheck - Pass
- Baseline fanout suite - Pass
- Syntax checks - Pass
- Focused implementation tests - Pass
- Canonical typecheck - Pass
- Broad related Vitest - Pass
- Comment hygiene - Pass
- Strict validation - Pass

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | failure-class rollup, retry queue, durable retry count reader and orphan marker helpers |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | passes fan-out retry budget, reads ledger retry counts, marks orphaned lineages, carries orphan summary |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Modified | bounded failure classifier and transient/fatal verdict helper |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | fanout.maxRetries schema default 5, config-overridable |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified | explicit validate-existing-state resume gate |
| `.opencode/skills/deep-loop-runtime/tests/unit/*.vitest.ts` | Modified / Added | deterministic unit and integration-style coverage for implemented recovery behavior |
| `spec.md, tasks.md, checklist.md, implementation-summary.md` | Updated | implementation status and verification evidence |

### Follow-Ups

- No measured benefit number exists. This phase shipped correctness and reversibility.
- Auto-redispatch of orphaned work remains gated on lease and heartbeat design.
- Reliability-weighted learning remains out of scope.
