---
title: "Changelog: Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster) [004-deep-loop/005-stop-input-corroboration]"
description: "Chronological changelog for the Deep Loop STOP-Input Corroboration (028/004 convergence-hardening cluster) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

The STOP-input corroboration runtime work is implemented with deterministic tests. Deep-loop convergence now compares self-reported novelty with graph-observed novelty, can block unsupported STOP decisions, can warn on configured lag ceilings, preserves divergent same-id findings and can emit default-off progress events. The previously shipped stopped-summary behavior is recorded as already present rather than re-implemented.

### Added

- `computeGraphNoveltyDelta` from graph rows and persisted snapshots, independent of model self-report.
- `--reported-novelty` parsing, effective novelty calculation and the `novelty_self_report_unverified` STOP blocker.
- Configurable lag-ceiling evaluation and fanout warning events.
- Keep-both handling for same-id findings with divergent content.
- Optional in-lineage progress events, disabled by default until cadence is benchmarked.

### Changed

- Convergence now uses graph novelty as corroboration when reported novelty is provided.
- Missing reported novelty remains a backward-safe no-op.
- Lag enforcement adds a configured tripwire while existing council cost-guard shape stays intact.
- Same-id merge collisions keep divergent content instead of letting first arrival silently win.
- Stopped partial summaries remain the existing shutdown behavior and were not rebuilt here.

### Fixed

- Low self-reported novelty no longer allows STOP when graph novelty disproves it.
- Insight-only and flat-delta cases do not get spuriously blocked.
- Omitting reported novelty keeps previous behavior.
- Same-id divergent findings no longer clobber one another in the merge.

### Verification

- Baseline - PASS: broad related Vitest was 6 files / 83 tests. Baseline npm run typecheck failed because no script existed.
- node --check - PASS: convergence.cjs, cost-guards.cjs, fanout-merge.cjs, fanout-pool.cjs, fanout-run.cjs
- npm run typecheck - PASS: 0 errors
- Broad related Vitest - PASS: 7 files / 136 tests
- Dependency discipline - PASS: no implementation depends on reliability scoring
- Strict packet validation - PASS: 0 errors / 0 warnings

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modified | Adds graph-observed novelty delta |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modified | Adds reported-novelty parsing, effective novelty and STOP blocker |
| `.opencode/skills/deep-loop-runtime/lib/council/cost-guards.cjs` | Modified | Adds lag-ceiling normalization/evaluator |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | Adds default-off fanout lag/heartbeat config |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | Emits lag-ceiling warning events when configured |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Keeps both divergent same-id findings and marks conflicts |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Emits optional in-lineage progress events |
| `.opencode/skills/deep-loop-runtime/package.json` | Modified | Adds canonical npm run typecheck |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Added | Source-only runtime TypeScript check |
| `.opencode/skills/deep-loop-runtime/tests/...` | Modified | Adds deterministic coverage for runtime corroboration behavior |
| `spec.md, tasks.md, checklist.md, implementation-summary.md` | Modified | Reconciles runtime implementation status and remaining gates |

### Follow-Ups

- Confirm whether the orchestrator forwards reducer rolling ratio to `convergence.cjs`.
- Run an independent adversarial review of novelty anti-gaming and same-id keep-both behavior.
- Benchmark lag ceiling and progress heartbeat cadence before enabling either by default.
- No commit was created by request.
