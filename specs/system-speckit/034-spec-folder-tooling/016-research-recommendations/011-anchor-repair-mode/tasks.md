---
title: "Tasks: Phase 11: anchor-repair-mode"
description: "The task list for Anchor repair mode, each task naming its file, with the evidence that closed it."
trigger_phrases:
  - "anchor repair mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: anchor-repair-mode

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

- [x] T001 Verify phase 1 (SH-01) template fix is available and new scaffolds render correctly. Phase 001 is Status Complete, and its wave 1 record shows freshly rendered scaffolds at levels 1, 2, 3 and 3+ passing `validate.sh --strict`.
- [x] T002 Collect 10 fixture examples: glued template pairs, fenced duplicates, nested questions layouts. Eleven inline cases in `heal-anchor-repair.vitest.ts` cover the three classes, the collision, the unglued overlap, the flat-subheading decoy and both wrapper shapes, and `tests/fixtures/anchor-repair-sample/` holds 60 frozen documents (50 repairable, 10 refused).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Build the fence parser that respects code fence boundaries (`` ``` `` and `~~~`) (`.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`). Done: `fencedLines` and the fence-aware `parseAnchorPairs`.
- [x] T004 [P] Build the collision detector that checks suffix conflicts when numbering duplicates (same file). Done: `repairDuplicateAnchors` refuses a rename whose suffix is already in use.
- [x] T005 Build the anchor-repair mode with dry-run that writes nothing and reports findings (same file). Done: `runAnchorRepair` writes only with `--apply`.
- [x] T006 [P] Add un-nesting detector for the systematic questions layout (same file). Done: `unnestQuestionsAnchors`.
- [x] T007 Add anchor-repair as a repair step in `upgrade-legacy.mjs` (`.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`). Done: `repairPackets` runs `repairAnchorFile` before the healer.
- [x] T013 Run the un-nesting move, and no other anchor repair, on archived packets in `repairArchived`, and update the header comment (`.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`). Done: `repairArchived` calls `unnestQuestionsAnchors` only, and the module header states the exception.
- [x] T014 Update the archived test to allow exactly the un-nesting move, and add a prose-identity check (`.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts`). The task first cited line 208. The archived test is now the one named "un-nests only the questions anchor in an archived packet and leaves every prose line as written".
- [x] T008 [P] Write tests for all three defect classes and collision detection (`.skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add atomic write implementation for all anchor edits in a document. Done: `writeFileAtomic` writes a temporary file in the same directory, keeps the mode, fsyncs and renames, and removes the temporary file on failure. Closeout 3: the healer exports this writer, and it makes one exclusive create with no retry loop (OC-O2, OC-O3).
- [x] T009a Run the test suite on all three defect types: `npx vitest run heal-anchor-repair.vitest.ts` (the task first named a file that does not exist)
- [x] T010 Run dry-run on 50 random documents from the 549 and verify no files written, findings reported. Done by the frozen sample test in `anchor-repair-sample.vitest.ts`: the dry run covers 60 seeded copies (50 repairable, 10 refused) and the sandbox manifest is unchanged afterwards.
- [ ] T011 Apply anchor-repair on the same 50 documents and run `validate.sh --strict` on each. OPEN: the corpus apply un-nested the 50 source packets, and `validate.sh <folder> --strict` gives 49 PASSED and 1 FAILED. The failing packet is a scratch backup whose generated metadata drifts from its folder (`SOURCE_FINGERPRINT_DOCSET_MISSING` and path drift), its metadata files are unchanged from HEAD, and its ANCHORS_VALID check passes. All 50 pass ANCHORS_VALID. The failure is outside this phase and needs an operator decision. Second pass (2026-10-09): the failing packet is `specs/system-speckit/028-memory-search-intelligence/scratch/topology-migration-backup/identity-backups/004-dark-flag-graduation/001-multihop-tail-appends`. Its `validate.sh --strict --no-recursive` run ends `RESULT: FAILED` on two rules (gates/closeout2-011/t011-scratch-validate.out): GENERATED_METADATA_INTEGRITY, whose detail is `SOURCE_FINGERPRINT_DOCSET_MISSING` in graph-metadata.json (a source_fingerprint with no docset), and METADATA_DISK_PATH_CONSISTENCY, where the metadata names a non-scratch path. GENERATED_METADATA_DRIFT passes, so no document content mismatch is reported. The messages name only the metadata fields and the folder path. `git diff HEAD` shows no change to either metadata file, the last commit that touches them is 416ef565272, and the only change in the folder is marker lines in spec.md. The drift therefore predates this build. That is inferred from the file history and the messages, since no validation run at HEAD was made. T011 stays open.
- [x] T012 Run the full spec-kit CLI suite and verify no regressions. Done: the whole-tree CLI gate and the literal `npx vitest run runtime/cli/tests` both exit 0, with 171 test files and 1752 tests passed, against a baseline of 161 files and 1639 tests (implementation-summary.md, Verification table).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T011, CHK-031 and CHK-FIX-004 to CHK-FIX-007 stay open, see their entries above)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the corpus dry run and apply, the hand-fix census with zero nesting findings, and the 50-packet validation run on 2026-10-09
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md lists REQ-001 to REQ-008.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md names the files, the tests and the rollback.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: phase 001 (SH-01) is Status Complete.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `npm run check` (lint, boundary and AST checks) exits 0 on the whole tree. Second pass: tree4 `cli-check` exits 0 (gates/tree4/cli-check.rc). Third pass: tree5 `cli-check` exits 0 (gates/tree5/cli-check.rc).
- [x] CHK-011 [P0] No console errors or warnings. Evidence (second pass, 2026-10-09): the verbose run of the four anchor-repair files (gates/closeout2-011/focused-verbose-3.out, 62 of 62 passed) has no `stderr |` block. Its one `stdout |` block is the sample test's summary line `anchor sample: fixtures=60 repairable=50 refused=10`. The only warning in that output is Vite's config-loader notice for `../../vitest.config.ts`, which the suite prints on every run and which does not come from these tests. The tree4 cli-test.log has no `stderr |` block at all.
- [x] CHK-012 [P1] Error handling implemented. Evidence: unmatched anchors, collisions and wrapper overlaps are refused with a reason, and a failed rename leaves the original in place.
- [x] CHK-013 [P1] Code follows project patterns. Evidence (second pass, 2026-10-09, a judgment from reading the code and not a second reviewer): the mode reuses the healer's own helpers (`fencedLines`, `parseAnchorPairs`, `ANCHOR_LINE_RE`) and the renderer's `parseAnchoredSections`, instead of adding a parser. The CJS module keeps its banner, `'use strict'` and JSDoc on its three exported entry points. The new tests follow the sibling pattern in heal-lane-modes.vitest.ts (`describe` and `it`, `createRequire`, `afterEach` cleanup). The tree4 `check` step passes (gates/tree4/cli-check.rc). The tree5 `check` step also passes (gates/tree5/cli-check.rc).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: all eight rows of acceptance-criteria.md are Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: corpus dry run and apply, marker-only proofs, the hand-fix census with zero nesting findings, and the 50-packet validation run (implementation-summary.md, Verification table).
- [x] CHK-022 [P1] Edge cases tested. Evidence (second pass, 2026-10-09): the unclosed-fence row ("an unclosed fence before the questions anchor hides it, so nothing is written") and the both-anchors row ("a nested and a flat questions anchor together are ambiguous to the un-nesting") in heal-anchor-repair.vitest.ts both pass in gates/closeout2-011/focused-verbose-3.out.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: a simulated rename failure restores the original, a write under umask 077 keeps the mode, and collisions and wrapper overlaps are refused.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence (second pass, 2026-10-09): the classes are in implementation-summary.md, Review Rounds and Findings, under Finding classes. The table has eight rows: round 1 (three), found while building (two), round 2 (one), the final review (one) and the whole-tree gate (one).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence (second pass, 2026-10-09): the producer inventory is in implementation-summary.md, Producer and consumer inventory, built from ripgrep over `.skilled/`. It corrects the plan's claim that `create.sh` is the only producer: heal-spec-docs.cjs `anchorWrap` and scaffold-debug-delegation.sh also write packet anchors. This phase adds no marker lines. It moves, removes or renames them.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence (second pass, 2026-10-09): the consumer inventory is in implementation-summary.md, Producer and consumer inventory. It covers the changed helpers and their callers, the validator rule and its severity, the response lines, the docs and the tests. The plan's `spec merger` is not a module name in the tree, so it was not found. The nearest merge code is the phase-map and phase-context merge in create.sh, and that code writes anchors.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. OPEN: the fence cases cover delimiters and no-op documents, but not every listed case. Closeout check (2026-10-09): the adversarial table (heal-anchor-repair.vitest.ts, nine rows) covers the delimiter (fence rows), joined input (the two joined-line rows), no-op (the flat and fenced documents) and the refusal cases. The outside-root case has no test, and a closeout probe found a real gap: a symlinked spec.md is replaced by a regular file on apply (implementation-summary.md, Known Limitations 8). Left open.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. OPEN: the axes are in plan.md, and the row count is not recorded. Closeout check (2026-10-09): the axes are in plan.md (Affected surfaces), and the row count is now countable: 20 heal-anchor-repair cases, one sample test over 60 documents and three upgrade-legacy anchor cases. No matrix section is written into the packet yet, so this item stays open.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. OPEN: not run for this phase. Closeout check (2026-10-09): no hostile environment variant was run. The umask case (upgrade-legacy.vitest.ts, "keeps an archived document mode under a restrictive umask") sets process-wide state and is a possible candidate, but the item needs a deliberate variant run. Left open.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. OPEN: the changes are not yet committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a grep for secret, password, api key, bearer and token assignments in the two tool files and three test files finds nothing.
- [ ] CHK-031 [P0] Input validation implemented. OPEN: the `--folder` and `--roots` arguments are not validated beyond the existence check on spec.md. Closeout check (2026-10-09): the spec.md existence check is the validation the code's contract asks of a packet folder. `discover()` in heal-spec-docs.cjs defines a packet as a folder that holds spec.md, and `runAnchorRepair` skips a folder without one. The SKIP_DIRS comment (heal-spec-docs.cjs lines 54-66) says an explicit `--folder` bypasses the archive skip, so the caller is trusted to name the right packet. Argument-level checks are still missing: a `--folder` with no value throws a TypeError, unknown flags are ignored, and a missing folder exits 0 (implementation-summary.md, Known Limitations 7). upgrade-legacy's parser exits 2 for those cases, but the healer's default mode parses its arguments the same way at HEAD. Left open for an operator decision: add argument checks, or accept the healer's convention.
- [x] CHK-032 [P1] Auth/authz working correctly. Not applicable: the tool is a local CLI with no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec, plan, tasks, acceptance criteria and summary agree on Complete, and the test file names are corrected.
- [x] CHK-041 [P1] Code comments adequate. Evidence (second pass, 2026-10-09, a judgment from reading the 011 regions): each non-obvious rule carries its reason beside it. The fence rule sits on `parseAnchorPairs`, the wrapper refusal on `unnestQuestionsAnchors`, the H2-only heading rule on `OPEN_QUESTIONS_RE`, the umask re-apply in `writeFileAtomic` (`writeDocumentAtomic` was deleted in closeout 3, OC-O2), and the archive-skip contract on `SKIP_DIRS`. A search of the 011 regions for phase, finding, task, operator and date labels finds no artifact labels. `repairDuplicateAnchors` and `runAnchorRepair` have no JSDoc, but each refusal message states its outcome.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the spec/README.md upgrade-legacy and heal-spec-docs rows describe the archived writes and the anchor repair scope.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the phase folder holds no temporary file, and run output was kept outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch/ holds only its .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 10/12 |
| P1 Items | 13 | 10/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09. Second pass: P0 10/12 and P1 10/13. The open items are T011, CHK-031, CHK-FIX-004 to CHK-FIX-007 (CHK-FIX-007 needs the ship commit). The open items are listed in implementation-summary.md, Known Limitations.
<!-- /ANCHOR:summary -->

---



