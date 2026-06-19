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

Implemented the Level 2 deep-loop resilience GO cluster. The change keeps the runtime fire-and-exit shape and adds only bounded, deterministic recovery behavior:

### Added

- Confirmed 030 did NOT ship failure-class before this phase: settleItem returned error:{name,message} only and buildPoolSummary emitted no per-class rollup, so C1 and everything gated on it was genuinely pending before implementation [verified current source + commit 46812f12a8 body]
- Add a bounded failure_class ∈ {timeout, exit, salvage_miss} to settleItem's rejected result, derived from the upstream timedOut/exitCode/salvage it currently discards; additive — preserved existing error:{name,message} (fanout-pool.cjs) [30m]
- Implement a transient/fatal classifier from timedOut/exit-code/salvage signals ONLY (no D2/reliability input); default-conservative: unknown → fatal so a misclassification cannot loop. Sited beside classifyExitCode in lib/cli-guards.cjs [45m]
- [P] Add a validate-existing-state resume gate that REFUSES a missing/empty/corrupt expected JSONL state instead of silently fresh-initializing. Implemented as explicit --require-existing-state / requireExistingState; legitimate fresh reducer path remains unchanged (reduce-state.cjs) [1h]
- Full deep-loop-runtime fanout suite green vs the T004 baseline; broad related runtime suite passed 49 files / 403 tests after implementation, up from baseline focused 5 files / 96 tests, with original fanout files still green [20m]
- No new dependency on the absent D2 / reliability signal introduced anywhere (SC-003)

### Changed

- Wave-0 Deep-Loop trio shipped: pool gauges (lag/pending/failed) + deterministic merge total-order + graceful-self-stop (fanout-pool.cjs, fanout-merge.cjs, fanout-run.cjs) [commit 46812f12a8; 58 fanout tests pass; §14 cand 12]
- Source seams re-confirmed against current code: class computed-then-discarded (fanout-run.cjs:639-654), dispatch-once pump (fanout-pool.cjs:171-212), started-without-terminal ledger (:82-126), resume status default initialized (reduce-state.cjs:434), resumed/restarted-only events (:344,:393) [verified — all spec seams accurate]
- Capture regression baseline: current deep-loop-runtime fanout test count before any edit — baseline npm run typecheck passed and fanout-related runtime suite passed 5 files / 96 tests [15m]
- Read the full settle/pump/summary path before editing: fanout-pool.cjs:84-258 + fanout-run.cjs:620-660 (the {timedOut, exitCode, salvage} failure object) [20m]
- Thread the upstream {timedOut, exitCode, salvage} from the lineage worker through to the settle path so the label can be derived without re-deriving (fanout-run.cjs → pool) [20m]
- Re-dispatch a transient-classified lineage ALONE in runCappedPool (not all siblings), up to a durable max_retries (default 5, config-overridable), with the attempt count read from orchestration-status.log retry_scheduled rows so a crash does NOT hand a fresh budget [1h]

### Fixed

- Add a per-class rollup to buildPoolSummary (low-cardinality, fixed label set; additive to the existing total/succeeded/failed/all_failed/gauges shape) (fanout-pool.cjs) [20m]
- Guarantee count-correctness: a retry-success flips the lineage to succeeded and is NOT counted in summary.failed; a retry-exhaustion surfaces as a genuine failure with the correct run exit-code [45m]
- C1: each of timeout / exit / salvage_miss produces the right bounded label; the buildPoolSummary per-class rollup counts are correct (fanout-pool.vitest.ts) [30m]
- Complete implementation-summary.md (per-candidate outcome, validation evidence, count-correctness proof) [20m]
- All P0 acceptance criteria met: REQ-C1, REQ-C2, REQ-C3, REQ-C5 + count-correctness
- CHK-021 Retry count-correctness proven

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
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | failure-class rollup, retry queue, durable retry count reader, orphan marker helpers |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | passes fan-out retry budget, reads ledger retry counts, marks orphaned lineages, carries orphan summary |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | Modified | bounded failure classifier and transient/fatal verdict helper |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | fanout.maxRetries schema default 5, config-overridable |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified | explicit validate-existing-state resume gate |
| `.opencode/skills/deep-loop-runtime/tests/unit/*.vitest.ts` | Modified / Added | deterministic unit and integration-style coverage for all candidates |
| `spec.md, tasks.md, checklist.md, implementation-summary.md` | Updated | candidate status and verification evidence |

### Follow-Ups

- No measured benefit number. No candidate has a before/after benchmark delta; this phase shipped correctness and reversibility only.
- C4 auto-redispatch remains lease/heartbeat-gated. The implemented GO scope is detect + marker (orphan_requeued) only.
- Reliability-weighted learning remains out of scope. No D2/D3/Q2 reliability signal was introduced or consumed.
