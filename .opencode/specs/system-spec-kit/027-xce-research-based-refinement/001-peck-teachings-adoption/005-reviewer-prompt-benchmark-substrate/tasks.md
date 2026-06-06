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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 010 from research 006 T10 + integration-plan 019-023"
    next_safe_action: "Author the reviewer fixture schema, then the reviewer scorer branch"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` and `dispatch-model.cjs`; capture the dispatch call shape and the 5-dimension envelope contract.
- [ ] T002 Read a representative `t3-*` fixture in `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/`; capture the visible/hidden (`tests`/`hidden_tests`) split shape.
- [ ] T003 Read `.opencode/commands/deep/start-model-benchmark-loop.md` and both YAMLs; locate the scorer-selection point where a fixture-type branch belongs.
- [ ] T004 Read the existing prompt-card-sync CI + pre-commit pattern; confirm the reuse seam for reviewer-prompt PRs.
- [ ] T005 Confirm `reviewer-scorer.cjs` is absent and the `lib/` and `benchmark-fixtures/` parents exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Author the reviewer fixture schema doc (`benchmark-fixtures/reviewer-schema.md` or a section in the fixtures README): `{ agent, prompt_template, input_kind: "diff"|"state_ref", input, expectedVerdict: "pass"|"fail"|"block" }` plus expected findings, the verdict vocabulary, and the visible/hidden split.
- [ ] T007 Author `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` as a sibling to `code-task-scorer.cjs`: compose the reviewer prompt, dispatch via `dispatch-model.cjs`, extract the verdict pattern-first with the `--grader llm` fallback, compare to the hidden-portion oracle, emit the 5-dimension envelope.
- [ ] T008 Seed `benchmark-fixtures/reviewer-stale-verdict.json` (009 stale-verdict, expected `fail`) with a real repo-state/diff input and a visible/hidden split.
- [ ] T009 Seed `benchmark-fixtures/reviewer-softened-fail.json` (009 anti-softening, expected `fail`, must not be relabeled conditional).
- [ ] T010 Seed `benchmark-fixtures/reviewer-over-read.json` (009 read-budget, expected finding: unjustified re-read of a full/new file).
- [ ] T011 Seed `benchmark-fixtures/reviewer-ac-coverage.json` (011 AC-coverage, expected `fail`/finding on coverage shortfall).
- [ ] T012 Add reviewer-fixture detection (by shape) and reviewer-scorer selection to `.opencode/commands/deep/start-model-benchmark-loop.md`; document `SPECKIT_REVIEWER_BENCHMARKS`.
- [ ] T013 Wire reviewer-fixture detection + reviewer-scorer selection in `deep_start-model-benchmark-loop_auto.yaml`.
- [ ] T014 Wire reviewer-fixture detection + reviewer-scorer selection in `deep_start-model-benchmark-loop_confirm.yaml`.
- [ ] T015 Wire the deterministic (pattern-first) reviewer scorer into the existing prompt-card-sync/pre-commit CI pattern for reviewer-prompt PRs; keep live-LLM runs opt-in/nightly.
- [ ] T016 Surface the `REVIEWER_BENCHMARK: fixture X expected <V>, got <V'> — rule not safe to promote` message through the existing Lane B report; aggregate multiple failures by fixture.
- [ ] T017 Add the reviewer-prompt regression flow (fixture authoring + scorer run + UX message + flag) to `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md`.
- [ ] T018 Update the fixtures README and the `lib/` README to document the reviewer fixture type and the reviewer scorer alongside the existing code-task entries.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Verify a reviewer fixture is recognized and routed to the reviewer scorer when `SPECKIT_REVIEWER_BENCHMARKS` is on, and skipped (inert) when off.
- [ ] T020 Verify verdict extraction: pattern-first hit on a clean verdict string; `--grader llm` fallback on prose-only verdict; a visible-pass/hidden-fail fixture scored as a failure.
- [ ] T021 Verify a verdict mismatch reports a failure with the exact UX message, and that multiple failures aggregate by fixture.
- [ ] T022 Verify `code-task-scorer.cjs` and the Lane C skill scorer remain the defaults for their fixture types (no default change), and that the reviewer rules / completion gate / validators are unchanged.
- [ ] T023 Verify the deterministic scorer runs in CI/pre-commit on reviewer-prompt PRs and live-LLM runs are not in the blocking path.
- [ ] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied (reviewer fixture type + scorer, oracle comparison, four seed fixtures, visible/hidden split, flag gating).
- [ ] The UX message and SEMI-AUTO automation requirements (UXA-001..005) are met: deterministic scorer in CI/pre-commit, live-LLM opt-in/nightly, exact mismatch message in the existing report.
- [ ] Existing Lane B/C scorer defaults are unchanged; the reviewer rules themselves are not authored here.
- [ ] No files outside the named surfaces changed.
- [ ] 009 and 011 can record this packet as their regression substrate.
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
