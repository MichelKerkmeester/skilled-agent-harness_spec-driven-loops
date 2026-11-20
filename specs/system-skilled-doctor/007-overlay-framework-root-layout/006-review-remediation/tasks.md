---
title: "Tasks: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review remediation tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: fix the Skilled findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs` and `T` is `.skilled/commands/doctor/scripts/tests/`, both in the worktree `/Users/michelkerkmeester/worktrees/public/481-overlay-framework-root-layout` until the merge.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Bring the worktree branch current with Skilled main (`worktrees/481-overlay-framework-root-layout`). Verify: `git merge-base --is-ancestor main HEAD` exits 0.
- [x] T002 Record the baseline gates on the branch (`T`). Verify: the engine suite prints 250/250, the guard suite 20/20, the contract test 9/9, each exit 0, and `route-validate` exits 0 with 32 routes.
- [x] T003 Confirm each Skilled finding against the code (`E`). Verify: spec.md's Measured Behavior and plan.md §3 quote the lines each finding names.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Guard the relayout's renames, manifest write and relinks and restore the folder on failure, with a fault-injection test (`E`, `T/overlay-engine-follow-up.test.cjs`). Verify: the new test sees exit 2, the `error: relayout failed while moving` line and an identical overlay folder.
- [x] T005 Refuse a sibling overlay folder outside the git repository or in its `.git` at `resolveOverlayDir`, with tests for both and for a tree in no repository (`E`, `T`). Verify: the new tests pass and `status` prints `outside the git repository at`.
- [x] T006 Put `overlayOutside` on the context and read it in the four command paths (`E`). Verify: `rg -c 'isWithin\((ctx\.|liveCtx\.)?root, (ctx\.|liveCtx\.)?overlayRoot\)' E` prints 0 and the engine suite passes.
- [x] T007 Branch the LAYOUT overflow remedy on `root/skilled`, with a mixed-tail test (`E`, `T`). Verify: the test sees `for M, and change the destination or remove the entry for the B under root/skilled`.
- [x] T008 Branch the strict-write remedy for a path on a `remove` list, with a test (`E`, `T`). Verify: the test sees `which overlay <id> removes on every apply`.
- [x] T009 Restate the `layoutMoves` JSDoc and split `writeBackup`'s overlay-area pass (`E`). Verify: the JSDoc names `framework/` and `root/` and the engine suite passes with no expectation changed.
- [x] T010 [P] State both LAYOUT remedies in the presentation contract (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`). Verify: the contract test passes and `grep -c 'change the destination or remove the entry'` prints 3 or more.
- [x] T011 [P] State both LAYOUT remedies, the relayout failure contract and the outside-repository refusal (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `grep -c 'relayout failed while'` prints 1 and `grep -c 'outside the git repository at'` prints 1 or more.
- [x] T012 [P] Reword phase 005 AC-008 and AC-009 to the baseline-equal bar with the deviation named (`../005-barter-move-overlays-out-of-tree/acceptance-criteria.md`). Verify: both rows name the 11 pre-existing failures.
- [x] T013 [P] Record that the re-pin left both Barter OpenCode plugins unloadable until ai-speckit `a954fc956ce` (`../004-barter-repin-and-relayout/implementation-summary.md`). Verify: `rg -n 'a954fc956ce'` prints the line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `@review` on the branch diff and fix until it approves (`E`, `T`, the two docs). Verify: the review's final `Review status:` line reads APPROVED.
- [x] T015 Rerun the four gates on the branch (`T`). Verify: each exits 0 and the engine suite counts more than 250 tests.
- [x] T016 Merge the branch into Skilled main with `--no-ff` (`main`). Verify: `git log -1 --format=%P f2a608297c9` prints two parents and no command of this run fetched or pushed.
- [x] T017 Re-derive phase 002's line pointers and caller count from the merged code (`../002-engine-framework-root-source-layout/spec.md`). Verify: `rg -n` on each cited symbol prints the cited line.
- [x] T018 Rerun the four gates on main and strict-validate this phase, 002, 005 and the parent recursively (`main`). Verify: each gate exits 0 and each validate run prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `implementation-summary.md` names the merge commit and the gate counts on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
