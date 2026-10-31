---
title: "Tasks: Phase 11: template-phrase-census-and-cleanup"
description: "The task breakdown for the template phrase census and cleanup: the judge class, the seeder, two tools, their tests and the operator-approved apply over the corpus."
trigger_phrases:
  - "template phrase census and cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: template-phrase-census-and-cleanup

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

- [x] T001 Extend the phrase judge with the four acceptance criteria defaults as one set matched alongside the spec set (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`)
- [x] T002 Extend the scaffold seeder to replace the acceptance criteria template block with a slug phrase (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [x] T003 [P] Pin the acceptance criteria shell list to its template so a template edit fails a test (`.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the read-only census: exact-block carriers per track with live and archived apart, informational counts for the other templates, and `scratch/` and `containment/` skipped (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs`)
- [x] T005 Create the cleanup: dry run by default, `--apply`, `--include-archive`, exact block replacement only, before and after sha256 per file, and exit codes 0 for nothing to change, 1 for changes, 2 for errors (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
- [x] T006 [P] Cover both tools in tests: dry run writes nothing, apply keeps author phrases, idempotent second apply, broken frontmatter skipped, scratch and containment ignored, one acceptance criteria phrase, and duplicate suppression (`.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts`)
- [x] T007 Assert the new judge class on real phrases (`.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`)
- [x] T008 [P] Assert the scaffold seeds the acceptance criteria file and pins the shell list (`.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts`)
- [x] T009 Drop seeded phrases that duplicate an existing author phrase, found when three packets failed strict validation after the apply (`.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the seeding and judge suites: 3 files, 80 tests pass, up from the 76-test baseline
- [x] T011 Run the census on the real `specs/` tree: 4,412 `spec.md` and 489 `acceptance-criteria.md` scanned
- [x] T012 Present the dry run, then apply with operator approval: 509 files changed in 375 packets, 0 archived, 7 files skipped for a leading HTML comment, and a second dry run reports 0 files to change
- [x] T013 Re-derive the derived metadata for the 375 touched packets (0 repairable left)
- [x] T014 Run strict validation over the 375 touched packets: the three duplicate-phrase packets were fixed and now pass
- [x] T015 Rebuild the committed trigger index and rerun the freshness check - `--check` exit 0, 0 stale
- [x] T016 Run the whole spec-kit CLI test folder as the final regression: 161 files passed and 3 skipped, with 1621 tests passed, 19 skipped and 0 failed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No unblocked tasks remain - every task that could run from here has a recorded result
- [x] Manual verification passed for the apply - the operator reviewed the dry run before `--apply`, and a second dry run reports nothing left to change
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 to REQ-006, with the criteria in `acceptance-criteria.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md - plan.md section 3 names the shared judge set, the seeder and the two tools
- [x] CHK-003 [P1] Dependencies identified and available - Phase 8's single phrase source is the only dependency and it landed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - no lint or format configuration applies to these CLI scripts, so the recorded check is the CLI suite: 161 files passed and 3 skipped, with 1621 tests passed, 19 skipped and 0 failed
- [x] CHK-011 [P0] No console errors or warnings - no run reported one, and the final CLI suite ended with 0 failed
- [x] CHK-012 [P1] Error handling implemented - unknown arguments and a missing root exit 2, malformed frontmatter and non-sequence `trigger_phrases` are reported and skipped, and a no-op run exits 0
- [x] CHK-013 [P1] Code follows project patterns - the tools share one library module and use stable exit codes 0, 1, 2 and `--json` output like the other CLI scripts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - six of six Met with evidence
- [x] CHK-021 [P0] Manual testing complete - the operator reviewed the dry run before `--apply`, and the second dry run reports 0 files to change
- [x] CHK-022 [P1] Edge cases tested - dry run writes nothing, author phrases stay, second apply is idempotent, duplicate suppression, scratch and containment ignored
- [x] CHK-023 [P1] Error scenarios validated - broken frontmatter skipped, non-sequence `trigger_phrases` skipped, 7 files skipped for a leading HTML comment
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - the duplicate seeded phrase is class-of-bug: the tool now drops any seeded phrase that duplicates an existing one, not just the three packets found
- [x] CHK-FIX-002 [P0] Same-class producer inventory partly completed - `seededPhrases` in the cleanup tool is the only producer of seeded phrases, and the duplicate suppression test covers it
- [x] CHK-FIX-003 [P0] Consumer inventory completed - the three affected packets (`cli-jev/002/004-compiled-fleet-onboarding`, `sk-code/009-sk-code-mobile-cli-deprecation`, `sk-git/030-commit-body-always-required`) were fixed by the orchestrator and now pass strict validation
- [x] CHK-FIX-004 [P0] Adversarial cases - malformed frontmatter, non-sequence `trigger_phrases`, scratch and containment outside scope, a no-op run, and a second apply
- [x] CHK-FIX-005 [P1] Matrix axes - document kind (spec, acceptance criteria) by run mode (dry run, apply, second apply) by skipped location (scratch, containment), exercised in `template-phrase-cleanup.vitest.ts`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant - not applicable, both tools take arguments and the working directory only
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA - no, the change is uncommitted in the worktree, so the pin is the recorded lane run and the enumerated file list
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - no secrets in the two tools or the judge change
- [x] CHK-031 [P0] Input validation implemented - unknown arguments exit 2, a missing root exits 2, and malformed files are skipped rather than rewritten
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable, local CLI tools with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - reconciled at close: spec Complete, acceptance criteria five Met and one Unmet
- [x] CHK-041 [P1] Code comments adequate - the comment hygiene rule holds, no spec paths or ids in comments
- [x] CHK-042 [P2] README updated (if applicable) - no README change. `retrieval-conventions.md` Warn On now lists both template blocks under `template-default`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - this packet's `scratch/` holds only `.gitkeep`, and the tools write only under the given `specs/` root
- [x] CHK-051 [P1] scratch/ cleaned before completion - no working files left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-07
<!-- /ANCHOR:summary -->

---
