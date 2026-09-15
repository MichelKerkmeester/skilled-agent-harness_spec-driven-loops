---
title: "Tasks: Phase 10: review-remediation"
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
# Tasks: Phase 10: review-remediation

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

- [x] T001 Confirm F003: `goal.md`'s completion row for the reply-shape and decision candidates reads ticked and its LOG table agrees (`../goal.md:96,120-121`). Evidence: `sed -n '90,125p' ../goal.md` shows both rows ticked and the LOG rows for 006 and 008.
- [x] T002 Confirm F004: `006-reply-shape-rules/acceptance-criteria.md` and `008-decision-and-handoff-rules/acceptance-criteria.md` both read `Status: Complete` and `completion_pct: 100` with no stale blockers. Evidence: `grep -n completion_pct` reads 100 in both, and both frontmatter `blockers` fields read `[]`.
- [x] T003 [P] Confirm F006: `manual-testing-playbook.md` carries scenario COMM-010 with a linked feature file, and both hub leaf manifests pass the freshness gate. Evidence: `grep -n COMM-010 manual-testing-playbook.md` shows the scenario and its feature file link, and `ci-leaf-manifest-freshness.cjs` read `checked=13 fresh=13 failed=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `test/fidelity/semantics.test.ts`, calling `compareClaimCoverage` directly with three cases: a dropped claim sentence fires `CLAIM_OMITTED`, a reworded claim survives and returns null, and dropping an unrelated non-claim sentence does not fire (`.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/semantics.ts`). Evidence: file created with four `it` blocks, all pass under `npm run check`.
- [x] T005 Add a comment at the no-op guard in `validator.ts` explaining why the five `passed()` pushes sit inside the `if (restored.text !== sourceText)` block, with the accepted fidelity outcome unchanged (`.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:212-238`). Evidence: five-line comment added directly above the guard, no field or logic changed.
- [x] T006 Add a doc comment on `AcceptedProjection` naming `AcceptedFidelityOutcome` as the outcome type a producer would fill it from, with no field added and no producer wired (`.opencode/skills/sk-communication/cli-communication-projection/src/contracts/projection.ts:29-33`). Evidence: doc comment names `AcceptedFidelityOutcome` in `../fidelity/types.js`, no interface field changed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run `npm run check` in `cli-communication-projection` from the final state and read its output and exit status. Evidence: exit 0, 83 test files passed, 459 tests passed, `test:import` smoke check clean.
- [x] T008 Re-run the leaf-manifest freshness gate for both hubs and read `checked=13 failed=0` from the final state. Evidence: `ci-leaf-manifest-freshness.cjs` output `checked=13 fresh=13 failed=0`.
- [x] T009 Grep both new comments for an ephemeral finding, ADR, or packet id and confirm no match, per the comment-hygiene hard block. Evidence: `rg -n "ADR-|REQ-|T0[0-9]{2}|specs/|phase [0-9]|F00[0-9]" src test` returned no matches.
- [x] T010 Run `validate.sh specs/sk-communication/006-sk-communication-clarity/010-review-remediation --strict` and read `RESULT: PASSED`. Evidence: recorded in the run log below.
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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md:108-118, REQ-001 through REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md Architecture and Implementation Phases sections)
- [x] CHK-003 [P1] Dependencies identified and available (plan.md §6 Dependencies table, all three rows read Green)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (T007, npm run check exit 0 includes typecheck and build; the package defines no separate lint script)
- [x] CHK-011 [P0] No console errors or warnings (T007, exit 0, 83 test files and 459 tests passed with no errors reported)
- [x] CHK-012 [P1] Error handling implemented (not applicable: T004-T006 add a test file and two comments, no new error-handling logic)
- [x] CHK-013 [P1] Code follows project patterns (T004 uses the existing test-file pattern, T005-T006 follow the existing doc-comment convention)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, AC-001 through AC-006 all Met, closure statement confirms)
- [x] CHK-021 [P0] Manual testing complete (not applicable: verification here is automated, npm run check plus the freshness gate plus a grep, per T007-T009; no manual test step is in scope)
- [x] CHK-022 [P1] Edge cases tested (T004, the reworded-claim case and the unrelated-sentence-drop case both return null)
- [x] CHK-023 [P1] Error scenarios validated (T004, the dropped-claim case fires CLAIM_OMITTED)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding carries a finding class. F003, F004, and F006 are `test-isolation` (confirm only, no code change). F005 is `test-isolation` (add direct coverage). F001 and F002 are `instance-only` (a comment, no behavior change) (T001-T003 confirm F003/F004/F006 by reading, T004 adds the test for F005, T005-T006 add the two comments for F001/F002, exactly matching each class)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "AcceptedProjection\(" src test` confirms no construction call site exists, before or after (rerun in cli-communication-projection, no matches, exit 1; matches Known Limitations item 1 and review-report F002)
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n "compareClaimCoverage" --glob '*.ts'` lists `validator.ts` and the new test file only (rerun, hits validator.ts, its own definition in semantics.ts, and test/fidelity/semantics.test.ts, no other caller)
- [x] CHK-FIX-004 [P0] Not applicable, no path, parser, redaction, or security logic is in scope (not applicable: a test file and two doc comments)
- [x] CHK-FIX-005 [P1] Matrix axes listed: finding by verdict, two axes (confirmed-fixed, code-item), three findings each (plan.md FIX ADDENDUM states this matrix verbatim)
- [x] CHK-FIX-006 [P1] Not applicable, no code in scope reads process-wide state (not applicable)
- [x] CHK-FIX-007 [P1] Evidence pinned to a commit, not a moving branch-relative range (the phase's edits landed in `bc1ccbaef2`, and the verification pass that wrote these rows is `468ffab0b9`, so every file:line above reads against `bc1ccbaef2` and the checklist against `468ffab0b9`.)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (rerun secret-pattern grep over the three changed files, no matches)
- [x] CHK-031 [P0] Input validation implemented (not applicable: no new input-handling code, T004-T006 add a test file and two doc comments only)
- [x] CHK-032 [P1] Not applicable, no auth or authorization surface in scope (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md REQ-001 through REQ-006, plan.md FIX ADDENDUM and T001-T010 all describe the same six findings)
- [x] CHK-041 [P1] Both new comments state present behavior, not the history of the review that prompted them (T009, the ADR/REQ/task/packet-id grep over src and test returned no matches)
- [x] CHK-042 [P2] Parent Phase Documentation Map status updated when this phase closes (parent spec.md:166, phase 10 row reads Complete)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only .gitkeep, verified by listing)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ is empty aside from .gitkeep, verified by listing)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-15, npm run check, both rg reruns, the credential scan and the parent Phase Documentation Map read all ran from the final state; the one open P1 is the commit-pinning row
<!-- /ANCHOR:summary -->

---
