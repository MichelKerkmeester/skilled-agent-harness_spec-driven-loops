---
title: "Tasks: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Task breakdown for 021-completion-evidence-reconcile: confirm-before-build pass over 9 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "completion evidence reconcile"
  - "blocker 4 evidence drift"
  - "migration program completion claims"
  - "recursive validation child manifest"
  - "deep loop 021 reconcile"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile"
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

# Tasks: Reconcile Migration-Program Completion Claims Against the Current Suites

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
| M1 | T001-T005 | Four baselines recorded at a named SHA |
| M2 | T006-T008 | Reopen set frozen |
| M3 | T009-T016 | Zero unreproducible citations remain |
| M4 | T017-T022 | Unlisted child fails the recursive gate |
| M5 | T023-T027 | All 9 findings closed; independent pass recorded |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and baseline [M1]

No edit may precede T001 and the baseline capture. Every later claim in this child is a delta against these numbers.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 9 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` (cite the probe or test) / `REFUTED` (cite what the code actually does) / `MOVED` (cite the new anchor) / `ALREADY-FIXED` (cite the commit). `REFUTED` and `ALREADY-FIXED` findings close with a rationale line and **no code change**. (`spec.md` §3 scope table) [3h]
- [ ] T002 [P] Capture the `runtime` baseline: `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`. Record discovered test count, pass/fail/skip, exit code, and the SHA. [1h] {deps: T001}
- [ ] T003 [P] Capture the alignment script baseline: `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`. This is the `F-ORC-01` RED anchor — record it, assign its failures to `031`, do not fix. Note the reported runner quirk: the bare-directory form fails on this Node, the file glob is required. [1h] {deps: T001}
- [ ] T004 [P] Capture the council baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`. [1h] {deps: T001}
- [ ] T005 [P] Capture the improvement baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`. [1h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Enumerate the reopen set [M2]

- [ ] T006 Enumerate every completion item in the `013` program whose evidence cites a count or line anchor that does not reproduce against the T002-T005 baselines. [3h] {deps: T002, T003, T004, T005}
- [ ] T007 Extend the set with parent rollups that would be left claiming Complete over a reopened child. [1h] {deps: T006}
- [ ] T008 Freeze the reopen set and record it in `implementation-summary.md` before any edit. [1h] {deps: T007}

### Re-evidence or strike [M3]

- [ ] T009 Re-evidence or strike the deep-review resume-adapter claims (`F-025-01`) (`013/002-deep-review/005-resume-adapter/checklist.md`) [2h] {deps: T008}
- [ ] T010 Re-evidence or strike the council resume-adapter 6/6 claim (`F-025-02`) (`013/003-deep-ai-council/005-resume-adapter/checklist.md`) [2h] {deps: T008}
- [ ] T011 Resolve the council shadow-parity checklist/summary contradiction (`F-025-03`, CONFIRMED) (`013/003-deep-ai-council/006-shadow-parity/{checklist.md,implementation-summary.md}`) [3h] {deps: T008}
- [ ] T012 Re-evidence or strike the deep-research certificate claims (`F-025-04`) (`013/001-deep-research/004-certificates-and-receipts/checklist.md`) [2h] {deps: T008}
- [ ] T013 Convert every reinstated `[x]` to the test-name + suite-digest + candidate-SHA format [3h] {deps: T009, T010, T011, T012}
- [ ] T014 Reconcile `015` status honestly and record that it gates `016` (`F-029-02`, CONFIRMED) (`015-legacy-writer-retirement/{checklist.md,tasks.md,graph-metadata.json}`) [2h] {deps: T008}
- [ ] T015 Reconcile every parent rollup so no parent claims Complete over a reopened child [2h] {deps: T013, T014}
- [ ] T016 [P] Reopen the four promoted `fix` entries lacking their evidence mechanism (`F-035-01`) (`shared/rollout/command-injection-rollout.json`) [2h] {deps: T001}

### Repair the acceptance boundary [M4]

- [ ] T017 Bound `goal-file-manifest.txt`: drop ignored and untracked entries, add the tracked frozen benchmark baseline (`F-029-01`) [2h] {deps: T013}
- [ ] T018 Add a manifest-vs-`git ls-files` check that fails closed when `git` is unavailable [2h] {deps: T017}
- [ ] T019 Capture a whole-repo recursive-validation baseline before touching `validate.sh` [1h] {deps: T001}
- [ ] T020 Add the hashed child-manifest boundary to recursive strict validation, opt-in per parent (`F-029-03`, CONFIRMED) (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`) [5h] {deps: T019}
- [ ] T021 Negative test: a child folder absent from the manifest must make the recursive gate FAIL, not widen or skip [2h] {deps: T020}
- [ ] T022 Add the rollout `fix`-entry validator and update `promotion-rule.md` (`shared/rollout/`) [3h] {deps: T016}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Disposition, delta and gate [M5]

- [ ] T023 Record the OD-1 `016` disposition (relocate or re-scope) in `PRE-014-VALIDATION-RUN.md` and in `decision-record.md` [2h] {deps: T017}
- [ ] T024 Record the `F-022-01` re-open trigger enforcement and cross-reference the WS1 disposition bucket [1h] {deps: T023}
- [ ] T025 Re-run all four runners and the whole-repo recursive validation; report every result as a delta against T002-T005 and T019 [2h] {deps: T020, T022}
- [ ] T026 Independent adversarial verification pass by an actor other than the builder, targeted at the reopened evidence set [4h] {deps: T025}
- [ ] T027 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile --strict` exits 0; reconcile completion metadata across spec/plan/tasks/implementation-summary [2h] {deps: T026}
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
