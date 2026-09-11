---
title: "Tasks: Phase 7: progress-updates"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: progress-updates

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

- [x] T001 Scaffold the phase child under parent 009 (`create.sh --phase --parent ... --phases 1`)
- [x] T002 Load the gate-mandated rules: `communication.md`, `prevent-overengineering.md`, `evidence-and-proof.md`
- [x] T003 [P] Read both precedents: `handoff-and-questions.md` and the phase 006 research
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run test one, always-loaded, against Gate 5's read-only exclusion (`AGENTS.md`:122)
- [x] T005 Run test two, scope boundary, against `REPO RULES.md` sections 4 In and Out
- [x] T006 Run test three, the four-part refusal test, with the existing-home inventory
- [x] T007 Run test four, restraint, naming the failure that happens today
- [x] T008 Check candidate trigger phrases against all ten rule files for collisions
- [x] T009 Write the verdict, its deciding test, and every cleared route (`research/research.md`)
- [x] T010 Draft the replacement `AGENTS.md` bullet without applying it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Resolve every citation in `research/research.md` against the file and line it names
- [x] T012 Confirm `repo-rules/`, `REPO RULES.md` and `AGENTS.md` are unchanged (`git status --short`)
- [x] T013 Repair the malformed phase-map row the scaffold wrote into the parent spec
- [x] T014 Run `validate.sh <folder> --strict` and read for an explicit `RESULT: PASSED`
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
- **Research**: See `research/research.md`
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code in this packet, so lint and format do not apply
- [x] CHK-011 [P0] `validate.sh --strict` reported no errors
- [x] CHK-012 [P1] Not applicable, no runtime path
- [x] CHK-013 [P1] Documents follow the phase-child template the scaffold emitted
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Citations resolved by hand against the files they name
- [x] CHK-022 [P1] The read-only-turn case and the non-interactive case are both reasoned about in spec.md
- [x] CHK-023 [P1] The stale-build failure mode was guarded by reading for `RESULT: PASSED`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not a bug fix. Rows are answered rather than dropped, because the proposal touches shared policy.

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`. The proposal touches the always-loaded document that every rule file sits under.
- [x] CHK-FIX-002 [P0] Same-class inventory done: all ten `repo-rules/` files read for an existing home.
- [x] CHK-FIX-003 [P0] Consumer inventory done: `REPO RULES.md` trigger table, index and scope section, plus `AGENTS.md` sections 3, 8 and 10.
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction surface is touched.
- [x] CHK-FIX-005 [P1] The axes are the four tests, and all four were answered rather than sampled.
- [x] CHK-FIX-006 [P1] No process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `file:line` in the working tree, with the measurement method stated.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, no credentials, no tokens in any authored file
- [x] CHK-031 [P0] Not applicable, no input surface
- [x] CHK-032 [P1] Not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the verdict and on what was not written
- [x] CHK-041 [P1] Not applicable, no code comments
- [x] CHK-042 [P2] No README applies to a spec phase child
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temporary files were written outside `scratch/`
- [x] CHK-051 [P1] `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---

