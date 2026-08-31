---
title: "Tasks: Phase 3: Disposition and Rule-Set Gap Research"
description: "Ordered tasks for the five-iteration research loop: read the executor contract, bind write authority and the max-iterations stop policy, run one research question per iteration across coverage, direction of travel, the governor disposition, inventory and a critique of the new delegation rule, then assert iteration count, citations and containment."
trigger_phrases:
  - "deep research tasks"
  - "iteration binding"
  - "citation audit"
  - "write containment check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: Disposition and Rule-Set Gap Research

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the executor's `SKILL.md` under `.opencode/skills/cli-external-orchestration/` before composing any prompt - a dispatch composed without it is the failure this repository has already paid for
- [x] T002 Confirm the executor binary is present and authenticated; record the version
- [x] T003 Confirm the DeepSeek V4 Flash max-thinking uid is in the curated roster, rather than assuming the tier from the family name
- [x] T004 Record the pre-run working-tree state so containment is provable afterwards
- [x] T005 Write `research/deep-research-strategy.md`: the five research questions, per-iteration focus, and the corpus each iteration reads
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Bind the run: this phase folder as write authority, five iterations, max-iterations stop policy so convergence cannot shorten the run
- [x] T007 Launch the loop through the deep-research command contract - do not hand-roll the loop
- [x] T008 Iteration 1: RQ1 coverage - map every thinking-and-acting row in `AGENTS.md` to the rule file that expands it, and list the rows with no expansion
- [x] T009 Iteration 2: RQ2 direction of travel - which rows should move down, which must stay because they are hard blockers or gates
- [x] T010 Iteration 3: RQ3 the governor disposition - read commit `4477a9f1` and its packet, separate container from content, and reach a verdict
- [x] T011 Iteration 4: RQ4 inventory - warranted additions, and the plausible-sounding rules that are not warranted
- [x] T012 Iteration 5: RQ5 critique the phase-2 delegation rule, then synthesize the ranked recommendation list
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Assert exactly five iteration records in `research/deep-research-state.jsonl`, each carrying the route-proof fields
- [x] T014 Assert the recorded executor configuration names DeepSeek V4 Flash at the maximum thinking tier
- [x] T015 Citation audit: resolve every finding's citation to a real file, line, or commit; anything unresolvable becomes UNKNOWN
- [x] T016 Containment check: `git status` shows no change under `repo-rules/`, `REPO RULES.md`, or `AGENTS.md`
- [x] T017 Coverage check: RQ1 through RQ5 each have an explicit answer, including any "no change warranted"
- [x] T018 Confirm at least one subtraction candidate exists, or that the research states plainly that it found none
- [x] T019 Confirm every recommendation names a target file and the failure it prevents
- [x] T020 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Ranked recommendation list present and decidable without the transcripts
- [x] `scratch/` cleaned of anything that is not an intentional working file
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **Consumer**: `../004-research-adoption/` reads the ranked list
- **Governor evidence**: commit `4477a9f1` and `specs/hooks/007-fable-governor-pi-hook/`
- **Prior bloat measurement**: `../../004-agents-md-bloat-audit/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] Executor skill document read before any prompt is composed
- [x] CHK-004 [P1] Write authority bound to this phase folder before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The loop runs through its command contract; no hand-rolled substitute
- [x] CHK-011 [P0] Convergence is telemetry, not a stop - the depth the operator asked for is delivered
- [x] CHK-012 [P1] Working files stay in `scratch/`; only `research/` artifacts are durable
- [x] CHK-013 [P1] Any deviation from the named workflow is stated and approved, never silently substituted
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Iteration count read from the state log, not from the run's own summary
- [x] CHK-022 [P1] Every RQ covered by at least one citation outside the current documents
- [x] CHK-023 [P1] Contradictions between iterations recorded as findings rather than silently reconciled
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase produces findings, and a finding is a hypothesis until phase 4 tests it. The rows below hold that line.

- [x] CHK-FIX-001 [P0] Every recommendation is classed: `class-of-bug` (a gap in the rule set) or `instance-only` (one document's wording)
- [x] CHK-FIX-002 [P0] Producer inventory run for the governor directive's real text before RQ3 reasons about it
- [x] CHK-FIX-003 [P0] Consumer inventory not applicable - this phase changes nothing; recorded rather than skipped
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser, or redaction surface
- [x] CHK-FIX-005 [P1] Matrix axes listed: 5 RQs x 3 evidence classes
- [x] CHK-FIX-006 [P1] The dispatched child's environment is recorded, since this repository has seen lineages stall on inherited environment state
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credentials or account identifiers written into research artifacts
- [x] CHK-031 [P0] Dispatched prompts carry no secret material from the environment
- [x] CHK-032 [P1] The dispatched child's write authority is bound before launch, not corrected afterwards
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] `research/deep-research-strategy.md` records the questions actually asked, updated if they changed mid-run
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated from Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



