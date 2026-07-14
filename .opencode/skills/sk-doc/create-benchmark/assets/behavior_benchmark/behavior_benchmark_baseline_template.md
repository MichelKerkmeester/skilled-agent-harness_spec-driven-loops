---
title: "Behavior Benchmark Baseline Template"
description: "Fillable scaffold for a behavior_benchmark package's Claude baseline — the claude-baseline.md that carries per-scenario reference checkpoints, capture provenance, and the confounds every derived latency ratio must restate."
trigger_phrases:
  - "behavior benchmark baseline template"
  - "claude-baseline.md scaffold"
  - "behavior benchmark checkpoints template"
  - "behavior baseline provenance"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for a behavior_benchmark BASELINE:
  <deep-loop-mode>/behavior_benchmark/baselines/claude-baseline.md

Usage:
  1. cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/behavior_benchmark/behavior_benchmark_baseline_template.md \
        .opencode/skills/system-deep-loop/<mode>/behavior_benchmark/baselines/claude-baseline.md
  2. DELETE the "version:" line below. A shipped baseline carries the five
     frontmatter fields shown and NO version field: it is a memory-indexed DATA
     artifact outside the references/** and assets/** version-scope defined in
     ../../../shared/references/frontmatter_versioning.md §1, not a versioned
     reference doc.
  3. Ship the file with every row "pending" / "not_captured" if no Claude leg has
     run yet — an uncaptured cell is a legitimate ship state, but it is NEVER
     quotable as behavior. Replace pending cells with measured values only after a
     real capture.
  4. Once a real tTerminal exists per cell, recompute each scenario's budget_ms
     from the framework formula and update the scenario contracts to match.

The budget formula and the D5 latency-ratio definition are normative in:
  .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
-->

# {{MODE}} Behavior Benchmark — Claude Baseline

## 1. OVERVIEW

This file carries the Claude reference-leg checkpoints for the {{PREFIX}} scenario
set: per-scenario setup, first-dispatch, and terminal latencies plus a terminal
classification. It is the denominator every D5 latency ratio and every provisional
`budget_ms` is derived from, so an uncaptured cell here is never quotable as
behavior.

## 2. BASELINE TABLE

<!-- Until a Claude leg is captured, keep this paragraph and leave every cell
     pending. Replace it with a one-line capture summary once real values land.
     tFirstDispatch is "n/a" for question_halt cells (they never dispatch). -->

No Claude leg has been captured for the {{PREFIX}} scenarios yet, so this table
carries no measured values. Every checkpoint is `pending` and every classification
is `not_captured`. Do not quote a latency ratio, a budget, or a pass rate from
this file until a real capture replaces the `pending` cells — an uncaptured cell
is never quotable as behavior.

| Scenario | tFirstOutput | tSetup | tFirstDispatch | tTerminal | Classification |
|---|---|---|---|---|---|
| {{PREFIX}}-001 | pending | pending | pending | pending | not_captured |
| {{PREFIX}}-002 | pending | pending | {{PENDING_OR_NA}} | pending | not_captured |
| {{PREFIX}}-NNN | pending | pending | {{PENDING_OR_NA}} | pending | not_captured |

## 3. CAPTURE PROVENANCE

The framework requires the date, the host and CLI versions on the baseline leg,
and which executor leg produced the values (framework.md PACKAGE CONVENTIONS) —
fill all four below, not just the date.

- **Date**: {{NOT_YET_CAPTURED_OR_CAPTURE_DATE}}.
- **Host / environment**: {{HOST_MACHINE_OR_ENVIRONMENT_NOTE_OR_NOT_YET_CAPTURED}}.
- **Executor model**: {{EXECUTOR_MODEL_OR_NOT_YET_CAPTURED}} — the model the `claude-cli` leg actually ran (e.g. `claude-opus-4-8`), not assumed from the CLI default.
- **Leg**: `claude-cli` {{CLI_BINARY_VERSION_OR_TO_BE_CAPTURED}} — `claude ... -p --output-format stream-json --verbose --dangerously-skip-permissions`, matching the sibling packages' baseline leg.
- **Sampling**: {{NONE_YET_OR_SAMPLES_PER_CELL_AND_RERUN_POLICY}}.
- **Host confound (stated per the framework)**: the baseline runs a different host binary than the opencode legs, so host overhead (session bootstrap, hook wiring) folds into every latency ratio derived from these values. Restate this confound inline wherever a D5 ratio is reported.

## 4. NOTES

- **Budgets are provisional, not baseline-derived.** The framework's budget
  formula `budget_ms = max(3 * claude_baseline_tTerminal, 180000)` cannot be
  applied until a `tTerminal` exists per cell. The `budget_ms` values in the
  scenario contracts ({{THE_PROVISIONAL_FLOOR_180000_MS_UNTIL_CAPTURE}}) are the
  framework-floor provisional defaults, capped by mode at 900000 ms
  (research/review) or 1500000 ms (ai-council/improvement/alignment) — see
  framework.md BUDGET POLICY, never a per-scenario invented number; recompute
  them from the captured `tTerminal` values when this baseline is filled in.
- **Autonomous-cell watchdog.** {{WHICH_CELLS_SET_WATCHDOG_MS_AND_WHY_A_DELEGATING_CELL_LEGITIMATELY_GOES_QUIET}}
- **Fixture provisioning is a prerequisite for capture.** {{WHICH_CELLS_BIND_A_FIXTURE_THE_EXECUTING_ROUND_MUST_PROVISION_FIRST_AND_WHY_CAPTURE_CANNOT_SCORE_WITHOUT_IT}}
