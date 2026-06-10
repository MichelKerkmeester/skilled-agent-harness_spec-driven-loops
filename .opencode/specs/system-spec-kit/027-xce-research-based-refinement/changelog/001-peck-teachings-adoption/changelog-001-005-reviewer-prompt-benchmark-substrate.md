---
title: "Reviewer-prompt benchmark substrate for deep-improvement Lane B"
description: "Added a reviewer fixture schema, four seed fixtures, a standalone reviewer scorer, command and YAML routing for --scorer reviewer, and manual-playbook coverage. Gated behind SPECKIT_REVIEWER_BENCHMARKS. Existing Lane B/C defaults are unchanged."
trigger_phrases:
  - "reviewer prompt benchmark substrate"
  - "reviewer scorer lane b"
  - "SPECKIT_REVIEWER_BENCHMARKS"
  - "reviewer fixture schema"
  - "deep-improvement reviewer scorer"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption`

### Summary

Implemented the reviewer-prompt benchmark substrate for deep-improvement Lane B. The scorer works in two modes: deterministic replay using fixture-provided `reviewer_output` for CI-safe runs, and live dispatch through `dispatch-model.cjs` when a case omits `reviewer_output`. A visible/hidden oracle split mirrors the existing `t3-*` fixture shape so a reviewer prompt cannot overfit to the visible answer. Verdict extraction is pattern-first with an optional `--grader llm` fallback for ambiguous prose. The entire addition is gated behind `SPECKIT_REVIEWER_BENCHMARKS`, leaving Lane B/C defaults completely inert.

### Added

- `benchmark-fixtures/reviewer-schema.md`: fixture schema, verdict vocabulary, visible/hidden split, deterministic-replay contract, and how-to-add guidance.
- `benchmark-fixtures/reviewer-stale-verdict.json`: seed fixture for stale completion-evidence detection.
- `benchmark-fixtures/reviewer-softened-fail.json`: seed fixture for active-blocker anti-softening.
- `benchmark-fixtures/reviewer-over-read.json`: seed fixture for read-budget over-read.
- `benchmark-fixtures/reviewer-ac-coverage.json`: seed fixture for acceptance-coverage shortfall.
- `scripts/model-benchmark/lib/reviewer-scorer.cjs`: reviewer scorer with fixture detection, prompt composition, verdict extraction, fallback classification, D1-D5 dimensions, and report output.
- `MB-R01` scenario in `manual_testing_playbook/manual_testing_playbook.md`.

### Changed

- `benchmark-fixtures/README.md`: documents reviewer fixtures alongside existing pattern and code-task fixtures.
- `scripts/model-benchmark/lib/README.md`: documents `reviewer-scorer.cjs` alongside `code-task-scorer.cjs`.
- `commands/deep/start-model-benchmark-loop.md`: documents `--scorer reviewer`, `SPECKIT_REVIEWER_BENCHMARKS`, reviewer example, and mismatch report line.
- `commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` and `deep_start-model-benchmark-loop_confirm.yaml`: adds reviewer scorer enum, script path, report path, and conditional scorer command.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| YAML parse on both edited YAML files | PASS |
| Reviewer JSON parse for all four seed fixtures | PASS |
| Reviewer fixture recognized and routed to reviewer scorer with flag on | PASS (`REVIEWER_CLI_OK 4 100`) |
| Flag-off path | PASS (inert stderr emitted) |
| Reviewer scorer extracts verdict and compares to oracle | PASS (`SCORER_OK reviewer-stale-verdict 2`) |
| Existing Lane B/C scorer defaults unchanged | PASS (no edits to those files) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-schema.md` | Created | Fixture schema and howto |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-stale-verdict.json` | Created | Stale-verdict seed fixture |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-softened-fail.json` | Created | Softened-fail seed fixture |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-over-read.json` | Created | Over-read seed fixture |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-ac-coverage.json` | Created | AC-coverage seed fixture |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md` | Modified | Added reviewer fixture documentation |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Created | Reviewer scorer implementation |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/README.md` | Modified | Added scorer documentation |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modified | Documented reviewer scorer options |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Modified | Added reviewer scorer routing |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Modified | Added reviewer scorer routing |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | Modified | Added MB-R01 reviewer regression scenario |

### Follow-Ups

- Live-LLM verdicts are nondeterministic. Only deterministic replay is suitable for blocking CI or pre-commit. Live-LLM reviewer runs stay opt-in and nightly by design.
- `.github/workflows/` and `run-benchmark.cjs` were outside the approved write paths. CI seam and default runner internals were not directly modified.
