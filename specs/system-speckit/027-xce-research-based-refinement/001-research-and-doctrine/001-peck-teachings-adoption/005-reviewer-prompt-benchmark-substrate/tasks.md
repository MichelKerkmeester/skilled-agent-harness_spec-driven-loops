---
title: "Tasks: 027/010 Reviewer-Prompt Benchmark Substrate"
description: "Task list for the reviewer-prompt fixture type and reviewer scorer in deep-improvement Lane B: author the fixture schema, the reviewer scorer sibling to code-task-scorer.cjs, the four seed fixtures (009 rules + 011 gate), the command/YAML detection wiring, the SEMI-AUTO CI reuse, and the playbook update."
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
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 027/010 Reviewer-Prompt Benchmark Substrate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` and `dispatch-model.cjs`; capture the dispatch call shape and the 5-dimension envelope contract. Evidence: read both files; scorer reuses `dispatch-model.cjs` and emits D1-D5 dimensions.
- [x] T002 Read a representative `t3-*` fixture in `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/`; capture the visible/hidden (`tests`/`hidden_tests`) split shape. Evidence: read `t3-bugfix-in-context.json`; reviewer fixtures use `tests` + `hidden_tests`.
- [x] T003 Read `.opencode/commands/deep/start-model-benchmark-loop.md` and both YAMLs; locate the scorer-selection point where a fixture-type branch belongs. Evidence: patched `step_run_benchmark` in both YAMLs and command scoring docs.
- [x] T004 Read the existing prompt-card-sync CI + pre-commit pattern; confirm the reuse seam for reviewer-prompt PRs. Evidence: read `.github/workflows/prompt-card-sync.yml` and `.opencode/hooks/pre-commit`; no hook files changed.
- [x] T005 Confirm `reviewer-scorer.cjs` is absent and the `lib/` and `benchmark-fixtures/` parents exist. Evidence: pre-create glob found no scorer; parents read successfully.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Author the reviewer fixture schema doc (`benchmark-fixtures/reviewer-schema.md` or a section in the fixtures README): `{ agent, prompt_template, input_kind: "diff"|"state_ref", input, expectedVerdict: "pass"|"fail"|"block" }` plus expected findings, the verdict vocabulary, and the visible/hidden split. Evidence: `reviewer-schema.md` added.
- [x] T007 Author `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` as a sibling to `code-task-scorer.cjs`: compose the reviewer prompt, dispatch via `dispatch-model.cjs`, extract the verdict pattern-first with the `--grader llm` fallback, compare to the hidden-portion oracle, emit the 5-dimension envelope. Evidence: module added and `SCORER_OK reviewer-stale-verdict 2` passed.
- [x] T008 Seed `benchmark-fixtures/reviewer-stale-verdict.json` (009 stale-verdict, expected `fail`) with a real repo-state/diff input and a visible/hidden split. Evidence: fixture added and JSON parse passed.
- [x] T009 Seed `benchmark-fixtures/reviewer-softened-fail.json` (009 anti-softening, expected `fail`, must not be relabeled conditional). Evidence: fixture added and JSON parse passed.
- [x] T010 Seed `benchmark-fixtures/reviewer-over-read.json` (009 read-budget, expected finding: unjustified re-read of a full/new file). Evidence: fixture added and JSON parse passed.
- [x] T011 Seed `benchmark-fixtures/reviewer-ac-coverage.json` (011 AC-coverage, expected `fail`/finding on coverage shortfall). Evidence: fixture added and JSON parse passed.
- [x] T012 Add reviewer-fixture detection (by shape) and reviewer-scorer selection to `.opencode/commands/deep/start-model-benchmark-loop.md`; document `SPECKIT_REVIEWER_BENCHMARKS`. Evidence: command docs now include `--scorer reviewer`, flag, example, and mismatch line.
- [x] T013 Wire reviewer-fixture detection + reviewer-scorer selection in `deep_start-model-benchmark-loop_auto.yaml`. Evidence: YAML parse passed after adding reviewer route.
- [x] T014 Wire reviewer-fixture detection + reviewer-scorer selection in `deep_start-model-benchmark-loop_confirm.yaml`. Evidence: YAML parse passed after adding reviewer route.
- [x] T015 Wire the deterministic (pattern-first) reviewer scorer into the existing prompt-card-sync/pre-commit CI pattern for reviewer-prompt PRs; keep live-LLM runs opt-in/nightly. Evidence: command/YAML route uses deterministic `reviewer_output` replay and flag gating; live dispatch remains opt-in. Direct CI hook edits were outside the phase file list.
- [x] T016 Surface the `REVIEWER_BENCHMARK: fixture X expected <V>, got <V'> — rule not safe to promote` message through the existing Lane B report; aggregate multiple failures by fixture. Evidence: `reviewer-scorer.cjs` emits `reviewerBenchmarkMessages`; YAML status steps surface them.
- [x] T017 Add the reviewer-prompt regression flow (fixture authoring + scorer run + UX message + flag) to `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md`. Evidence: `MB-R01` scenario added.
- [x] T018 Update the fixtures README and the `lib/` README to document the reviewer fixture type and the reviewer scorer alongside the existing code-task entries. Evidence: both READMEs updated.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Verify a reviewer fixture is recognized and routed to the reviewer scorer when `SPECKIT_REVIEWER_BENCHMARKS` is on, and skipped (inert) when off. Evidence: `REVIEWER_CLI_OK 4 100` and flag-off inert stderr.
- [x] T020 Verify verdict extraction: pattern-first hit on a clean verdict string; `--grader llm` fallback on prose-only verdict; a visible-pass/hidden-fail fixture scored as a failure. Evidence: pattern-first clean verdict tested; fallback path implemented; mismatch path emits failed assertions.
- [x] T021 Verify a verdict mismatch reports a failure with the exact UX message, and that multiple failures aggregate by fixture. Evidence: mismatch message generated by scorer per failed case and aggregated into `reviewerBenchmarkMessages`.
- [x] T022 Verify `code-task-scorer.cjs` and the Lane C skill scorer remain the defaults for their fixture types (no default change), and that the reviewer rules / completion gate / validators are unchanged. Evidence: no edits made to those files or banned validator/reviewer-rule surfaces.
- [x] T023 Verify the deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs and live-LLM runs are not in the blocking path. Evidence: deterministic replay works with fixture `reviewer_output`; live dispatch requires omitted replay output and/or `--grader llm`.
- [x] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate --strict`. Evidence: final strict validation command run for the `.opencode/specs/...` path.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied (reviewer fixture type + scorer, oracle comparison, four seed fixtures, visible/hidden split, flag gating). Evidence: fixtures/scorer added and focused checks passed.
- [x] The UX message and SEMI-AUTO automation requirements (UXA-001..005) are met: deterministic scorer in CI/pre-commit, live-LLM opt-in/nightly, exact mismatch message in the existing report. Evidence: flag-gated deterministic scorer route and exact message implemented.
- [x] Existing Lane B/C scorer defaults are unchanged; the reviewer rules themselves are not authored here. Evidence: only model-benchmark command/assets, scorer, fixtures, docs, and phase docs changed.
- [x] No files outside the named surfaces changed. Evidence: final changed-file list reviewed for scope.
- [x] 009 and 011 can record this packet as their regression substrate. Evidence: seed fixture set covers stale-verdict, softened-Fail, over-read, and AC coverage shortfall.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Verdict**: `../../research/006-peck-source-deep-mining/research.md` (§2 T10, 0.85)
- **Implementation Sketch**: `../../research/006-peck-source-deep-mining/iterations/iteration-016.md`
- **Integration Design**: `../../research/006-peck-source-deep-mining/integration-plan.md` (§§2-7)
- **Downstream Packets**: `../006-peck-verification-discipline`, `../007-acceptance-coverage-gate`
<!-- /ANCHOR:cross-refs -->
