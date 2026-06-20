---
title: "Changelog: Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster) [004-deep-loop/002-fanout-determinism-observability]"
description: "Chronological changelog for the Deep Loop Fan-out Determinism + Observability (028/004 determinism cluster) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/002-fanout-determinism-observability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop`

### Summary

Deep-loop fan-out now has deterministic merge coverage, read-derived pool gauges and graceful stopped-run summaries. The Wave-0 trio shipped in commit `46812f12a8` and this phase adds the tail work in commit `fd30af2cb6`: order-invariance tests for research and review merges, deterministic ordering of lineage labels and metadata arrays and a default-off near-duplicate dedup option that collapses normalized body restatements when a caller opts in.

### Added

- Research and review merge property tests that assert byte-identical registries across lineage-order permutations.
- Deterministic sorting for lineage labels and merged metadata arrays in `fanout-merge.cjs`.
- Default-off near-duplicate collapse for normalized body restatements, available through option, CLI flag or environment variable.
- Read-derived pool gauges and stopped partial summaries remain part of the shipped foundation.

### Changed

- Review open and resolved findings use the same default-off near-duplicate collapse as research merges.
- Distinct same-id records with different content remain conflict variants rather than disappearing.
- This cluster stays independent of reliability scoring and failure-recovery work, which live in sibling phases.

### Fixed

- Full-registry output no longer depends on lineage arrival order.
- Near-duplicate collapse preserves strongest severity and keeps distinct-content variants.
- Phase docs separate determinism work from reliability and recovery concerns.

### Verification

- Baseline typecheck - Pass
- Baseline broad unit suite - Pass
- Syntax - Pass
- Comment hygiene - Pass
- Targeted merge tests - Pass
- Final typecheck - Pass
- Final broad unit suite - Pass
- Strict packet validation - Pass

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified (Wave-1 `fd30af2cb6`) | Existing comparator remains, with deterministic label and metadata ordering plus default-off normalized-body-content dedup |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified (Wave-0 `46812f12a8`) | `buildPoolGauges` read-derived lag, pending and failed values, live per settle plus final summary |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified (Wave-0 `46812f12a8`) | empty-tick=convergence + stopped partial-summary flush on SIGINT/SIGTERM |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts` | Modified (Wave-1 `fd30af2cb6`) | Added tests for order-invariance, default-off near-dup collapse, distinct-content survival and resolved review variants |
| `.opencode/specs/.../002-fanout-determinism-observability/{spec,plan,tasks,implementation-summary,checklist}.md` | Modified | Level-2 packet docs reconciled to 3 Wave-0 DONE rows plus 3 Wave-1 DONE rows |

### Follow-Ups

- No measured benefit number exists for source-diversity effects.
- Near-duplicate dedup changes merge membership when enabled, so it remains opt-in.
- No live benchmark or reindex was run. Verification stayed at code, typecheck and unit-test level.
