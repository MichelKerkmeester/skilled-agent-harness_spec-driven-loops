---
title: "Implementation Summary: 027/010 Reviewer-Prompt Benchmark Substrate"
description: "Implementation summary for the reviewer-prompt fixture type and reviewer scorer in deep-improvement Lane B."
trigger_phrases:
  - "027 phase 010"
  - "reviewer prompt benchmark substrate"
  - "reviewer fixture"
  - "reviewer scorer lane b"
  - "SPECKIT_REVIEWER_BENCHMARKS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-10T07:04:58Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added reviewer fixture substrate"
    next_safe_action: "Use reviewer fixtures before promoting reviewer rules"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate` |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
| **Status** | Completed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented a reviewer-prompt benchmark substrate for deep-improvement Lane B. The substrate adds a reviewer fixture schema, four seed fixtures, a standalone reviewer scorer, command/YAML routing for `--scorer reviewer`, and manual-playbook coverage. The scorer is gated by `SPECKIT_REVIEWER_BENCHMARKS`, uses deterministic replay when fixtures provide `reviewer_output`, dispatches through `dispatch-model.cjs` when live output is needed, extracts `PASS`/`FAIL`/`BLOCK` pattern-first, and exposes an LLM-grader fallback for ambiguous prose.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-schema.md` | Added | Reviewer fixture schema, verdict vocabulary, visible/hidden split, deterministic replay, and how-to-add guidance. |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-stale-verdict.json` | Added | Stale completion-evidence seed fixture with visible and hidden cases. |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-softened-fail.json` | Added | Active-blocker anti-softening seed fixture with visible and hidden cases. |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-over-read.json` | Added | Read-budget over-read seed fixture with visible and hidden cases. |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/reviewer-ac-coverage.json` | Added | Acceptance-coverage shortfall seed fixture with visible and hidden cases. |
| `.opencode/skills/deep-improvement/assets/model_benchmark/benchmark-fixtures/README.md` | Modified | Documents reviewer fixtures alongside existing pattern and code-task fixtures. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Added | Reviewer scorer with fixture detection, prompt composition, verdict extraction, fallback classification, oracle comparison, D1-D5 dimensions, and report output. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/README.md` | Modified | Documents `reviewer-scorer.cjs` alongside `code-task-scorer.cjs`. |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modified | Documents `--scorer reviewer`, `SPECKIT_REVIEWER_BENCHMARKS`, reviewer example, and mismatch report line. |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`, `deep_start-model-benchmark-loop_confirm.yaml` | Modified | Adds reviewer scorer enum, script path, reviewer report path, and conditional reviewer scorer command. |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | Modified | Adds reviewer-prompt regression scenario `MB-R01`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery was additive and scoped to the model-benchmark command/assets, benchmark fixtures, reviewer scorer, playbook documentation, and this phase folder. The live asset tree is `assets/model_benchmark`, so implementation used that existing directory while recording the spec's hyphenated path as a source drift.

The scorer works in two modes:

1. Deterministic replay: parse fixture-provided `reviewer_output`, used for fast CI/pre-commit style checks.
2. Live dispatch: compose the reviewer prompt and call `dispatch-model.cjs` when a case omits `reviewer_output`; ambiguous verdict prose can be classified through the `--grader llm` fallback.

Existing defaults were preserved by leaving `run-benchmark.cjs`, `loop-host.cjs`, `code-task-scorer.cjs`, Lane C, reviewer-rule prompts, completion gates, and validator files unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sibling scorer, not a fork | The reviewer scorer reuses `dispatch-model.cjs`, the 5dim envelope, and the `--grader llm` fallback; one dispatch/envelope/grader mechanism to maintain. |
| SEMI-AUTO automation | Deterministic pattern-first scorer runs in CI/pre-commit on reviewer-prompt PRs; live-LLM runs stay opt-in/nightly so nondeterministic verdicts never flap CI (ADR-001). |
| Visible/hidden oracle split | Mirror the `t3-*` `tests`/`hidden_tests` shape so a reviewer prompt cannot overfit to the visible answer. |
| Pattern-first verdict extraction | Keep the exact PASS/FAIL/BLOCK strings parseable; fall back to `--grader llm` only on ambiguous prose. |
| Gate behind `SPECKIT_REVIEWER_BENCHMARKS` | Off = existing Lane B/C behavior unchanged; the addition is additive and reversible. |
| Use `assets/model_benchmark` | The spec named a hyphenated asset path, but the repository and command use `assets/model_benchmark`; using the live tree avoids creating a parallel fixture root. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse | PASS: `python3 -c yaml.safe_load` parsed both edited YAML files. |
| Reviewer JSON parse | PASS: `python3 -m json.tool` parsed all four reviewer fixtures. |
| Reviewer fixture recognized + routed to the reviewer scorer when the flag is on; inert when off | PASS: `REVIEWER_CLI_OK 4 100`; flag-off path emitted inert stderr. |
| Reviewer scorer extracts verdict and compares to oracle | PASS: `SCORER_OK reviewer-stale-verdict 2`. |
| Seed fixtures present for stale-verdict, softened-Fail, over-read, and AC-coverage with a visible/hidden split | PASS: four fixtures added under `assets/model_benchmark/benchmark-fixtures/`. |
| Existing Lane B/C scorer defaults unchanged; reviewer rules / completion gate / validators unchanged | PASS: no edits to those files. |
| Exact `REVIEWER_BENCHMARK: ... — rule not safe to promote` message surfaced in the Lane B report path | PASS: scorer writes `reviewerBenchmarkMessages`; command/YAML report steps surface them. |
| Strict spec validation | PASS: rerun at epic remediation close (2026-06-11), 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The phase file list did not allow editing `.github/workflows/` or `.opencode/hooks/`, so the existing CI/pre-commit seam is reused and documented but not directly modified.
2. The phase file list did not allow editing `run-benchmark.cjs` or `loop-host.cjs`, so reviewer selection is expressed in the command/YAML route and standalone scorer rather than in the default runner internals.
3. Live-LLM verdicts are nondeterministic. Only deterministic replay is suitable for blocking CI/pre-commit; live-LLM reviewer runs remain opt-in/nightly by design.
<!-- /ANCHOR:limitations -->
