---
title: "Tasks: Phase 4: migration-design"
description: "Ordered tasks for phase 004, each naming its executor, from reading the phase 003 probe records to a resolved, reviewed and validated design."
trigger_phrases:
  - "skilled design tasks"
  - "migration design checklist"
  - "design review adjudication tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: migration-design

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Read the phase 003 probe records and map each verdict to P1 to P9, citing the record path, or record why a probe did not run. Executor: orchestrator on Opus (`plan.md` decision tree)
- [ ] T002 Run evidence unit E1, the hook lines that name `.opencode`, from its brief in `scratch/briefs/e1-hook-opencode-lines.md`. Executor: DeepSeek V4.1 Flash max on cli-pi (`evidence/hook-opencode-lines.md`)
- [ ] T003 Run evidence unit E2, the workflow root surface, from `scratch/briefs/e2-ci-workflow-root-surface.md`. Executor: DeepSeek V4.1 Flash max on cli-pi (`evidence/ci-workflow-root-surface.md`)
- [ ] T004 Run evidence unit E3, the `.gitignore` lines, from `scratch/briefs/e3-gitignore-root-rules.md`. Executor: DeepSeek V4.1 Flash max on cli-pi (`evidence/gitignore-root-rules.md`)
- [ ] T005 Run evidence unit E4, the hand-made link targets, from `scratch/briefs/e4-hand-made-link-targets.md`. Executor: DeepSeek V4.1 Flash max on cli-pi (`evidence/hand-made-link-targets.md`)
- [ ] T006 Verify E1 to E4 against the direct counts in `plan.md` delegation, open three rows of each by line, and log the result. Executor: orchestrator on Opus (`goal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Resolve ADR-001 through the decision tree to L1, L2 or a named stop. On a stop, escalate under parent D2 and mark every later task `[B]`. Executor: orchestrator on Opus (`decision-record.md`)
- [ ] T008 Keep the `<L1>` or the `<L2>` line of step 11 and delete the other, then fix the P5 and P6 branches in steps 20 and 24. Executor: orchestrator on Opus (`plan.md`)
- [ ] T009 Complete the ADR-003 keep-list for the chosen layout, with a file:line for each kept reference. Executor: orchestrator on Opus (`decision-record.md`)
- [ ] T010 Write the review brief: the resolved ADRs, the 25 steps, the affected surfaces, the probe verdicts and the five questions. Executor: orchestrator on Opus (`review/design-review-brief.md`)
- [ ] T011 Dispatch the read-only review with the command in `plan.md` review plan, then kill the dispatch by its captured PID. Executor: GPT-5.6 sol xhigh on cli-codex (`review/gpt-5-6-sol-design-review.md`)
- [ ] T012 Rule on every finding: accept and amend, reject with evidence, or defer to a named task in a later phase. Executor: orchestrator on Opus (`decision-record.md`)
- [ ] T013 Apply the accepted amendments, then set ADR-001 to ADR-003 to Accepted. Executor: orchestrator on Opus (`plan.md`, `decision-record.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Confirm every surface class maps to one step and every blocker B1 to B6 to a resolution. Executor: orchestrator on Opus (`plan.md`)
- [ ] T015 Confirm `grep -c '\*\*Check\*\*' plan.md` and `grep -c '\*\*Rollback\*\*' plan.md` each print 25, and that step 24 names the point of no return. Executor: orchestrator on Opus (`plan.md`)
- [ ] T016 Run `python3 .opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since 728c4f3efc` and confirm no offender under this folder. Executor: orchestrator on Opus
- [ ] T017 Run `validate.sh --strict` on this folder from the main checkout and read `RESULT: PASSED` in the output. Executor: orchestrator on Opus
- [ ] T018 Mark each acceptance criterion with the evidence actually observed. Executor: orchestrator on Opus (`acceptance-criteria.md`)
- [ ] T019 Update the phase map row for 004 and the parent goal log. Executor: orchestrator on Opus (`../spec.md`, `../goal.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] ADR-001 to ADR-003 Accepted, and `validate.sh --strict` printed `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 to REQ-009 documented in spec.md
- [ ] CHK-002 [P0] Layout options, decision tree and the 25-step cutover defined in plan.md
- [ ] CHK-003 [P1] Phase 003 records exist for probes P1, P2 and P3
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every shell command in the cutover sequence parses when extracted and run through `bash -n`
- [ ] CHK-011 [P0] Ten sampled file:line citations in this folder open to the text they claim
- [ ] CHK-012 [P1] Every placeholder in a command, such as `<step-10 commit>`, names the step that records its value
- [ ] CHK-013 [P1] Every output path in this folder is lowercase kebab-case
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Evidence units E1 to E4 verified against their direct counts
- [ ] CHK-022 [P1] Each branch of the decision tree walked to a layout or a named stop: P1 and P3 pass, P2 and P3 pass, P1 and P2 fail, P3 fails
- [ ] CHK-023 [P1] Each rollback line restores ignored state, hook links and home configs where its step touched them
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each blocker B1 to B6 and each risk R-001 to R-014 carries a class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done for literal `.opencode` paths: E1 covers the hooks, E2 the workflows and E3 `.gitignore`.
- [ ] CHK-FIX-003 [P0] Consumer inventory done: maps A to C, the ten consumer links and the seven global hooks.
- [ ] CHK-FIX-004 [P0] Step 6 lists its path-resolution cases: a nested `.opencode/` under a wrong root, a consumer link chained through `Public/.opencode`, a start path under each root, and a walker that meets a link as a child entry.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed: two layouts by four checkout kinds, eight rows in step 22's proof.
- [ ] CHK-FIX-006 [P1] Hostile environment variant covered: a launch-wrapper session exporting `SPECKIT_AUTOSYNC=1`, handled by step 1.
- [ ] CHK-FIX-007 [P1] Evidence pinned to `728c4f3efc` or to the SHA each executing phase records, not to a moving branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret from a home config is printed, copied or cited in this folder
- [ ] CHK-031 [P0] The review runs with `--sandbox read-only`, and the evidence units with `--tools read,grep,find,ls`
- [ ] CHK-032 [P1] No dispatch uses `--sandbox danger-full-access` or a blanket `pkill`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md, tasks.md and decision-record.md agree on step numbers and ADR statuses
- [ ] CHK-041 [P1] Every UNKNOWN names what would settle it
- [ ] CHK-042 [P2] The parent phase map row for 004 reflects this phase's status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Briefs live in `scratch/briefs/`, evidence tables in `evidence/`, review files in `review/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion, with every cited table kept under `evidence/` or `review/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md as ADR-001 to ADR-003
- [ ] CHK-101 [P1] All ADRs carry a status: Proposed until phase 003 lands, Accepted after adjudication
- [ ] CHK-102 [P1] Layouts L1 to L4 documented with scores and rejection rationale
- [ ] CHK-103 [P2] Migration path documented as the 25-step cutover
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01's drift check is present in step 19
- [ ] CHK-111 [P1] The held window from step 9 to step 19 is planned as one continuous session
- [ ] CHK-112 [P2] Duration of the rehearsed rename commit and its rename check recorded from probe P6
- [ ] CHK-113 [P2] Duration of step 22's full re-run estimated for phase 010 planning
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] A rollback is written for every step, and step 24 is named the point of no return
- [ ] CHK-121 [P0] The autosync guard in step 1 applies to every executing session
- [ ] CHK-122 [P1] Step 3's independent check is specified to fail on a deliberately broken clone
- [ ] CHK-123 [P1] Steps 9 to 25 reviewed against `.opencode/skills/sk-git/references/large-reorg-playbook.md:50-158`
- [ ] CHK-124 [P2] The GPT-5.6 review adjudicated before phase 005 starts
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Parent decisions D1 to D5 honored, checked row by row against `../goal.md:46-50`
- [ ] CHK-131 [P1] The 968 frozen map C rows are excluded from every rewrite step
- [ ] CHK-132 [P2] Steps 10 and 11 carry no content edit
- [ ] CHK-133 [P2] The consumer contract in `PUBLIC-RELEASE.md:10-36` stays true under the chosen layout
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] The ADR-003 keep-list matches the exclusions of step 17's rescan
- [ ] CHK-142 [P2] The review record is kept under `review/`
- [ ] CHK-143 [P2] The handoff to phase 005 is written in the goal log
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Orchestrator on Opus | Design author and adjudicator | [ ] Approved | |
| GPT-5.6 sol on cli-codex | Second-family reviewer | [ ] Reviewed | |
| Operator | Holder of the parent directive | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

