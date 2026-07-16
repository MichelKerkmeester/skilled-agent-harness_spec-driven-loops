---
title: "Changelog: Rescue-Layer Ranking Authority Decision [016/006-rescue-layer-ranking-authority-decision]"
description: "Built eval-production parity so the benchmark measures the real pipeline, made the rescue-layer ranking mode selectable and benchmarkable and recorded the A/B/C benchmark while the ADR-002 authority decision stays deferred."
trigger_phrases:
  - "rescue layer ranking authority changelog"
  - "eval production parity harness"
  - "adr-002 deferred"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The benchmark can finally measure the real system. Eval reporting and ablation used to run a legacy `hybridSearch` path, so any ranking conclusion came from a composition the daemon never runs. Eval and ablation now execute the production `executePipeline` with the real channels, co-activation and render-floor truncation. This parity harness is the prerequisite that unblocks phases 007 and 008. The retrieval-rescue score rewrite became a selectable mode behind `SPECKIT_RETRIEVAL_RESCUE_MODE` so the ranking authority can be A/B/C benchmarked instead of argued. The ADR-002 authority decision was deferred by the operator because the current numbers are confounded by sparse vectors and stale eval ground truth. Shipped in `9d5e4901b9`.

### Added

- An eval-production parity harness. Eval and ablation now run `executePipeline` instead of a legacy path.
- Selectable rescue modes named overwrite, additive and floor behind `SPECKIT_RETRIEVAL_RESCUE_MODE` for A/B/C benchmarking.
- A signal-ordering contract test.

### Changed

- The ablation DB swap-and-restore rebinds every consumer including `graphSearchFn` to the restored production connection.
- The eval DB path resolves from `import.meta.url` rather than the current directory.
- The stage2-fusion step header and the pipeline README now describe the actual composition.
- The interference-score write-path recompute is an explicit no-op with a durable rationale, so no stage2 signal is silently computed and discarded.

### Verification

- `npm run build` clean.
- 006 vitest 31 of 31, 1 skipped.
- Eval imports and calls `executePipeline`, confirmed.
- A/B/C benchmark on the parity harness at completeRecall@3: A 0.40, B 0.20, C 0.20.
- ADR-002 authority deferred by the operator on confounded data.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/handlers/eval-reporting.ts` runs the production pipeline.
- `mcp_server/lib/search/rerank/retrieval-rescue.ts` carries the selectable modes.
- `mcp_server/core/db-state.ts` rebinds consumers on swap and restore.

### Follow-Ups

- ADR-002 rescue authority stays Proposed and the rescue mode stays overwrite. Re-benchmark once the phase-004 vector reconcile has run daemon-side and the eval ground truth is refreshed.
- Harness effects apply when the daemon restarts with the new dist.
