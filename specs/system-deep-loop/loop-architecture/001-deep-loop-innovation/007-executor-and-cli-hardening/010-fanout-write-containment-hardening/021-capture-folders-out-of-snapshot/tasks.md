---
title: "Tasks: Capture Folders out of the Containment Snapshot"
description: "Task list and verification checklist for phase 021, moving containment capture folders out of the fan-out snapshot and untracking the capture output"
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "detection baseline capture skip"
  - "readme verdict parity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Capture Folders out of the Containment Snapshot

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

- [x] T001 Read the snapshot and detection code - **Evidence**: reading `snapshotOutOfScopeDirtyPaths` and `detectNewOutOfScopeViolations` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` shows the snapshot copies every untracked path outside a lane into `<lineageDir>/containment/baseline/` and detection subtracts that baseline, so both loops see the captures earlier runs left in the tree.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Snapshot test (red) - **Evidence**: the new test "skips capture folders an earlier run left in the tree, so a capture never copies a capture" in the "baseline content capture" group of `write-containment.vitest.ts` failed before its guard and passes after it, and the file reports 79 passed.
- [x] T003 Snapshot guard - **Evidence**: `write-containment.ts` gained a `CAPTURE_DIRS` list covering `containment/baseline` and the pass quarantine dir and a helper `isContainmentCapturePath(path)`, and the snapshot loop skips capture paths after the unattributable skip, with `write-containment.vitest.ts` reporting 79 passed.
- [x] T004 Detection test (red) - **Evidence**: the new test "does not report capture folders an earlier run left in the tree as new violations" in the "baseline content capture" group of `write-containment.vitest.ts` failed before its guard and passes after it.
- [x] T005 Detection guard - **Evidence**: the detection forward loop in `write-containment.ts` skips capture paths before the baseline lookup, and the run of `write-containment.vitest.ts` reports 79 passed.
- [x] T006 Gitignore rules - **Evidence**: `.gitignore` gained the two patterns `specs/**/containment/baseline/` and `specs/**/containment/quarantine/` with a comment on why.
- [x] T007 Untrack the captures - **Evidence**: `git rm --cached` untracked all 24,582 capture files under nine roots with the content kept in history, and `git ls-files` under both capture kinds reports 0 files with the longest tracked path down from 971 to 353.
- [x] T008 Prune the sk-doc baseline - **Evidence**: `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` dropped the 246 capture READMEs from 1,304 entries to 1,058 with every other entry unchanged, and `test_readme_verdict_parity.py` reports PARITY PASS with 1,058 files and 0 diffs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the suites and typecheck - **Evidence**: `write-containment.vitest.ts` reports 79 passed, the six containment-related test files report 395 passed and 1 skipped, the runtime typecheck exits 0, and the sk-code drift guards report 2 guards passed with 0 errors.
- [x] T010 Live removal proof - **Evidence**: at the final HEAD `git worktree add --detach` of a fresh worktree with 115,878 tracked files and a longest absolute path of 448 characters and then plain `git worktree remove` both exit 0, with the folder gone and no worktree entry left.
- [x] T011 Packet docs and parent rows - **Evidence**: the task list in `evidence/dispatch/evidence.md` records T011 done, and the work landed as commits `1c6f97a004` and `8a932df0ab` on branch `worktrees/066-ci-cleanup-follow-ups` rebased onto `origin/main`.
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

- [x] CHK-001 [P0] The problem is stated before any fix: each run nested the previous captures one level deeper and a worktree could not be removed - **Evidence**: the problem section of `evidence/dispatch/evidence.md` records the nesting through `snapshotOutOfScopeDirtyPaths` and the "File name too long" failure of `git worktree remove` on worktree 061 on 2026-09-23.
- [x] CHK-002 [P0] The technical approach is defined: guard both the snapshot and the detection, match capture folders by path segment, untrack every capture folder - **Evidence**: the decisions section records guarding both functions because detection subtracts the baseline, matching by path segment anywhere in the path whichever run wrote the folder, and untracking every capture folder after the operator chose "All capture folders" on 2026-09-23.
- [x] CHK-003 [P1] The affected surfaces are identified and named - **Evidence**: the what changed section names `write-containment.ts`, `write-containment.vitest.ts`, `.gitignore` and `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The changed containment code passes the runtime typecheck - **Evidence**: the runtime typecheck exits 0.
- [x] CHK-011 [P0] The test runs report no failures - **Evidence**: `write-containment.vitest.ts` reports 79 passed and the six containment-related test files report 395 passed with 1 skipped.
- [x] CHK-012 [P1] Both read paths that could copy or report captures are guarded - **Evidence**: the snapshot loop skips capture paths after the unattributable skip and the detection forward loop skips capture paths before the baseline lookup.
- [x] CHK-013 [P1] Each guard sits at the existing skip points in its own loop instead of in a new pass - **Evidence**: the what changed section records the skip placement in each loop and the full run of `write-containment.vitest.ts` reports 79 passed with the guards in place.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are met - **Evidence**: the requirement and acceptance ids section marks REQ-001 with AC-001, REQ-002 with AC-002, REQ-003 with AC-003, REQ-004 with AC-004, REQ-005 with AC-005 and REQ-006 with AC-006 all Met.
- [x] CHK-021 [P0] The worktree removal is proven live on the fixed tree - **Evidence**: the live removal proof at the final HEAD adds a fresh worktree with `git worktree add --detach` and removes it with plain `git worktree remove`, both exit 0, with the folder gone and no worktree entry left.
- [x] CHK-022 [P1] The earlier-run edge case is tested in both the snapshot and the detection - **Evidence**: the two tests in the "baseline content capture" group of `write-containment.vitest.ts` cover capture folders an earlier run left in the tree and both pass.
- [x] CHK-023 [P1] The wider containment suites pass alongside the focused file - **Evidence**: the six containment-related test files report 395 passed and 1 skipped.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each fix lands at the surface that owns the wrong bytes rather than at the checker - **Evidence**: the guard lands in `write-containment.ts`, the ignore rules in `.gitignore`, the untrack runs through `git rm --cached` and the README verdict prune lands in the sk-doc baseline JSON.
- [x] CHK-FIX-002 [P0] Both functions that read capture paths are fixed in their own loops rather than only the snapshot - **Evidence**: the decisions section records that detection subtracts the baseline so both functions need the guard, and the what changed section records the skip in each loop.
- [x] CHK-FIX-003 [P0] Downstream consumers of the untracked captures are inventoried - **Evidence**: the known limitations record the five quarantine generations cited in `specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md`, the now unmatched exclude in `.github/workflows/dispatch-enforcement-guard.yml` and the filesystem walkers that read the disk rather than git.
- [x] CHK-FIX-004 [P0] Each new test failed before its guard and passes after it - **Evidence**: the two tests in the "baseline content capture" group both failed before their guard and pass after it.
- [x] CHK-FIX-005 [P1] The scale of the cleanup is stated before completion is claimed - **Evidence**: 24,582 capture files under nine roots were untracked and 246 capture READMEs were dropped from 1,304 baseline entries to 1,058.
- [x] CHK-FIX-006 [P1] The path length result is rechecked after the rebase so it holds on the final tree - **Evidence**: the longest tracked path is 353 characters after the change, down from 971, and it was rechecked after the rebase onto `origin/main`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commits rather than a moving range - **Evidence**: commits `1c6f97a004` and `8a932df0ab` on branch `worktrees/066-ci-cleanup-follow-ups`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No capture content is destroyed by the untrack - **Evidence**: the what changed section records that `git rm --cached` untracked all 24,582 capture files and that the content stays in history.
- [x] CHK-031 [P0] Both capture kinds are ignored so a later run cannot re-add them - **Evidence**: the `.gitignore` patterns `specs/**/containment/baseline/` and `specs/**/containment/quarantine/` cover both kinds with a comment on why.
- [x] CHK-032 [P1] Deep nesting cannot slip past the guard - **Evidence**: the decisions section records matching by path segment anywhere in the path, whichever run wrote the folder.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet passes validate.sh --strict - **Evidence**: `validate.sh --strict --no-recursive` on this packet printed Errors 0, Warnings 0 and RESULT: PASSED.
- [x] CHK-041 [P1] The new ignore rules carry their reason in a comment - **Evidence**: the what changed section records a comment on why next to the two `.gitignore` patterns.
- [x] CHK-042 [P2] The sk-doc README verdict baseline is updated in step with the untrack - **Evidence**: the baseline dropped the 246 capture READMEs from 1,304 entries to 1,058 with every other entry unchanged, and `test_readme_verdict_parity.py` reports PARITY PASS with 1,058 files and 0 diffs.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The dispatch briefs and their raw output live under the packet's evidence folder - **Evidence**: the identity section records briefs wu1 to wu5 with raw output in `evidence/dispatch/`.
- [x] CHK-051 [P1] The tree carries no tracked capture output at completion - **Evidence**: `git ls-files` under both capture kinds reports 0 files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23
<!-- /ANCHOR:summary -->

---



