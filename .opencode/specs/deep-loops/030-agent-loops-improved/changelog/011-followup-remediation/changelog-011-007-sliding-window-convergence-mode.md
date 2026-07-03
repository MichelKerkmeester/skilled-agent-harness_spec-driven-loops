---
title: "Changelog: Sliding-Window Convergence Mode [011-followup-remediation/007-sliding-window-convergence-mode]"
description: "Chronological changelog for the Sliding-Window Convergence Mode phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-02

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode` (Level 3)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation`

### Summary

Implemented the parent packet ADR's opt-in `convergenceMode: "sliding-window"` fix for denominator drag: long loops previously measured novelty against their entire accumulated history, so late discoveries became statistically invisible and loops stopped early. The new mode measures novelty against the last N iterations (validated `slidingWindowSize`, default 5, early iterations clamped to full history), records both the windowed and full-history ratio in telemetry for rollout comparison, and leaves `default`/`off` behavior byte-identical. Implemented by a GPT-5.5-fast xhigh dispatch against orchestrator-authored Level 3 docs and independently verified by the orchestrator.

### Added

- `computeWindowedGraphNoveltyDelta` in `coverage-graph-signals.ts`: windowed novelty anchored to the N-back snapshot, early-clamped, size-validated.
- `readConvergenceModeConfig` in `convergence.cjs`: mode/size validation (`sliding-window` default size 5; 0, negative, non-integer rejected with a clear error; unknown modes rejected).
- Dual telemetry in sliding-window mode: `fullHistoryNewInfoRatio` and `windowedNewInfoRatio` side by side; both fields asserted absent in `default`/`off`.
- The denominator-drag proof fixture: full-history ratio 1/44 (suppressed below a 0.05 threshold) vs windowed 1/4 (visible above 0.20) on the same late-novelty data.

### Changed

- `main()` in `convergence.cjs` selects the windowed signal only when the mode is explicitly configured; the existing paths are untouched (opt-in parallel path per the local decision record).

### Fixed

- Denominator drag on 30+ iteration loops, the reason forced-depth `stopPolicy=max-iterations` was previously the only way to trust long runs.

### Verification

- Full deep-loop-runtime vitest suite: baseline 574/576 before the change, 578/580 after, failing test names unchanged. The 2 failures were proven pre-existing by stashing the change and re-running the failing files (still fail). Zero new failures.
- Mutation check run twice independently: the implementer and the orchestrator each broke the windowed denominator and observed the same drag-fixture failure value (0.0227 vs the expected 0.25), then restored green (25/25 in the fixture file).
- Comment hygiene clean on both source files. `validate.sh --strict` passed 0 errors / 0 warnings on the folder during the implementation window.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modified | Windowed novelty function (+57 lines) |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modified | Mode config validation + dispatch + dual telemetry (+117/-12) |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modified | Drag fixture, validation tests, telemetry-absence assertions (+158 lines) |

### Follow-Ups

- Two pre-existing deep-loop-runtime suite failures (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) predate this child and remain unowned repo debt.
- Telemetry comparison data from the first sliding-window rollout cycle should inform whether the mode ever becomes a recommended default (parent ADR keeps it opt-in until then).
