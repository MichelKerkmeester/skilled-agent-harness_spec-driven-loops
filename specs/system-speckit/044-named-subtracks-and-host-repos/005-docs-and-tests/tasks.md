---
title: "Tasks: Phase 5: docs-and-tests"
description: "Ordered tasks for the 044 doc and test remediation: baseline, the two test repairs with negative controls, the doc corrections each with a before-and-after check, an optional reader-shape task, and the final recursive validation."
trigger_phrases:
  - "docs and tests tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: docs-and-tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`K` is `.skilled/skills/system-spec-kit/runtime`. `P` is `specs/system-speckit/044-named-subtracks-and-host-repos`. `T` is the test command in `plan.md` section 5, run from `K/cli` after `npm run build` in `K`.

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

- [x] T001 Record the baseline pass and fail counts of every test file in `T` (`scratch/baseline.txt`). Verify: `cat scratch/baseline.txt` shows one total per file. Evidence: `scratch/baseline.txt` holds 11 vitest files, 194 passed and 0 failed, plus the doctor pair at 51 passed and 0 failed.
- [x] T002 Record the operator's answers to D-005a, D-005b and D-005c (`spec.md` section 7). Verify: `rg -n 'Status: answered' spec.md` prints three lines. Evidence: three lines, each carrying `Decided 2026-11-07 by operator: Recommended` and `Status: answered`.
- [x] T003 Confirm phases 001 to 003 are Complete before any doc task (`../001-create-track-fixes/spec.md`, `../002-subtrack-predicate/spec.md`, `../003-metadata-write-safety/spec.md`). Verify: `rg -n '\*\*Status\*\* \| Complete' ../00[123]-*/spec.md` prints three lines. Evidence: three lines, one per predecessor.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Show that the current archive parent-derivation case cannot fail for its stated reason: remove `name.startsWith('z_')` from `isDeclaredSubtrackFolder` locally and run the case (`K/lib/graph/graph-metadata-parser.ts`, `K/cli/tests/graph-metadata-refresh.vitest.ts:120-135`). Verify: the unchanged case still passes with the condition removed, then `git checkout -- K/lib/graph/graph-metadata-parser.ts` restores the file. Evidence: with the condition removed the unchanged four-segment case passed (`scratch/red-T004-unchanged-case-passes-with-z-check-removed.log`); the line was restored by edit and re-checked at `graph-metadata-parser.ts:856`, without a git write.
- [x] T005 Rewrite the case with a three-segment identity, `demo/z_old/001-kept`, whose folder declares `level: "sub-track"` (`K/cli/tests/graph-metadata-refresh.vitest.ts`). Verify: with the `z_` condition removed locally the rewritten case fails with `parent_id` equal to `demo/z_old`, and with the condition restored it passes. Evidence: `scratch/red-T005-z-check-removed.log` shows `expected 'demo/z_old' to be null`; restored, `graph-metadata-refresh.vitest.ts` 7/7.
- [x] T006 Add the P2-14a case for a declared sub-track with no `graph-metadata.json`: exit 0, the packet written, no `was not refreshed`, the sub-track metadata still absent (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: it passes on current code, and with the existence guard in `refresh_track_level` removed locally it fails; the guard is then restored. Evidence: `scratch/red-T006-metadata-guard-removed.log` shows the seeded file failing the absence assertion; restored, `create-track-refresh.vitest.ts` 22/22.
- [x] T007 Add the P2-14a case for a refresh failure on the sub-track path: invalid JSON in `demo/sub/graph-metadata.json`, exit 0, stderr containing `demo/sub/graph-metadata.json was not refreshed` (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: it passes on current code, and with the warning line unreachable locally it fails; the line is then restored. Evidence: `scratch/red-T007-warning-unreachable.log` shows the missing warning; restored, `create-track-refresh.vitest.ts` 22/22.
- [x] T008 [P] Correct the `specId` requirement per D-005b (`K/../references/structure/folder-structure.md:115`). Verify: before the edit `rg -n 'specId' folder-structure.md` prints line 115 with `<track>/<sub-track>`, and after it prints the corrected row. Evidence: before printed line 115 requiring both fields; after prints `specId` is not required and producers write only `specFolder`; doc version raised to `1.6.8.0`.
- [x] T009 [P] Add sub-tracks to the `track-roots.mjs` row, including both reader return shapes per D-005c (`K/cli/lib/README.md:121`). Verify: `grep -c 'sub-track' K/cli/lib/README.md` prints 0 before and at least 1 after. Evidence: 0 before, 1 after; the row names declared sub-tracks, the working-tree array with `.diagnostics`, and the commit `{ tracks, skipped, diagnostics }` shape.
- [x] T010 [P] Add a sub-track paragraph to section 2, the sub-track tests to section 3, and the `version` bump the frontmatter contract requires (`K/../feature-catalog/tooling-and-scripts/track-root-children-lists.md`). Verify: `grep -c 'sub-track'` prints 0 before and at least 1 after. Evidence: 0 before, 5 after; `subtrack-fixture.vitest.ts` and `validate-subtrack.vitest.ts` added; version `2.0.1.0` to `2.0.2.0`.
- [x] T011 [P] Amend the `red-E.log` citation to name the six logs that exist and say that E was not kept (`P/tasks.md:38`). Verify: `ls P/scratch | rg '^red-'` prints six files, and `rg -n 'red-E' P/tasks.md` prints only the sentence that says E was not kept. Evidence: line 38 now names `scratch/red-A.log` to `red-D.log` and `red-F.log` to `red-G.log` and says `red-E.log` was not kept; `rg -n 'red-E'` prints only that line. The six logs live in the primary checkout and were never committed, so this worktree's `P/scratch` holds none; regenerating them is out of scope.
- [x] T012 [P] Add `tests/validate-subtrack.vitest.ts` to the test command (`P/plan.md:84`; the review cites line 85, which holds the `node --test` line). Verify: `rg -c 'validate-subtrack.vitest.ts' P/plan.md` prints 0 before and 1 after, and the amended command prints zero failures. Evidence: 0 before, 1 after; the amended 10-file command prints 191 passed and 0 failed, and with the parity file 196 passed and 0 failed.
- [x] T013 [P] Correct the Known Limitations item to say a deeper layout is not reported, per D-005a (`P/implementation-summary.md:129`). Verify: the Measured Behavior sweep prints nothing for `deeper`, and `rg -n 'deeper layout' P/implementation-summary.md` prints the corrected sentence. Evidence: line 129 now reads that a deeper layout is not reported because discovery never looks inside a sub-track; the phase spec's Measured Behavior shows the sweep printing nothing for `deeper`.
- [x] T014 [P] Optional, P3, P2-9: if D-005c is Option B, add a case asserting both views return one shape and give both the same return (`K/cli/tests/track-roots.vitest.ts`, `K/cli/lib/track-roots.mjs`, `K/cli/spec/sweep-track-roots.mjs`). Verify: the case fails on unchanged code with the array-versus-object mismatch, and passes after; under Option A this task closes with the T009 README row. Evidence: D-005c took the recommended Option A, so no code change; T009 documents both shapes in the README row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `T` and check that no negative control left an edit behind (`K/cli/tests/`, `K/cli/spec/create.sh`, `K/lib/graph/graph-metadata-parser.ts`). Verify: `T` prints zero failures and the baseline totals plus the new cases, and `git diff --stat` lists only the files in `spec.md` section 3. Evidence: 10 files 191 passed and 11 files 196 passed, both 0 failed (`scratch/final-cli-suite-10-files.log`, `scratch/final-cli-suite-11-files.log`); doctor 51 passed (`scratch/final-doctor-tests.log`); the `z_` guard, metadata guard and warning line are present, `bash -n create.sh` exits 0, and the diff holds only the named files.
- [x] T016 Validate the whole 044 packet after the doc edits (`P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh P --strict --recursive` prints `RESULT: PASSED` for every folder. Evidence: phases 001 to 005 print `RESULT: PASSED` (`scratch/recursive-validation.log`); the parent folder fails only `GREP_CONVENTION` on the pre-existing untracked `morning-handoff.md`, which carries no frontmatter and is outside this phase's scope.
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
