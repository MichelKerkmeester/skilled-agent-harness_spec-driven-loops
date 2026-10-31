---
title: "Tasks: Phase 12: template-phrase-cleanup-round-two"
description: "The task breakdown for round two of the template phrase cleanup: the judge sets, the seeder, the stop-word trim, the partial-block and new-kind rules, the approved apply over 1,319 live files and the validation that followed."
trigger_phrases:
  - "template phrase cleanup round two tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: template-phrase-cleanup-round-two

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

- [x] T001 Extend the phrase judge with the plan, tasks and implementation summary default sets, each one a frozen set matched by the template-default check (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`)
- [x] T002 Seed plan.md, tasks.md and implementation-summary.md with one slug phrase each when the exact four-line block is present (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [x] T003 [P] Pin each new set and each shell list to its template file (`.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the 48-word trailing stop-word trim to `create.sh` and export the same list from the cleanup tool, with a pin test tying the two lists together (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T005 Extend the cleanup to the plan, tasks and implementation summary document kinds (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T006 Remove only the default rows from a partial block when an author phrase remains, keep author rows byte for byte, and reseed a list made only of defaults (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T007 Reseed cut-off `spec.md` phrases of exactly eight words that end on a stop word, and drop a phrase when the trim empties it or repeats one already in the list (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T008 Count the three new kinds and the partial carriers per kind in the census (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`)
- [x] T009 [P] Cover the two partial rules, an author-only list, the clean second run, the seeds and the stop-word pins in tests (`.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the gates on the final code: the spec-kit CLI suite reports 161 files passed and 3 skipped with 1636 tests passed, 19 skipped and 0 failed, up from the 1625-pass baseline. `bash -n create.sh` exits 0 and `node --check` passes on both tools
- [x] T011 Dry run first: 1,319 files would change and 21 were skipped for no opening frontmatter delimiter, and the orchestrator reviewed 10 random samples plus one mixed `plan.md` file
- [x] T012 Apply with operator approval as its own commit: 1,319 files changed, and a second run reports 0 files to change
- [x] T013 Re-derive the derived metadata for the 541 touched folders: 541 repaired and 0 failed
- [x] T014 Run strict validation over the 541 touched folders: 520 RESULT: PASSED and 21 RESULT: FAILED on pre-existing rules the cleanup never touched
- [x] T015 Rebuild the committed trigger index and run the freshness check (`generate-trigger-index.mjs --check` exits 0)
- [x] T016 Fix the 21 folders that were already failing strict validation, at the operator's choice: 43 missing frontmatter fields copied from each `spec.md`, 4 empty trigger lists seeded, one description, one continuity block, one status cell, two reworded anchor mentions, and anchors and template headers around the unchanged prose of four folders. All 21 then pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining - nothing is blocked, the one open task is a handoff
- [x] Manual verification passed for the apply - the operator approved the apply as its own commit after the dry run and the sample review
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-006, with the criteria table in `acceptance-criteria.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md - the judge sets, the seeder, the stop-word trim and the two cleanup rules
- [x] CHK-003 [P1] Dependencies identified and available - the phase 11 tools and phrase lists are the only dependency and they carried over
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - no lint or format configuration applies to these CLI scripts, so the recorded check is the CLI suite: 161 files passed and 3 skipped with 1636 tests passed, 19 skipped and 0 failed
- [x] CHK-011 [P0] No console errors or warnings - the final CLI suite ended with 0 failed
- [x] CHK-012 [P1] Error handling implemented - a file with no opening frontmatter delimiter is reported and skipped and sets exit 2, and a malformed file is never rewritten
- [x] CHK-013 [P1] Code follows project patterns - the tools keep the stable exit codes 0, 1 and 2 and the `--json` output shape of the other CLI scripts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - seven of seven Met with evidence, including all 541 touched folders passing strict validation and a fresh trigger index
- [x] CHK-021 [P0] Manual testing complete - the operator approved the apply as its own commit after the dry run and the 10-sample review
- [x] CHK-022 [P1] Edge cases tested - partial blocks, defaults-only lists, author-only lists, the stop-word trim and an idempotent second run
- [x] CHK-023 [P1] Error scenarios validated - the 21 files with no opening frontmatter delimiter are reported and never rewritten
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - the 21 strict-validation failures are instance-only and pre-existing: every changed markdown line in the cleanup diff is a trigger phrase row and each failing rule reads content the cleanup never touched. Each was fixed in its own folder
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - the five judge sets, the five shell lists and the cleanup's own matcher are the phrase producers and the pin tests cover them
- [x] CHK-FIX-003 [P0] Consumer inventory completed - `phrase-judge.mjs` reads the sets, `create.sh` seeds them into new packets, the cleanup removes default rows and the census counts carriers
- [x] CHK-FIX-004 [P0] Adversarial cases - a file with no frontmatter, a defaults-only list, an author-only list, a duplicate phrase and a second run that changes nothing
- [x] CHK-FIX-005 [P1] Matrix axes - document kind (five) by list shape (exact block, partial, defaults-only, author-only) by run mode (dry run, apply, second apply)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant - not applicable, the tools read their arguments and the working directory only
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA - yes, the code commit 5e4164bfac9 and the cleanup commit 7fe1cbeda87
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - none in the changed files
- [x] CHK-031 [P0] Input validation implemented - unknown arguments exit 2 and a missing root exits 2
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable, local CLI tools with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - reconciled at close
- [x] CHK-041 [P1] Code comments adequate - the comment hygiene rule holds, no spec paths or ids in comments
- [x] CHK-042 [P2] README updated (if applicable) - no README change was part of this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - this packet's `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion - no working files left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-07
<!-- /ANCHOR:summary -->

---

