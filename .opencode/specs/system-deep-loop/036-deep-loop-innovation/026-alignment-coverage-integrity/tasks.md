---
title: "Tasks: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "Task breakdown for 026-alignment-coverage-integrity: confirm-before-build pass over 20 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "alignment coverage integrity"
  - "coverage fails open corpus"
  - "lane identity injective normalizer"
  - "unearned coverage credit alignment"
  - "deep loop 026 alignment"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/026-alignment-coverage-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Make Alignment Coverage, Seal State and Lane Identity Provable

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T005 | RED baseline captured; three ADRs derived |
| M2 | T006-T009 | Differential test green |
| M3 | T010-T015 | Four states distinguishable |
| M4 | T016-T019 | Credit is evidence-bound and slice-restricted |
| M5 | T020-T023 | Suite delta clean; registry honest |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm, baseline and derive [M1]

Three findings ship without a recommended action. Deriving those three is design work and must produce an ADR before any code is written against them.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 20 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Fifteen carry a CONFIRMED mark already; re-confirm them at HEAD rather than inheriting the mark. (`spec.md` §3 scope table) [5h]
- [ ] T002 Capture the `021` RED alignment baseline as the delta anchor: `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`. Name the 5 pre-existing command-contract failures and record that they belong to `031`. [2h] {deps: T001}
- [ ] T003 Derive and record the recommended action for `F-SOL-04` (including its over-tightening regression) as an ADR [3h] {deps: T001}
- [ ] T004 [P] Derive and record the recommended action for `F-SOL-06` as an ADR [2h] {deps: T001}
- [ ] T005 [P] Derive and record the recommended action for `F-SOL-07` as an ADR [2h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shared normalizer and canonical identity [M2]

- [ ] T006 Build one normalizer module both readers use [6h] {deps: T003}
- [ ] T007 Define canonical lane identity including adapter and scope type, injective across separators and array orderings (`F-009-03`, `F-RES-05`) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`) [8h] {deps: T006}
- [ ] T008 Fix the `F-SOL-04` over-tightening regression: the honest corpus lane the in-run fix rejects must be accepted [4h] {deps: T006}
- [ ] T009 Shared-normalizer differential test across duplicate IDs, orphan lanes, repeated internal whitespace, `paths` versus `globs` with equal values, and comma-containing values (`F-SOL-02`, `F-SOL-04`) [6h] {deps: T007, T008}

### Fail-closed coverage and seal [M3]

- [ ] T010 Four distinguishable corpus states: absent, empty-valid, malformed, configured-lane-missing (`F-009-01`, `F-SOL-01`, `F-SOL-03`, `F-SOL-06`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`) [8h] {deps: T009}
- [ ] T011 Intersect `artifactsChecked` against the canonical corpus instead of unioning arbitrary strings (`F-009-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`) [5h] {deps: T009}
- [ ] T012 Stop re-crediting coverage from repeated bare artifact counts (`F-SOL-07`) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`) [4h] {deps: T005, T011}
- [ ] T013 Exclude failed, stuck and timed-out iterations from coverage and the stability window (`F-RES-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`) [4h] {deps: T011}
- [ ] T014 Seal predicate excludes pre-discovery state (`F-RES-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`) [4h] {deps: T011}
- [ ] T015 Workflow requires `sealed===true` before complete and handles `DISCOVERY_INCOMPLETE` (`F-RES-01`, `F-SOL-05`) (`.opencode/skills/system-deep-loop/commands/deep/assets/deep-alignment-{auto,confirm}.yaml`) [5h] {deps: T014}

### Evidence-bound credit [M4]

This layer sits on top of the closed record parser `024` owns. Do not restructure leaf publication here.

- [ ] T016 Bind coverage credit to per-artifact evidence (a finding, a content digest, or an adapter check receipt) and restrict it to the dispatched slice (`F-RES-04`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts`) [10h] {deps: T013}
- [ ] T017 Live-render adapter returns a check receipt with measurements rather than a caller-supplied `dispatchedThrough` string (`F-009-04`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs`) [5h] {deps: T016}
- [ ] T018 [P] Retain the selected adapter through interactive scoping (`F-009-06`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`) [3h] {deps: T007}
- [ ] T019 Partition identity for live-render artifacts and cursor advance from credited evidence only (`F-009-05`, `F-RES-06`) (`.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs`) [6h] {deps: T016}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Registry honesty and gate [M5]

- [ ] T020 Register alignment against the convergence backend it actually uses (`F-026-04`) (`.opencode/skills/system-deep-loop/mode-registry.json`, `.opencode/skills/system-deep-loop/SKILL.md`) [3h] {deps: T001}
- [ ] T021 Unearned-credit test: a leaf claiming the full canonical corpus with no per-artifact evidence earns zero coverage [4h] {deps: T016}
- [ ] T022 Re-run `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs` and `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report deltas against the `021` baselines, excluding the 5 pre-existing command-contract failures [3h] {deps: T015, T019, T020, T021}
- [ ] T023 Independent adversarial verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/026-alignment-coverage-integrity --strict` exits 0; record the alignment-lane gate for `014` [6h] {deps: T022}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] All ADRs have a terminal status (Accepted or Superseded)
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
