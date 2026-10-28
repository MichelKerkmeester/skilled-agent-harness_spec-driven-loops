---
title: "Tasks: Phase 3: Routing canon and tooling"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "routing canon and tooling tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: Routing canon and tooling

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked.
- [ ] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status.
- [ ] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the target shape into the templates.
- [ ] T005 Restructure one proof packet.
- [ ] T006 Run the three gates on it and record the output.
- [ ] T007 Change the tooling only where a gate rejects the shape, with a test for each change.
- [ ] T008 Record the decision on the no-match name and glossary location.
- [ ] T011 Make sk-create-skill produce the new shape by default (`.skilled/skills/sk-doc/sk-create-skill/assets/`, `sk-create-skill/references/`, `.skilled/commands/create/`). Verify: a skill scaffolded through `/create:skill` and one through `/create:skill-parent` pass `package_skill.py --strict` in the new shape.
- [ ] T012 Extend the existing creation check to reject the old shape: a SMART ROUTING section over the agreed length, a machine router block that is not the final appendix, a `ROUTER.md` inside a mode packet. Verify: the new test fails before the change and passes after it.
- [ ] T013 Run the extended check over the whole fleet. Verify: every existing skill in the old shape is listed as known debt for phases 005 to 009, and the CI run exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`.
- [ ] T010 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/research.md`
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
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed script passes its own tests
- [ ] CHK-011 [P0] Every gate in scope passes
- [ ] CHK-012 [P1] No operator-local surface is named in a tracked file
- [ ] CHK-013 [P1] Changes follow the phase 003 canon
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Gate output recorded before and after
- [ ] CHK-022 [P1] The largest file in scope was changed last
- [ ] CHK-023 [P1] A reverted change leaves the gates as they were
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in any changed file
- [ ] CHK-031 [P1] N/A unless a script changes: input handling is tested
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree
- [ ] CHK-041 [P2] Changelog and version bumped for each changed skill
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not started
<!-- /ANCHOR:summary -->
