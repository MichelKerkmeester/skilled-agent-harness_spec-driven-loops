---
title: "Tasks: Phase 12: fix the Skilled findings of the second overlay layout review"
description: "Ordered tasks for the relayout error contract, the engine path checks, the doctor docs and the packet records, each with its verify command."
trigger_phrases:
  - "review round 2 fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: fix the Skilled findings of the second overlay layout review

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

`W` is the worktree `/Users/michelkerkmeester/worktrees/public/495-overlay-review-round-2-fixes`. `E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `D` is `.skilled/commands/doctor/scripts/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree through sk-git at main tip (`W`). Verify: `git -C W log -1 --format=%h` prints `95aa07427ec`.
- [x] T002 Take the baseline gates on the worktree (`plan.md` §2). Verify: the engine suite prints `tests 263`, guard `tests 20`, contract `tests 9`, release-update `tests 95`, deep-loop `Tests 209 passed`.
- [x] T003 Prove the phase 009 fix of the pre-commit probe (`D/overlay-engine-strict-writes.test.cjs`). Verify: the linked-worktree hook test prints `fail 1` on the engine before `3ddeef925dd` and `pass 1` at main tip.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Keep the relayout backup, rollback and prune inside the printed contract (`E`). Verify: the new relayout tests in `D/overlay-engine-follow-up.test.cjs` fail on the unfixed engine and pass after. Done in `b3470354ab7`; `709646d2e7e` makes the restore-failed line name the skipped files. `relayout that fails writing its backup moves nothing and keeps no partial backup`, `relayout that cannot prune an emptied folder still reports the move` and `relayout whose rollback also fails says which copies the backup lacks` fail on the unfixed engine. The rollback-only and unremovable-backup tests already passed there, so they are regression guards.
- [x] T005 Contain the overlay folder setting and the manifest layout-link paths (`E`). Verify: the new setting and layout-link tests fail on the unfixed engine and pass after. Done in `8459961bbca`, `709646d2e7e`, `add6e839c6f`, `b439bdaeb59` and `93198d56023`. The later commits judge each layout-link path by where its parent resolves, and refuses a setting that resolves to the tree root. The tests added in `709646d2e7e`, such as `apply refuses a layout link whose parent folder is an in-tree link out of the tree`, fail on the `9cac789e095` engine and pass after, and each later commit's refusal tests fail on the engine before it.
- [x] T006 Pass `--end-of-options` before every manifest-derived git revision (`E`). Verify: the argument-recording test sees `--end-of-options` before the revision, and fails on the unfixed engine. Done in `8459961bbca`, with the test `a pinned commit is passed to git after --end-of-options`.
- [x] T007 [P] Rename the custom overlay folder value to `custom-overlays` (`D/overlay-engine-fixes.test.cjs`). Verify: `rg -n 'barter-overlays' D` prints nothing. Done in `8459961bbca`.
- [x] T008 [P] Correct the refusal, LAYOUT and relayout rows (`.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`). Verify: `rg -n 'refused by .pre-commit.' .skilled/commands/doctor/assets/doctor-overlay-presentation.txt` prints nothing. Done in `9cac789e095`, and `709646d2e7e` adds the layout-link refusal row.
- [x] T009 [P] Add the workflow rules for the new relayout lines and the `root/skilled` exception (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`). Verify: `rg -c 'writing the backup' .skilled/commands/doctor/assets/doctor-overlay-apply.yaml` prints 1 or more. Done in `9cac789e095` and `709646d2e7e`; it prints 1.
- [x] T010 [P] Correct the setting refusals and the relayout failure contract (`.skilled/skills/system-skilled-doctor/references/overlays.md`). Verify: `rg -n 'keeps its own check' .skilled/skills/system-skilled-doctor/references/overlays.md` prints nothing. Done in `9cac789e095`, `709646d2e7e` and `d5b258c32e8`.
- [x] T011 [P] Make the phase 003 residual-term search reproduce (`../003-engine-docs-and-release/goal.md`). Verify: the amended search prints nothing.
- [x] T012 [P] Name every phase child in the parent's last criterion (`../goal.md`). Verify: `rg -n 'every phase child' ../goal.md` prints one line.
- [x] T013 [P] Correct the stale delivery lines (`../007-barter-review-fixes/implementation-summary.md`, `../008-push-and-repin/implementation-summary.md`). Verify: `rg -n 'This folder is uncommitted|reaches origin with phase 008' ..` prints nothing.
- [x] T017 Name the staged tree root a later `status --root` reads when a re-pin stage copies a sibling overlay folder (`E`, `D/overlay-engine-repin.test.cjs`, `references/overlays.md`). Verify: `repin --stage with a sibling overlay folder names a staged tree root that status reads` fails on the unfixed engine and passes after. Done in `d5b258c32e8`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the gate set on the branch (`plan.md` §2). Verify: every gate exits 0 and the engine suite prints more than 263 tests. At `cf932dc7382`: engine 294/294, guard 20, contract 9, route-validate exit 0, release-update 95, deep-loop 341 over 11 files, trigger index exit 0.
- [x] T015 Pass an `@review` pass on the branch diff (`W`). Verify: the review's final status line reads approved, with no open P0 or P1. The fifth pass, at `93198d56023`, ended `Review status: APPROVED` with no P0 or P1. Its two P2s are Known Limitations in `implementation-summary.md`.
- [x] T016 Merge the branch into local main and rerun the gates (`main`). Verify: every gate exits 0 on main, and `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED`. Merged as `7ededf2efb1`, and the code gates match the branch. The trigger index `--check` exits 1 on main both before and after the merge, on the same 13 stale docs, eight of them other sessions'. It was not rebuilt, so their work stays out of this commit.
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
- **Review**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
