---
title: "Tasks: Phase 11: relocate-and-restore-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relocate and restore fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: relocate-and-restore-fixes

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

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `R` is `node $C/spec/relocate.mjs`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. No run touches the real `specs/` tree. Every Verify that names a saved file writes that file in this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce F1 in `SCRATCH`: a re-parent of a phase between two phase parents, stopped after the move by a `git mv` made before the run, then the relocate run, and save the commands, outputs and both parents' rows (`scratch/reproduce-f1.txt`). Verify: the file shows the run's exit status and whether `<parentA>/spec.md` still names the moved phase, or records that the run already fixes it. Evidence: scratch/reproduce-f1.txt. Reproduced as the two failing-first cases of T004 rather than a separate copy: before the fix the old parent kept `003-gamma` and the new parent had no map row.
- [x] T002 List the segment written directly before every bare phase name in phase parents' `spec.md` and `goal.md` and children's `spec.md` (`scratch/bare-name-prefixes.txt`). Verify: the file holds the full output of `rg -o --no-filename '[^ |(/]*/[0-9]{3}-[a-z0-9-]+' specs --glob 'spec.md' --glob 'goal.md' | sed -E 's#/[0-9]{3}-[a-z0-9-]+$##' | sed -E 's#^[0-9]{3}-.*#<numbered>#' | sort | uniq -c | sort -rn`, not cut short. Evidence: scratch/bare-name-prefixes.txt, 508 lines.
- [x] T003 Save the suite baselines before any edit (`scratch/baseline.txt`). Verify: the file holds the `Tests` line of `V tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts` with `exit=0`, and the `Tests` line and exit status of `npm test` from `$C`. Evidence: scratch/baseline.txt: three suites 105 passed, exit 0; npm test 2603 passed, 0 failed, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the two failing re-parent cases: folder moved with no row rewritten, and folder moved with the old parent already rewritten (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the two new cases only. Evidence: scratch/worker-011a.md: 2 failed, 33 passed before the fix.
- [x] T005 Plan phase-row edits for a done re-parent while a row is stale, read the moved child at `entry.to`, and write the new parent before the old one (`$C/spec/relocate.mjs`). Verify: `V tests/relocate.vitest.ts` exits 0, the new cases assert the map, binding and neighbour rows, and the clean re-parent case still ends on `relocate: nothing to do`. Evidence: orchestrator rerun 107 passed, exit 0; the clean re-parent cases still end on nothing to do.
- [x] T006 Add the failing cases for a validator that prints `RESULT: FAILED`, one that prints nothing once, and a two-entry map with one of each (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the no-`RESULT` and mixed cases only. Evidence: scratch/worker-011b.md: the no-`RESULT` and mixed cases failed before the fix (3 failed, 108 passed), the `RESULT: FAILED` case passed.
- [x] T007 Set exit 3 only on a `RESULT: FAILED` line, keep the close open when no `RESULT` line was read, let 2 outrank 3, and state this in the header comment (`$C/spec/relocate.mjs`). Verify: `V tests/relocate.vitest.ts` exits 0, and the no-`RESULT` rerun case validates again and exits 0. Evidence: orchestrator rerun 112 passed, exit 0. A validator that exits 0 with no `RESULT` line counts as reported, so the close still ends on nothing to do (follow-up case in scratch/worker-011b.md).
- [x] T008 Add the restore case for a relocate run that ends without a `RESULT` line (`$C/tests/archive-track.vitest.ts`). Verify: `V tests/archive-track.vitest.ts` exits 0 and the case asserts `Restore did not finish`. Evidence: scratch/worker-011b.md: the archive case failed before the fix and passes after; orchestrator rerun 112 passed, exit 0.
- [x] T009 Add the failing case with `other-track/003-gamma`, `005-p/003-gamma`, `./003-gamma/` and `../003-gamma/spec.md` in one parent (`$C/tests/relocate.vitest.ts`). Verify: `V tests/relocate.vitest.ts` fails on the foreign-name assertion only. Evidence: scratch/worker-011d.md: 1 failed (the foreign-name assertion only), 112 passed before the fix.
- [x] T010 Bound the bare-name pass by the segments T002 found, passing the parent name at all three call sites (`$C/spec/relocate.mjs`). Verify: `V tests/relocate.vitest.ts` exits 0. Evidence: orchestrator rerun 113 passed, exit 0. The parent name reaches all three call sites through `bareNameEdits`, one parent per file.
- [x] T011 Add the failing case that a restore into a flat track runs no `relocate.mjs` before its move (`$C/tests/archive-track.vitest.ts`). Verify: `V tests/archive-track.vitest.ts` fails on the new case only. Evidence: scratch/worker-011e.md: the new case failed before the fix, the stub recorded `--from flat/z_archive/002-old --to flat/002-old`.
- [x] T012 Decide the mixed-track refusal in the shell by the preflight's rule and drop the dry run (`$C/spec/archive.sh`). Verify: `V tests/archive-track.vitest.ts` exits 0, with the refusal case at line 645 exiting 1 and the flat-track case at line 666 exiting 0. Evidence: orchestrator rerun 115 passed, exit 0; the refusal case still exits 1 and both flat-track cases exit 0. The shell name rule now matches `CONTAINER_NAME` in relocate.mjs.
- [x] T013 Add the two help lines and a case that greps for them (`$C/spec/archive.sh`). Verify: `bash $C/spec/archive.sh --help | rg -c 'flat packets|own validation'` prints 2. Evidence: `bash archive.sh --help | rg -c` printed 2; the help case passes in the 115.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the T001 reproduction against the changed script (`scratch/after-f1.txt`). Verify: the run exits 0 with both parents' rows correct, and the next prints `relocate: nothing to do`. Evidence: scratch/after-f1.txt: both cases pass, exit 0, each asserting both parents' rows and `relocate: nothing to do` on the next run.
- [x] T015 Run the three suites and compare with the baseline (`scratch/baseline.txt`). Verify: `V tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts` exits 0 and its passed count is the baseline plus the new cases. Evidence: three suites 115 passed, exit 0; baseline 105 plus 10 new cases.
- [x] T016 Run the full CLI suite against its baseline (`scratch/baseline.txt`). Verify: `npm test` from `$C` exits 0 with no failure absent from the T003 baseline. Evidence: third run 212 files, 2613 passed, 0 failed, exit 0 (baseline 2603). Run 2 failed one case on a fixture copy race, recorded in implementation-summary.md Known Limitations.
- [x] T017 Run the sk-code-skilled drift check (`$C/spec/relocate.mjs`). Verify: `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root $C/spec` prints `[alignment-drift] PASS`. Evidence: `[alignment-drift] PASS`, exit 0.
- [x] T018 Before the commit, confirm no added code comment names a spec path, a packet number or a finding id (`$C/spec/relocate.mjs`). Verify: `git diff -U0 -- $C/spec $C/tests`, run on the uncommitted change, shows no added comment line with such a label. Evidence: added comment lines scanned for spec paths, packet numbers and finding ids; none found.
- [x] T019 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED (errors=0 warnings=0)` after the derived metadata was re-derived; the recursive parent run printed 14 `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `scratch/after-f1.txt` shows a finished rerun of the stopped re-parent
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../review/fable-5-2-review.md` and `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
