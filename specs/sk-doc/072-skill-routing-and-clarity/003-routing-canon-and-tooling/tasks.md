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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: research §5, §6 and §7 findings re-read; package_skill section order (open question 1) answered by the proof.
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/baseline.md` and `scratch/before.md`.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: the orchestrator detailed the work into `scratch/routing-shape-contract.md` and one brief per file set instead of a separate `/speckit:plan` run.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the target shape into the templates. Evidence: scaffolds, `skill-md-template.md`, `skill-smart-router.md`, `parent-skill-hub-template.md`.
- [x] T005 Restructure one proof packet. Evidence: `.skilled/skills/sk-code/sk-code-ci/SKILL.md`.
- [x] T006 Run the three gates on it and record the output. Evidence: `scratch/after.md` §3 AC-001.
- [x] T007 Change the tooling only where a gate rejects the shape, with a test for each change. Evidence: package_skill marker check widened to the appendix, with `test_routing_shape.py`; verify-router-sync and router-replay-lib needed no change.
- [x] T008 Record the decision on the no-match name and glossary location. Evidence: `implementation-summary.md` Key Decisions.
- [x] T011 Make sk-create-skill produce the new shape by default (`.skilled/skills/sk-doc/sk-create-skill/assets/`, `sk-create-skill/references/`, `.skilled/commands/create/`). Verify: a skill scaffolded through `/create:skill` and one through `/create:skill-parent` pass `package_skill.py --strict` in the new shape. Evidence: `scratch/after.md` §3 AC-004.
- [x] T012 Extend the existing creation check to reject the old shape: a SMART ROUTING section over the agreed length, a machine router block that is not the final appendix, a `ROUTER.md` inside a mode packet. Verify: the new test fails before the change and passes after it. Evidence: `scratch/after.md` §3 AC-002, AC-006, AC-007.
- [x] T013 Run the extended check over the whole fleet. Verify: every existing skill in the old shape is listed as known debt for phases 005 to 009, and the CI run exits 0. Evidence: `scratch/after.md` §3 AC-005.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1 and §2.
- [x] T010 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh --recursive --strict` RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md (evidence: spec.md §4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (evidence: plan.md §4)
- [x] CHK-003 [P1] Dependencies identified and available (evidence: phase 002 baseline)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests (evidence: pytest 256, psc 113, csk 71)
- [x] CHK-011 [P0] Every gate in scope passes (evidence: scratch/after.md §1)
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file (evidence: debt ledger and diffs grep clean of private names)
- [x] CHK-013 [P1] Changes follow the phase 003 canon (evidence: scratch/routing-shape-contract.md)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (evidence: acceptance-criteria.md, all Met)
- [x] CHK-021 [P0] Gate output recorded before and after (evidence: scratch/before.md, scratch/after.md)
- [x] CHK-022 [P1] The largest file in scope was changed last (evidence: skill-md-template.md was the last template edited)
- [x] CHK-023 [P1] A reverted change leaves the gates as they were (evidence: fail-before runs against HEAD copies, scratch/after.md §3)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file (evidence: no secrets in the diff)
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested (evidence: test_routing_shape.py and the psc test cover malformed and missing ledgers)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree (evidence: implementation-summary.md)
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill (evidence: sk-create-skill v1.6.0.0, sk-code-ci v1.1.10.0)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (evidence: scratch/ only)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
