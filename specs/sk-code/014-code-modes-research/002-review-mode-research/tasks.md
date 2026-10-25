---
title: "Tasks: Phase 2: review-mode-research"
description: "Setup, ten research iterations, one synthesis and verification for the sk-code-review research phase. Every task is open."
trigger_phrases:
  - "review mode research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: review-mode-research

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

- [ ] T001 Confirm the executor alternation unit with the operator (`../spec.md`, open question 1)
- [ ] T002 Read the cli-codex `SKILL.md`, then probe Luna max fast via cli-codex with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`)
- [ ] T003 [P] Read the cli-pi `SKILL.md`, then probe DeepSeek flash max 1017 via cli-pi through llmgateway with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`)
- [ ] T004 Write the current HEAD sha into the Baseline row of the parent goal log so the boundary check has a baseline (`../goal.md`)
- [ ] T005 Compose the brief: the reading list from `plan.md`, the three evidence labels, the source-tag format and the four `research.md` section names (`plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Iteration 1 on Luna: repo-bound inventory (`research/iterations/iteration-001.md`)
- [ ] T007 Iteration 2 on DeepSeek: the UNKNOWN-surface path (`research/iterations/iteration-002.md`)
- [ ] T008 Iteration 3 on Luna: the output contract (`research/iterations/iteration-003.md`)
- [ ] T009 Iteration 4 on DeepSeek: usefulness evidence (`research/iterations/iteration-004.md`)
- [ ] T010 Iteration 5 on Luna: PR-state efficiency gates (`research/iterations/iteration-005.md`)
- [ ] T011 Iteration 6 on DeepSeek: review and quality boundary (`research/iterations/iteration-006.md`)
- [ ] T012 Iteration 7 on Luna: surface packets (`research/iterations/iteration-007.md`)
- [ ] T013 Iteration 8 on DeepSeek: consumers and contracts (`research/iterations/iteration-008.md`)
- [ ] T014 Iteration 9 on Luna: user-authored modes (`research/iterations/iteration-009.md`)
- [ ] T015 Iteration 10 on DeepSeek: repo-local policy and floors (`research/iterations/iteration-010.md`)
- [ ] T016 Run the synthesis and write the four sections plus the ranked list (`research/research.md`)
- [ ] T017 Check the synthesis for all four section names and at least eight ranked rows (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run each command check in the acceptance criteria and record its output in the Verification cell (`acceptance-criteria.md`)
- [ ] T019 Open three source tags by hand and confirm each resolves to the quoted text (`research/research.md`)
- [ ] T020 Run `validate.sh` on this phase with `--strict` and read the `RESULT:` line (`specs/sk-code/014-code-modes-research/002-review-mode-research`)
- [ ] T021 Confirm `git diff --stat` from the recorded HEAD prints no path under `.skilled/`
- [ ] T022 Fill the implementation summary and update the parent Phase Documentation Map status (`implementation-summary.md`, `../spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion reads Met with its command output recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] The ten angles and the launch command defined in plan.md
- [ ] CHK-003 [P1] Both executors probed and the alternation unit confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every finding carries OBSERVED, DERIVED or INFERRED
- [ ] CHK-011 [P0] Every repository claim has a source tag with a path and line
- [ ] CHK-012 [P1] Each recommendation names the non-framework repository case it serves
- [ ] CHK-013 [P1] No recommendation relaxes the security and correctness minimums, the three-value final status line or the cache-only Write scope
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Ten iteration files and ten state records exist
- [ ] CHK-022 [P1] Three source tags opened by hand resolve to the quoted text
- [ ] CHK-023 [P1] Any conflict between the two executors is named in the synthesis
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each ranked row is marked ready now or needs a decision.
- [ ] CHK-FIX-002 [P0] Each recommendation lists the hub files it would touch, so a later packet can inventory producers and consumers.
- [ ] CHK-FIX-003 [P1] Each recommendation that changes routing names both stages it must reach: `hub-router.json` and `ROUTER.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or token text is copied into any research file
- [ ] CHK-031 [P0] No file outside `research/` is written by the run
- [ ] CHK-032 [P1] No path under `.skilled/` is changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the ten angles and the executor plan
- [ ] CHK-041 [P1] The parent Phase Documentation Map status matches this phase
- [ ] CHK-042 [P2] The close-out names the top three recommendations for the operator
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---

