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
    last_updated_at: "2026-07-31T03:16:25Z"
    last_updated_by: "claude"
    recent_action: "Closed out 021: ADRs accepted, checklist reconciled, 016 fixed"
    next_safe_action: "None; monitor 031 Lane B for the alignment RED-anchor re-verify"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
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

<!-- ANCHOR:ai-exec -->
## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] `spec.md` scope unchanged
2. [ ] Current phase identified in `plan.md`
3. [ ] Task dependencies satisfied
4. [ ] Relevant P0/P1 `checklist.md` items identified
5. [ ] No blocking issues in `decision-record.md`

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against its acceptance criteria |
| TASK-DOC | Update status and evidence immediately on completion |

### Status Reporting Format
```
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [test name + suite digest + candidate SHA]
- **Next**: T### - [Next task]
```

### Blocked Task Protocol
A task marked `[B]` records its blocker inline and is not started until the blocker clears. This child's only recorded blocker (OPERATOR-DECISION OD-1) is resolved via `decision-record.md` ADR-003.
<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and baseline [M1]

No edit may precede T001 and the baseline capture. Every later claim in this child is a delta against these numbers.

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 9 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` (cite the probe or test) / `REFUTED` (cite what the code actually does) / `MOVED` (cite the new anchor) / `ALREADY-FIXED` (cite the commit). `REFUTED` and `ALREADY-FIXED` findings close with a rationale line and **no code change**. (`spec.md` §3 scope table) [3h] [evidence: independent read-only leaf at SHA dd07cb1f52 returned 9/9 CONFIRMED with per-ID anchors; recorded in implementation-summary.md Confirmed Inputs]
- [x] T002 [P] Capture the `runtime` baseline: `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`. Record discovered test count, pass/fail/skip, exit code, and the SHA. [1h] {deps: T001} [evidence: SHA dd07cb1f52; typecheck rc 0; suite run chunked (serial whole-run exceeds 100 minutes): unit 148 files, 3992 tests, 3986 pass, 6 fail (102 min); integration 83 tests, 1 fail; lifecycle 2/2; council 28/28; hierarchical-budgets 29/29. All failures pre-existing at baseline: the state-census disposition test (new landed spec rows) and the render/drift contract suites, which fail 8 tests against the pre-demotion rollout file and 5 after it — assigned to the silent-failure/harness-repair child, not fixed here]
- [x] T003 [P] Capture the alignment script baseline: `node --test .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/*.test.cjs`. This is the `F-ORC-01` RED anchor — record it, assign its failures to `031`, do not fix. Note the reported runner quirk: the bare-directory form fails on this Node, the file glob is required. [1h] {deps: T001} [evidence: 48 tests, 41 pass, 5 fail, 2 skip at SHA dd07cb1f52; failures assigned to 031, not fixed]
- [x] T004 [P] Capture the council baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs`. [1h] {deps: T001} [evidence: run from the config root: 106 tests, 105 pass, 1 fail at SHA dd07cb1f52; root-relative include patterns require cwd at the config dir]
- [x] T005 [P] Capture the improvement baseline: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`. [1h] {deps: T001} [evidence: run from the config root: 547 tests, 478 pass, 54 fail, 15 skip (17 of 48 files failing) at SHA dd07cb1f52]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Enumerate the reopen set [M2]

- [x] T006 Enumerate every completion item in the `013` program whose evidence cites a count or line anchor that does not reproduce against the T002-T005 baselines. [3h] {deps: T002, T003, T004, T005} [evidence: implementation-summary.md:48 records 123 reopened checklist lines across the four confirmed findings]
- [x] T007 Extend the set with parent rollups that would be left claiming Complete over a reopened child. [1h] {deps: T006} [evidence: implementation-summary.md What Was Built records the 013 root, three lane parents, reopened leaf summaries, and 015/016 dependency rollups]
- [x] T008 Freeze the reopen set and record it in `implementation-summary.md` before any edit. [1h] {deps: T007} [evidence: implementation-summary.md Metadata and What Was Built sections were written before checklist edits]

### Re-evidence or strike [M3]

- [x] T009 Re-evidence or strike the deep-review resume-adapter claims (`F-025-01`) (`013/002-deep-review/005-resume-adapter/checklist.md`) [2h] {deps: T008} [evidence: runtime/tests/unit/deep-review-resume-adapter.vitest.ts; suite sha256 1eec9d35355da517a42385a1960293567b16af19d7ce4e113e1c4bcc0ad33917; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; 12 tests passed]
- [x] T010 Re-evidence or strike the council resume-adapter 6/6 claim (`F-025-02`) (`013/003-deep-ai-council/005-resume-adapter/checklist.md`) [2h] {deps: T008} [evidence: runtime/tests/unit/deep-ai-council-resume-adapter.vitest.ts; suite sha256 33153e0912c98042fecd2b0f3cbcd120f3b4d489714dd29358b2d80efe1b69fb; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; 10 tests passed]
- [x] T011 Resolve the council shadow-parity checklist/summary contradiction (`F-025-03`, CONFIRMED) (`013/003-deep-ai-council/006-shadow-parity/{checklist.md,implementation-summary.md}`) [3h] {deps: T008} [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; 39 tests passed]
- [x] T012 Re-evidence or strike the deep-research certificate claims (`F-025-04`) (`013/001-deep-research/004-certificates-and-receipts/checklist.md`) [2h] {deps: T008} [evidence: runtime/tests/unit/deep-research-certificates.vitest.ts; suite sha256 288f03e29bbff2ca1f3dbf1c385106e84f7094d3b348265e3bda4ff879bdfb91; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; 36 tests passed]
- [x] T013 Convert every reinstated `[x]` to the test-name + suite-digest + candidate-SHA format [3h] {deps: T009, T010, T011, T012} [evidence: implementation-summary.md:77 records the ADR-001 citation format and the four rc 0 suite summaries]
- [x] T014 Reconcile `015` status honestly and record that it gates `016` (`F-029-02`, CONFIRMED) (`015-legacy-writer-retirement/{checklist.md,tasks.md,graph-metadata.json}`) [2h] {deps: T008} [evidence: 015 checklist.md, tasks.md, and graph-metadata.json state Planned/unstarted at 0/29; 016 prerequisite wording states unmet]
- [x] T015 Reconcile every parent rollup so no parent claims Complete over a reopened child [2h] {deps: T013, T014} [evidence: implementation-summary.md:57 records the 013 root and three lane parent status reconciliation]
- [x] T016 [P] Reopen the four promoted `fix` entries lacking their evidence mechanism (`F-035-01`) (`shared/rollout/command-injection-rollout.json`) [2h] {deps: T001} [evidence: four mode entries demoted pending their evidence mechanism; validate-rollout.cjs exit 1 on the pre-fix content and exit 0 on the repaired file; adversarially re-run]

### Repair the acceptance boundary [M4]

- [x] T017 Bound `goal-file-manifest.txt`: drop ignored and untracked entries, add the tracked frozen benchmark baseline (`F-029-01`) [2h] {deps: T013} [evidence: 2 ignored/untracked entries dropped, 33 tracked omissions added (1985 to 2016 entries); independent recount matches; check script reports all entries tracked]
- [x] T018 Add a manifest-vs-`git ls-files` check that fails closed when `git` is unavailable [2h] {deps: T017} [evidence: check-goal-file-manifest.sh; fails closed without git, verified by adversarial review of the code path]
- [x] T019 Capture a whole-repo recursive-validation baseline before touching `validate.sh` [1h] {deps: T001} [evidence: before/after recursive summaries recorded in implementation-summary.md M4 section; verbatim identical for undeclared parents]
- [x] T020 Add the hashed child-manifest boundary to recursive strict validation, opt-in per parent (`F-029-03`, CONFIRMED) (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`) [5h] {deps: T019} [evidence: opt-in declaration with sha256 hash verification; independent hash recomputation matches; undeclared-parent behavior byte-identical in control run; declared 036 set = on-disk children 001-021]
- [x] T021 Negative test: a child folder absent from the manifest must make the recursive gate FAIL, not widen or skip [2h] {deps: T020} [evidence: recursive-child-manifest.vitest.ts 2/2 pass under the canonical config; unlisted child yields status 2 naming the absent folder; independently re-run; note: the fail-closed test needs --testTimeout=60000 (runs ~23s), the default 5s config times out]
- [x] T022 Add the rollout `fix`-entry validator and update `promotion-rule.md` (`shared/rollout/`) [3h] {deps: T016} [evidence: validate-rollout.cjs with negative and positive verification plus 21 test assertions across the two rollout suites; promotion-rule.md states the evidence requirement]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Disposition, delta and gate [M5]

- [x] T023 Record the OD-1 `016` disposition (relocate or re-scope) in `PRE-014-VALIDATION-RUN.md` and in `decision-record.md` [2h] {deps: T017} [evidence: operator ruled re-scope; recorded as an Accepted decision in decision-record.md, the two-stage structure in the 016 spec, and the disposition line in the boundary notice]
- [x] T024 Record the `F-022-01` re-open trigger enforcement and cross-reference the WS1 disposition bucket [1h] {deps: T023} [evidence: enforcement statement in implementation-summary.md Phase 3; the parent-level disposition record and this child cross-reference each other]
- [x] T025 Re-run all four runners and the whole-repo recursive validation; report every result as a delta against T002-T005 and T019 [2h] {deps: T020, T022} [evidence: zero drift — alignment 48/41/5/2, council 106/105/1, improvement 547/478/54/15, all identical to baseline; runtime unit completed 3986/3992; recursive validation accepts the declared 32-entry manifest with the boundary negative test green]
- [x] T026 Independent adversarial verification pass by an actor other than the builder, targeted at the reopened evidence set [4h] {deps: T025} [evidence: independent verification pass by a second actor over the Phase-3 final state; 5-item spot-verify all exact (alignment counts, manifest 2016, negative test 2/2 with --testTimeout=60000, suite sha256 recomputed, 5-failure post-demotion split); verdict FIX-FIRST produced the closeout change-set this closeout executes]
- [x] T027 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile --strict` exits 0; reconcile completion metadata across spec/plan/tasks/implementation-summary [2h] {deps: T026} [evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <021> --strict --verbose` -> rc 0, `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`; spec.md/implementation-summary.md/plan.md/tasks.md/checklist.md/decision-record.md Status fields and continuity blocks reconciled to Complete/COMPLETE beforehand]

**Follow-up (CHK-112).** Re-verify the alignment RED anchor (`F-ORC-01`, 48 tests / 41 pass / 5 fail / 2 skip at SHA `dd07cb1f52`) when the `031-silent-failure-and-harness-repair` child lands: `031` Lane B is the child that triages these 5 failures, and its landing is the event that can legitimately change this count.
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
