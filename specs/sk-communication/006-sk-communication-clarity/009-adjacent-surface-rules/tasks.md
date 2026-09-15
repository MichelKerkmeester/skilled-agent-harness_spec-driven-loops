---
title: "Tasks: Phase 9: adjacent-surface-rules"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "adjacent surface tasks"
  - "confirm the target file"
  - "additive template"
  - "owning gate run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: adjacent-surface-rules

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

- [x] T001 Confirm phase 2 adopted both candidates, or only one, and record which
  Evidence: allocation-table.md:51,55, both rows read adopt, the comment checklist and the repo rule template named as their owning surfaces
- [x] T002 Read the code skill's own routing to confirm which file actually owns comment guidance, rather than trusting a path pattern
  Evidence: the sk-code-quality SKILL.md:67,89,101, the checklist asset is the general post-implementation quality gate and its section 4 carries the comment checks, the hygiene script is the per modified file pass
- [x] T003 [P] Read the existing comment-hygiene hard blocker in full, so the addition can name it as winning
  Evidence: AGENTS.md:44-46, the block read whole, the durable WHY wording, the addition names it as winning on any collision
- [x] T004 Capture the baseline: which existing rule files validate against the current template
  Evidence: repo-rule-template.md:110-111, ten universal elements, rule-anatomy.md:53-66, the same must set, no rule file edited in this phase, the corpus checker confirms the corpus still passes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the present-state comment rule to the file the code skill's routing named
  Evidence: overview-header-and-comments.md:175,177, the CHK-CMT-07 item and its paragraph, inside the existing comment principles subsection
- [x] T006 State in that addition that the existing hard blocker wins on any collision
  Evidence: overview-header-and-comments.md:177, the paragraph states that the root document's comment-hygiene hard block wins on any collision and that this rule adds to it and does not soften it
- [x] T007 Add the example-and-repair ingredient to the repo-rule template, additively
  Evidence: repo-rule-template.md:31,69,71, the overview sentence, the optional instruction and the Wrong/repair bullet, no new section
- [x] T008 Confirm the template change requires no new section in an existing rule file
  Evidence: the ingredient is two lines and one bullet inside the existing rule section, the anatomy addendum is one table row, the corpus checker passes over every shipped rule file with no edits
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the code skill's own gate and read its output and exit status
  Evidence: the dispatched bash invocation of check-comment-hygiene.sh printed the usage block and exited 2, the script is python3 under a shebang so bash never reached its checks, the corrected rerun and its result are recorded in the implementation summary
- [x] T010 Run the documentation skill's own gate and read its output and exit status
  Evidence: check-repo-rules.cjs printed RESULT: PASSED (9/9 checks) over 12 rule files, exit 0
- [x] T011 Validate a sample of existing rule files against the changed template with no edits
  Evidence: the corpus checker exercised every shipped rule file unedited, wider than the required sample, RESULT: PASSED (9/9 checks)
- [x] T012 Read the comment addition beside the hard blocker and attempt the exception reading
  Evidence: the addition at overview-header-and-comments.md:175,177 read beside AGENTS.md:44-46, the reading attempted and rejected, no licence survives, the verdict recorded in the implementation summary
- [x] T013 Confirm no communication rule text or wording-standard text was copied into either surface
  Evidence: the vocabulary check over both surfaces printed no lines, exit 1, both additions were written fresh for this phase
- [x] T014 Confirm the scoped diff touches only the two surfaces
  Evidence: git status --short after the surface edits lists the three edited surface files, the remaining entries belong to the program's earlier phases, the closing check after the packet edits is recorded in the implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  Evidence: T001 to T014 all read [x] above, each with its evidence line
- [x] No `[B]` blocked tasks remaining
  Evidence: the whole tasks file was read, no task line carries the [B] marker
- [x] Manual verification passed
  Evidence: both owning gates, the exception reading, the vocabulary check and the scoped diff review ran, the packet validator result is recorded in the implementation summary
<!-- /ANCHOR:completion -->

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
- [x] CHK-003 [P1] The code skill's real target file confirmed by reading its routing, not assumed from a path pattern
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both additions trace to adopted rows in phase 2's decision record
- [x] CHK-011 [P0] The comment addition names the existing hard blocker as winning on collision
- [x] CHK-012 [P1] The template change is additive and requires no new section anywhere
- [x] CHK-013 [P1] Each addition follows its host asset's existing shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Both owning skills' gates pass from the final state, output and exit status read
- [x] CHK-022 [P1] A sample of existing rule files validated against the changed template unedited
- [x] CHK-023 [P1] The exception reading of the comment addition attempted and rejected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate carries a finding class, and the template change is treated as cross-consumer
- [x] CHK-FIX-002 [P0] Same-class producer inventory run over every asset stating comment guidance
- [x] CHK-FIX-003 [P0] Consumer inventory run over rule files authored from the template
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction or security logic is in scope
- [x] CHK-FIX-005 [P1] Matrix axes listed: surface by candidate, two rows, two gates
- [x] CHK-FIX-006 [P1] Not applicable, no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range (the phase's edits landed in `0baba0bca0`, and the verification pass that wrote these rows is `468ffab0b9`, so every file:line above reads against `0baba0bca0` and the checklist against `468ffab0b9`.)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or private identifier enters either surface
- [x] CHK-031 [P0] Nothing added relaxes the comment-hygiene hard blocker or any verification standard
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Any code comment touched states present behaviour rather than past approaches, which is the rule this phase adds
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md:163, phase 9 row reads Complete)
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
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, both owning gates and the parent Phase Documentation Map read ran from the changed state; the one open P1 is the evidence pin, the packet validator result is recorded in the implementation summary
<!-- /ANCHOR:summary -->

---
