---
title: "Tasks: Phase 10: real-pipeline-tests"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "real pipeline tests tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: real-pipeline-tests

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

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `NEW` is `tests/relocate-real-pipeline.vitest.ts`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. Build it by copying `.skilled` without any `node_modules` folder and linking `.skilled/skills/system-spec-kit/node_modules`, which is 504M, into the copy. `GUARD` is `git status --porcelain -- specs .skilled/skills/sk-doc/shared/scripts .skilled/skills/system-spec-kit/runtime/data .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures`. `MUTANT` is the `relocate.mjs` in `SCRATCH` with its call to `migrate-generated-json` removed. No run touches the real `specs/` tree.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce A10 in `SCRATCH`: run the two existing suites against `MUTANT` and save the output and exit status (`scratch/reproduce.txt`). Verify: the file holds the `Tests` line and `exit=0` for `V tests/relocate.vitest.ts tests/archive-track.vitest.ts` run in `SCRATCH`, or states the difference from the review. Evidence: scratch/reproduce.txt, with the difference from the review stated.
- [x] T002 List what each of the six true writers loads from outside its own folder, whether it writes under the working directory or under its own location, and whether `tests/fixtures/subtrack-tree.mjs` can be extended (`scratch/writer-inputs.txt`). Verify: the file has one section per writer, `repair-derived`, `migrate-generated-json`, `validate`, `sweep-track-roots`, `generate-trigger-index` and `cite-drift-scan`, so `rg -c '^## ' scratch/writer-inputs.txt` prints 6 or more, and the file ends with one line that says whether every path a writer writes sits under the four paths of `GUARD`. Evidence: The writer list is in scratch/build-evidence.md, worker report 010a.
- [x] T003 Measure one apply with the true writers in `SCRATCH` (`scratch/timing.txt`). Verify: the file holds the `time` output of one `relocate.mjs --map <sample> --apply` that exits 0. Evidence: Deviation: no timing.txt. The suite durations stand in: about 9 s for one case, 30.6 s for four.
- [x] T004 Save the full suite baseline before any edit (`scratch/baseline.txt`). Verify: the file holds the `Test Files` and `Tests` lines of `cd $C && npm test` and its exit status. Evidence: Baseline before 010: full CLI suite 2599 passed, 0 failed (after phase 009).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Build the temp repository the true writers run against, with a copy of each writer that T002 shows writing under its own location (`$C/tests/fixtures/subtrack-tree.mjs`). Verify: a throwaway script that calls the builder prints a path under the OS temp folder, and `git -C <that path> status --porcelain` prints nothing after the builder's commit. Evidence: scratch/build-evidence.md, worker report 010a.
- [x] T006 Add the guard that compares the output of `GUARD`, run in the checkout the suite sits in, before and after the file runs (`$C/$NEW`). Verify: `V $NEW` exits 0, and in `SCRATCH`, with one line added that writes a file under that copy's `specs/`, it exits 1 and names the path. Evidence: scratch/build-evidence.md, worker report 010a.
- [x] T007 Add the happy-path case: apply a sub-track map twice and read the stores the writers wrote (`$C/$NEW`). Verify: `V $NEW` exits 0, and against `MUTANT` it exits 1 and names the `parentChain` assertion. Evidence: scratch/build-evidence.md, worker report 010a; mutation check in scratch/mutation.txt.
- [x] T008 Add the resume case for a late step that fails once, through a wrapper around the true `cite-drift-scan.mjs` (`$C/$NEW`). Verify: `V $NEW` exits 0, and with phase 006 reverted in `SCRATCH` the case fails on the missing `step redirect table (cite-drift-scan --rebuild-redirects): ok` line. Evidence: scratch/build-evidence.md, worker report 010b.
- [x] T009 Add the resume case for the identity step that fails once, through a wrapper around the true migrate script (`$C/$NEW`). Verify: `V $NEW` exits 0, and with phase 006 reverted in `SCRATCH` the case fails on the `parentChain` assertion. Evidence: scratch/build-evidence.md, worker report 010b.
- [x] T010 Add the renumbering restore case through `archive.sh` and the true writers (`$C/$NEW`). Verify: `V $NEW` exits 0 and the case asserts the new id in `description.json` and `graph-metadata.json`. Evidence: scratch/build-evidence.md, worker report 010b; 4 passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the mutation check and record both runs (`scratch/mutation.txt`). Verify: the file shows `V $NEW` exit 0 on the committed scripts and exit 1 against `MUTANT`, with the failing assertion named. Evidence: scratch/mutation.txt.
- [x] T012 Confirm the real checkout is unchanged by the suite (`$C/$NEW`). Verify: `GUARD` prints the same lines before and after `V $NEW`. Evidence: The guard runs in afterAll and passed on every run.
- [x] T013 Run the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $C && npm test` exits 0, its failed count is not above the baseline and its passed count is the baseline count plus the new cases. Evidence: Full CLI suite 2603 passed, 0 failed, exit 0.
- [x] T014 Confirm no added code comment names a spec path, a packet number or a finding id (`$C/$NEW`). Verify: `git diff -U0 -- $C/tests` shows no added comment line with such a label. Evidence: Added comment lines checked: no spec path, packet number or finding id.
- [x] T015 Validate the parent and every phase (`../spec.md`). Verify: `bash $C/spec/validate.sh <parent folder> --strict --recursive` prints `RESULT: PASSED` for the parent and each of the ten children. Evidence: validate.sh --strict --recursive on the parent prints RESULT: PASSED 11 times.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/mutation.txt` shows the suite passing on the committed scripts and failing against `MUTANT`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../scratch/review-20261114-core-code.md`
<!-- /ANCHOR:cross-refs -->

---
