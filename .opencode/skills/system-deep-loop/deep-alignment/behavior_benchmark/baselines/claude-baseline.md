---
title: "deep-alignment Behavior Benchmark — Claude Baseline"
description: "Per-scenario Claude-leg baseline checkpoints and classifications for the DAB scenario set. No leg captured yet; every cell is pending, budgets are framework-floor provisional values, and D5 is null until a capture lands."
trigger_phrases:
  - "deep alignment claude baseline"
  - "DAB baseline checkpoints"
  - "alignment behavior benchmark baseline"
importance_tier: "high"
contextType: "implementation"
---

# deep-alignment Behavior Benchmark — Claude Baseline

## Baseline Table

No Claude leg has been captured for the DAB scenarios yet, so this table carries
no measured values. Every checkpoint is `pending` and every classification is
`not_captured`. Do not quote a latency ratio, a budget, or a pass rate from this
file until a real capture replaces the `pending` cells — an uncaptured cell is
never quotable as behavior.

| Scenario | tFirstOutput | tSetup | tFirstDispatch | tTerminal | Classification |
|---|---|---|---|---|---|
| DAB-001 | pending | pending | pending | pending | not_captured |
| DAB-002 | pending | pending | n/a | pending | not_captured |
| DAB-003 | pending | pending | n/a | pending | not_captured |
| DAB-004 | pending | pending | n/a | pending | not_captured |
| DAB-005 | pending | pending | pending | pending | not_captured |
| DAB-006 | pending | pending | pending | pending | not_captured |
| DAB-007 | pending | pending | pending | pending | not_captured |
| DAB-008 | pending | pending | pending | pending | not_captured |
| DAB-009 | pending | pending | n/a | pending | not_captured |
| DAB-010 | pending | pending | n/a | pending | not_captured |
| DAB-011 | pending | pending | pending | pending | not_captured |

## Capture Provenance

- **Date**: not yet captured.
- **Leg**: `claude-cli` (to be run — `claude ... -p --output-format stream-json --verbose --dangerously-skip-permissions`, matching the sibling packages' baseline leg).
- **Sampling**: none yet. When captured, the default is single-sample per cell with the framework's rerun policy applying to contested cells.
- **Host confound (stated per the framework)**: once captured, the baseline runs a different host binary than the opencode legs, so host overhead (session bootstrap, hook wiring) folds into every latency ratio derived from these values. Restate this confound inline wherever a D5 ratio is reported.

## Notes

- **Budgets are provisional, not baseline-derived.** The framework's budget
  formula `budget_ms = max(3 * claude_baseline_tTerminal, 180000)` cannot be
  applied until a `tTerminal` exists per cell. The `budget_ms` values in the
  scenario contracts (`300000` for the `question_halt` cells, `900000` for the
  autonomous cells) are the framework-floor / review-cap provisional defaults;
  recompute them from the captured `tTerminal` values when this baseline is
  filled in.
- **Autonomous-cell watchdog.** The six autonomous cells (DAB-001, DAB-005,
  DAB-006, DAB-007, DAB-008, DAB-011) set `watchdog_ms: 480000`, the same
  no-progress window the framework calibrated for delegating deep-review cells,
  because a deep-alignment cell that dispatches the LEAF agent legitimately
  goes quiet for minutes while a lane's corpus is checked slice by slice.
- **Fixture provisioning is a prerequisite for capture.** The DAB cells bind a
  fixture the executing round must provision first (see this package's index
  EXECUTION section and each scenario's body). A capture run cannot be scored
  until that corpus and its lane-config files exist, since the invariant cells
  (DAB-005/006/007) depend on specific seeded artifacts to observe the correct
  suppress / re-probe / read-only behavior.
