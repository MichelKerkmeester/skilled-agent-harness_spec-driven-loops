---
title: "Tasks: Phase 3: chart-research-cleanup"
description: "Ordered tasks that state each chart rule on its own, remove every research citation, sweep the design modes and prove the result with the document and packet validators."
trigger_phrases:
  - "chart research cleanup tasks"
  - "chart citation removal tasks"
  - "sk-design-chart cleanup checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: chart-research-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `C` is `.skilled/skills/sk-design/sk-design-chart`, `R` is `$C/references`, `O` is `$C/assets/style-reference/evilcharts/origin.md`, `P` is `specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Read the four chart files and record every citation and phase reference (`$R/color-system.md`, `$R/catalog.md`, `$R/template-contract.md` and `$O`). Verify: the Measured Behavior block in `spec.md` names all four files and every reference kind found.
- [x] T002 Record the rule that each citation backed, so no deletion takes a rule with it (`$R` and `$O`). Verify: every removed pointer is paired with a rule that stays, as the changelog entry states.
- [x] T003 Confirm the four files are the chart references the mode loads (`$C/SKILL.md` and `$R/README.md`). Verify: `ls $R/color-system.md $R/catalog.md $R/template-contract.md $O` lists all four.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 State the role split and the categorical gates on their own, with their measured hue and contrast figures (`$R/color-system.md`). Verify: `validate_document.py` reports VALID 0 issues.
- [x] T005 State the radar and pie decision and the palette rules on their own (`$R/catalog.md`). Verify: `validate_document.py` reports VALID 0 issues.
- [x] T006 State the template rules and the type scale on their own (`$R/template-contract.md`). Verify: `validate_document.py` reports VALID 0 issues.
- [x] T007 State the evilcharts provenance from the measured source file, with no research pointer (`$O`). Verify: `validate_document.py` reports VALID 0 issues.
- [x] T008 Remove every `[SOURCE: specs/...]` citation, "Phase 13", "this phase", "from the research" and "another packet's research context" from the four files (`$R` and `$O`). Verify: `rg -n 'Phase 13|this phase|from the research|another packet' $R $O` prints no line.
- [x] T009 Bump the mode version and write the changelog (`$C/SKILL.md` and `$C/changelog/v0.23.7.0.md`). Verify: `rg -n 'version: 0.23.7.0' $C/SKILL.md` prints one line and the changelog file exists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Sweep every `sk-design` mode for another research leak (`.skilled/skills/sk-design`). Verify: the only leak hits are changelog "Spec folder:" lines, a dated benchmark run report and style-library site descriptions.
- [x] T011 Validate the four cleaned files and the changelog (`$R`, `$O` and `$C/changelog/v0.23.7.0.md`). Verify: `validate_document.py` reports VALID 0 issues on all five.
- [x] T012 Run the chart corpus and mode checks (`$C`). Verify: `check-corpus.cjs` reports RESULT PASSED errors 0 and the `apply-design-md`, `corpus-mutations` and `typo-flags` tests exit 0.
- [x] T013 Run the packet gate (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/003-chart-research-cleanup --strict` prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The packet gate prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: REQ-001 to REQ-005 cover the citations, the kept rules, the sweep, the version and the gate.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: the architecture section names the four files, the validator and the sweep.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the four files exist under `$C` and `validate_document.py` runs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Documents pass lint and format checks. Evidence: `validate_document.py` reports VALID 0 issues on the four files and the changelog.
- [x] CHK-011 [P0] No validator errors or warnings. Evidence: every `validate_document.py` run reads `Total issues: 0`.
- [x] CHK-012 [P1] Error handling implemented. Evidence: no executable path is added. The failure path is a stale citation, and the sweep catches it.
- [x] CHK-013 [P1] Documents follow project patterns. Evidence: each file keeps its frontmatter, anchors and section shape, and the validator accepts them.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` records every row as Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: each changed section was read against the rule it states, including the role split, the radar and pie decision and the stacked-area row.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the three non-citation hit classes were each read and left in place.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the sweep is the failure path, and it reports no remaining citation in the four files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The reported gap is a `class-of-bug`: four files cite provenance a reader cannot open instead of stating the rule.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the sweep over `.skilled/skills/sk-design` found no other research leak.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `plan.md` lists the four files, the skill version line and the changelog as the surfaces the cleanup reaches.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction cases are not applicable. Evidence: the change adds no executable parsing or security path.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts are listed. Evidence: `plan.md` names four files, three citation kinds and four hit classes.
- [x] CHK-FIX-006 [P1] Hostile environment variant is not applicable. Evidence: the documents read no process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the baseline commit `10474a9567` recorded in `001-frontend-upgrade/scratch/facts.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the change edits Markdown skill documents.
- [x] CHK-031 [P0] Input validation is not applicable. Evidence: no untrusted input is parsed by the edited files.
- [x] CHK-032 [P1] Auth and authz are not applicable. Evidence: the change adds no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks stay synchronized. Evidence: all three name the four files, the sweep and version 0.23.7.0.
- [x] CHK-041 [P1] Document comments are adequate. Evidence: the validator comment-hygiene rule finds no ephemeral marker.
- [x] CHK-042 [P2] README updated. Evidence: not applicable, because no reference file was added or renamed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: this packet's `scratch/` holds only `.gitkeep`.
- [x] CHK-051 [P1] `scratch/` holds no stray output. Evidence: no file was added to the phase scratch folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
