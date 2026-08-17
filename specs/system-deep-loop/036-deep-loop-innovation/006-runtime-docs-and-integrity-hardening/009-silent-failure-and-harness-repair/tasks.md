---
title: "Tasks: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Task breakdown for 009-silent-failure-and-harness-repair: confirm-before-build pass over 23 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "silent failure harness repair"
  - "input validation exit code deep loop"
  - "aggregate suite double registration"
  - "manual playbook dead runtime path"
  - "deep loop 031 silent failure"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/009-silent-failure-and-harness-repair"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Landed 22/23 findings as 8fc33832c9+8b887bef5f+5611f21a15 (3 lanes)"
    next_safe_action: "Re-land skill-benchmark-resume-adapter timeout fix without the hang"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence

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
| M1 | T001-T004 | Baseline and sequencing recorded |
| M2 | T005-T009 | Lane A classified |
| M3 | T010-T012 | Lane B de-duplicated |
| M4 | T013-T019 | Lane C resolvable |
| M5 | T020-T022 | Delta reported and handed back |
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
A task marked `[B]` records its blocker inline and is not started until the blocker clears.
<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm, baseline and sequence [M1]

Lane B legitimately REDUCES the discovered test count. Capturing the baseline first is what lets that reduction be reported as the fix rather than discovered later as lost coverage.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 23 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. Treat `F-003-03` and `F-037-04` as one work unit. (`spec.md` §3 scope table) [5h]
- [ ] T002 Capture the discovered-test count baseline: `cd .opencode/skills/system-deep-loop/runtime && npm test`, recording per-file discovered counts so Lane B's reduction is attributable [2h] {deps: T001}
- [ ] T003 Record the `021` sequencing decision: digest-based citations, or a `021` re-reconcile after this child [1h] {deps: T002}
- [ ] T004 Enumerate consumers of the current exit codes before changing them [3h] {deps: T001}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: strict parse and classification [M2]

Representative tasks per mechanism rather than one per finding. Every Lane A finding maps to one of these five tasks; the confirm table in T001 records which.

- [ ] T005 Strict corruption handling: a malformed delta row fails rather than becoming a filtered null (`F-003-03`, `F-037-04` — one work unit) (`.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` after `026`) [8h] {deps: T004}
- [ ] T006 No completion record after a parse failure, and verification cannot be satisfied by a stale record (`F-037-02`, `F-037-03`) (`.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`, `.opencode/skills/system-deep-loop/commands/deep/assets/deep-review-auto.yaml`) [7h] {deps: T004}
- [ ] T007 Argument and flag validation returning `INPUT_VALIDATION` with a distinct exit code: `NaN` bounds, misspelled flags, valueless flags, unreadable event files, wrong merge mode (`F-032-01`, `F-032-03`, `F-032-04`, `F-032-05`) (`.opencode/skills/system-deep-loop/runtime/scripts/{query,reduce-state,upsert,fanout-merge}.cjs`) [10h] {deps: T004}
- [ ] T008 Schema failures surface as `INPUT_VALIDATION` rather than a generic script error (`F-032-02`) (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, after `028`) [4h] {deps: T007}
- [ ] T009 Replace closed-type casts with real validation for pivot events, persisted pivot config and the run cache pool item (`F-036-01`, `F-036-02`, `F-036-03`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`, `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts`) [8h] {deps: T004}

### Lane B: harness integrity [M3]

- [ ] T010 Stop double-registering independently discovered suites in the three rollback aggregates (`F-034-01`) (`.opencode/skills/system-deep-loop/runtime/tests/unit/{agent,model,skill}-*-rollback-gate.vitest.ts`) [6h] {deps: T002}
- [ ] T011 [P] Scope and reset the file-wide timeout override (`F-034-02`) (`.opencode/skills/system-deep-loop/runtime/tests/unit/{model,skill}-benchmark-resume-adapter.vitest.ts`) [3h] {deps: T002}
- [ ] T012 Make the shared spawn helper settle when a child ignores SIGTERM, and replace the cooperative fixture with one that exercises the failure (`F-034-03`) (`.opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts`) [6h] {deps: T002}

### Lane C: resolution repair [M4]

Representative tasks per resolution class. This lane also owns triage of the five pre-existing command-contract failures that `021` recorded as a RED baseline.

- [ ] T013 Reject absolute probe paths outside the repo in benchmark postconditions (`F-035-03`) (`.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs`) [4h] {deps: T001}
- [ ] T014 Fix the dead `cd` target in fourteen manual scenarios and verify every prescribed `cwd` and test path resolves (`F-030-02`) (`.opencode/skills/system-deep-loop/runtime/manual-testing-playbook/`) [6h] {deps: T001}
- [ ] T015 [P] Cover every shipped scenario directory in the readiness denominator, and reconcile the verdict vocabulary with the governing execution policy (`F-030-01`, `F-030-03`) (`.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md`) [5h] {deps: T001}
- [ ] T016 Make `render-contract-snapshot.cjs --check` accept its own generated output (`F-040-01`) (`.opencode/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs`) [4h] {deps: T001}
- [ ] T017 [P] Resolve fixture IDs across all ten benchmark profiles and scan the documented nested fixture corpus (`F-033-01`, `F-033-02`) (`.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`) [6h] {deps: T001}
- [ ] T018 [P] Point the command-surface benchmark contract at one live packet (`F-038-01`) (`.opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md`) [3h] {deps: T001}
- [ ] T019 Triage the five pre-existing command-contract failures `021` recorded as a RED baseline; record a disposition (fix, re-scope, or delete) with a rationale for each [8h] {deps: T001}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [ ] T020 Re-run every suite; report the discovered-count delta with Lane B's reduction explained as the fix and evidence that no unique test was removed [4h] {deps: T009, T012, T019}
- [ ] T021 Independent adversarial verification pass targeted at whether any invalid-input path still exits 0 [6h] {deps: T020}
- [ ] T022 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/009-silent-failure-and-harness-repair --strict` exits 0; hand the reconciled counts back to `021` [2h] {deps: T021}
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
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
