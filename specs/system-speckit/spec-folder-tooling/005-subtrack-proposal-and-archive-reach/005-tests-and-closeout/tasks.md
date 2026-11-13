---
title: "Tasks: Phase 5: tests-and-closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "tests and closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: tests-and-closeout

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/system-spec-kit`. `T` is `$K/runtime/cli/tests`. `PKT` is `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`. Every `npx vitest run` command runs in `$K/runtime/cli`. `CLONE` is a throwaway clone of the final commit with its own runtime build. Every `[EVIDENCE: ...]` note records a run the orchestrator observed on 2026-11-13, unless the note names another source. "By reading" means a closeout worker searched or read the five test files, which is not a run. The suites are in commit `5fefd819e1`, and commit `36b3a68ab7` added one empty-input case each to `relocate.vitest.ts` and `suggest-subtracks.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the baseline from phase 001 exists and read its counts (`$PKT/001-relocation-engine/scratch/baseline.txt`). Verify: `ls $PKT/001-relocation-engine/scratch/baseline.txt` prints the path. [EVIDENCE: the closeout worker read the file. Exit 0, 206 files passed and 3 skipped, 2524 tests passed and 20 skipped, 0 failed in every legacy stage]
- [x] T002 Read the temp-repo pattern and the tree builder before writing a suite (`$T/archive-track.vitest.ts`). Verify: `rg -n "export function buildSubtrackTree" $T/fixtures/subtrack-tree.mjs` prints line 68. [EVIDENCE: the closeout worker ran the search and it printed line 68. By reading: only `validate-archive-recursive.vitest.ts` imports the builder. The other four suites build their trees with their own helpers. `subtrack-tree.mjs` was not changed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the move, renumber and re-parent cases (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts` exits 0 with at least three passing cases. [EVIDENCE: the file held 11 cases at commit `5fefd819e1`, when the five new files together gave 31 passed, exit 0. It holds 12 since commit `36b3a68ab7`. By reading: one case each for the move into a sub-track, the renumber into a free number and the re-parent of a flat track into a declared sub-track]
- [x] T004 Add the preflight refusal cases: collision, mixed track, second subtrack level, bad name and dirty path (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts -t refus` exits 0 and each case asserts exit 2 and an unchanged tree. [EVIDENCE: five refusal cases pass inside the 11, each asserting exit 2 and an unchanged tree. The `-t refus` filter was not run by itself. By reading: the five case names cover an existing destination, a mixed track, two sub-track levels, a name that is not `NNN-slug` and uncommitted changes]
- [x] T005 Add the idempotence case and the inbound reference cases, including the prefix-id pair (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts` exits 0. [EVIDENCE: the cases include a dry run by default, a second apply that changes nothing and an inbound reference rewrite with the prefix-id pair. All pass]
- [x] T006 [P] Write the cluster map, threshold and present-time fit cases (`$T/suggest-subtracks.vitest.ts`). Verify: `npx vitest run tests/suggest-subtracks.vitest.ts` exits 0 with at least three passing cases. [EVIDENCE: 6 cases pass. By reading: the whole-track map, the threshold, a track that holds no packets, the present-time fit, a track that does not exist and an unchanged tree after a proposal. The empty-track case came with commit `36b3a68ab7`]
- [x] T007 [P] Write the archive numbering cases for specs root, track and subtrack depth (`$T/archive-numbering.vitest.ts`). Verify: `npx vitest run tests/archive-numbering.vitest.ts` exits 0 with three passing cases. [EVIDENCE: 4 cases pass: specs root, track, sub-track and a lower-only archive. By reading: the first three each expect `008-after-archive` beside a live `001-a` and an archived `007-b`]
- [x] T008 [P] Write the default-vector, archive-mode, label and JSON lane cases (`$T/rg-include-archive.vitest.ts`). Verify: `npx vitest run tests/rg-include-archive.vitest.ts` exits 0. [EVIDENCE: 6 cases pass. By reading: two recipe shape cases, three search behavior cases that skip when ripgrep is missing and one argument parsing case]
- [x] T009 [P] Write the recursive archive validation cases at track, subtrack and phase depth, plus the default run (`$T/validate-archive-recursive.vitest.ts`). Verify: `npx vitest run tests/validate-archive-recursive.vitest.ts` exits 0. [EVIDENCE: 5 of 5 pass. The suite runs the real `validate.sh` in temp trees. The track, sub-track and phase parent cases each assert the archived folder is reported with the flag and absent without it]
- [x] T010 Watch each new suite fail once by breaking one expectation, then restore it (`$T/relocate.vitest.ts`). Verify: each of the five suites printed at least one failure in that run and exits 0 after the restore. [EVIDENCE: source is the five build dispatches, not an orchestrator run. Each worker changed one expected value, saw its suite fail with 1 failed, restored it and saw it pass, with the failing output in its report. The orchestrator reran all five suites after the restore, 31 passed, and did not repeat the break]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the full suite and report the delta against the baseline (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline. [EVIDENCE: `scratch/final-npm-test.txt`, run at commit `f1cfed3d20`. Exit 0, 211 files passed and 3 skipped, 2558 tests passed and 20 skipped, 0 failed in every legacy stage. Baseline: 206 files and 2524 tests passed, 0 failed. Delta: 5 files and 34 tests more, 0 failures in both]
- [x] T012 Run the relocation checks on the real tree and a throwaway copy (`$K/runtime/cli/spec/relocate.mjs`). Verify: the dry run exits 1 with `git status --porcelain` unchanged, the apply in the copy exits 0 and the second run exits 0 with nothing to do. [EVIDENCE: real tree, `relocate.mjs --map 001-relocation-engine/scratch/sample-map.json` exited 1 with `moves=1 moved=0 rewrites=33 identity=1 roots=3 ledger=1`, and `git status --porcelain` was identical before and after. `CLONE`: `--apply` exited 0 with "applied 1 move(s)", sweep ok and validate `RESULT: PASSED` for the moved packet. A second `--apply` exited 0 with "nothing to do". An earlier attempt in a clone that borrowed the worktree's build failed at the repair step with "dist is stale". The same map rerun after a build finished the move with "finished 1 earlier move(s)", which also shows the resume path]
- [x] T013 Run the proposal check on a real flat track with more than eight packets (`$K/runtime/cli/spec/suggest-subtracks.mjs`). Verify: the emitted map passed to `relocate.mjs --map` exits 1 and not 2. [EVIDENCE: closed by `decision-record.md` ADR-001, on the operator's answer Q003 "Accept the fixture (Recommended)". No real flat track holds more than eight live packets. The largest, `cli-classifier`, holds 6. Observed on a fixture in place of a real track: in `CLONE` a committed 10-packet track `demo` gave `suggest-subtracks.mjs --track demo` exit 0 with a 10-entry map, and `relocate.mjs --map` on it exited 1 and not 2 with `moves=10 moved=0 rewrites=11 identity=10 roots=3 ledger=10`. The proposal has not run on a real track]
- [x] T014 Run the sweep and the trigger index check (`$K/runtime/cli/spec/sweep-track-roots.mjs`). Verify: the sweep exits 0 apart from the known `ai-systems` drift and `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0. [EVIDENCE: `sweep-track-roots.mjs` on this worktree exited 0 with "all track roots match their declared children" and no missing-archive line. The trigger index was regenerated and committed as `f1cfed3d20`, and `generate-trigger-index.mjs --check` then exited 0 with 0 untrusted docs]
- [x] T015 Run `/speckit:search` with and without the archive mode on a phrase that lives only in `specs/sk-doc/z_archive/` (`.skilled/commands/speckit/search.md`). Verify: the run without the mode returns no hit and the run with it returns a hit labeled `archived`. [EVIDENCE: `rg-wrapper.mjs path "skill routing refactor"` exits 1 with 0 paths. With `--include-archive` it exits 0 with 2 paths under `specs/sk-doc/z_archive/019-skill-routing-refactor/`, each ending `[archived]`. Reworded: this is the wrapper `/speckit:search` documents, run directly. The slash command itself was not run]
- [x] T016 Fill the implementation summary of each child from its evidence (`$PKT/001-relocation-engine/implementation-summary.md` and the four sibling files). Verify: `rg -o '\[YOUR_VALUE_HERE:' $PKT/*/implementation-summary.md` prints nothing. [EVIDENCE: run by the closeout worker on 2026-11-13 after the last summary edit. It printed nothing]
- [x] T017 Mark each acceptance row with its observed evidence in every child (`$PKT/005-tests-and-closeout/acceptance-criteria.md` and the four sibling files). Verify: `rg -c "\| Unmet \|" $PKT/*/acceptance-criteria.md` prints nothing. [EVIDENCE: run by the final closeout worker on 2026-11-13 after the last acceptance edit. It printed nothing. AC-002 of phase 004 and AC-009 of this phase are `Met` on the trigger index check at `f1cfed3d20`, and AC-008 of this phase is `Superseded` by ADR-001]
- [x] T018 Validate the whole packet (`$PKT/spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh $PKT --strict --recursive` prints `RESULT: PASSED` for the parent and all five children. [EVIDENCE: run by the final closeout worker on 2026-11-13 after the last document edit. It printed `RESULT: PASSED` six times]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T013 closed on ADR-001, T014 on the trigger index check at `f1cfed3d20` and T017 on an empty `Unmet` search
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The relocation, sweep and search runs passed, and the trigger index check exited 0 at `f1cfed3d20`. The proposal check ran on a fixture and not on a real track, which ADR-001 accepts
- [x] The five new suites pass alone and inside `npm test`. The five files run together gave 31 passed, exit 0, at commit `5fefd819e1`. They hold 33 cases since commit `36b3a68ab7`, and the full `npm test` run at `f1cfed3d20` exited 0 with 0 failed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with its reason in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: `spec.md` section 4 holds REQ-001 to REQ-011]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: `plan.md` sections 3 and 4]
- [x] CHK-003 [P1] Phases 001 to 004 handed off and the baseline file exists. [EVIDENCE: the baseline file exists and the `acceptance-criteria.md` of each of phases 001 to 004 says `Closeable: Yes`. The handoff check of phase 004, `generate-trigger-index.mjs --check`, exited 0 with 0 untrusted docs after the index was committed as `f1cfed3d20`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each new suite builds its own temp repository and removes it. [EVIDENCE: by reading, each of the five files creates its root with `fs.mkdtempSync` under `os.tmpdir()` and removes it with `fs.rmSync`]
- [x] CHK-011 [P0] No new suite runs `git mv` or writes in the real repository. [EVIDENCE: by reading, a search of the five files for `git mv` printed nothing. Run by the closeout worker after the suites: `git status --porcelain` on the worktree listed only `scratch/final-npm-test.txt` of this phase. The `git mv` calls of `relocate.mjs` run inside the temp repository of `relocate.vitest.ts`]
- [x] CHK-012 [P1] No case re-asserts a framework or language guarantee. [EVIDENCE: by reading. The orchestrator read every assertion of `validate-archive-recursive.vitest.ts` and `archive-numbering.vitest.ts`. The final closeout worker read every line of `relocate.vitest.ts`, `rg-include-archive.vitest.ts` and `suggest-subtracks.vitest.ts` at `f1cfed3d20`, with 12, 6 and 6 cases. Each case asserts an exit code, the output of the script under test, the argument vector a recipe builds or the tree on disk. None asserts only what vitest, Node or the language guarantees. Noted: three cases of `rg-include-archive.vitest.ts` skip when ripgrep is missing]
- [x] CHK-013 [P1] No test comment names a spec path, a task id or a requirement id. [EVIDENCE: by reading, a search of the five files for `REQ-`, `AC-0`, `CHK-`, a `T0` task id and the packet path printed nothing]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. [EVIDENCE: 10 of the 11 rows of `acceptance-criteria.md` are `Met` and AC-008 is `Superseded` by ADR-001 in `decision-record.md`. No row blocks closure, and the closure statement says `Closeable: Yes`]
- [x] CHK-021 [P0] Each new suite was seen failing once before its pass was accepted. [EVIDENCE: source is the five build dispatches. Each worker changed one expected value, saw 1 failed, restored it and saw the pass, with the failing output in its report. The orchestrator reran all five suites after the restore, 31 passed, and did not repeat the break]
- [x] CHK-022 [P1] The prefix-id and the empty-map edge cases are covered. [EVIDENCE: the prefix-id pair is covered by the inbound reference case of `relocate.vitest.ts`. Commit `36b3a68ab7` added "treats an empty map as nothing to do" to `relocate.vitest.ts` and "prints no map for a track that holds no packets" to `suggest-subtracks.vitest.ts`. Both pass. The files hold 12 and 6 cases]
- [x] CHK-023 [P1] Each preflight refusal asserts exit 2 and an unchanged tree. [EVIDENCE: the five refusal cases of `relocate.vitest.ts` pass, each asserting exit 2 and an unchanged tree]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds tests and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No suite reads a credential or a `.env` file. [EVIDENCE: by reading, the one `.env` string in the five files is `absent-hook-flags.env` in `validate-archive-recursive.vitest.ts`, a path inside the temp root that points at a file that does not exist]
- [x] CHK-031 [P0] No suite reads or writes outside its temp directory. [EVIDENCE: by reading, every tree a suite builds sits under its `mkdtempSync` root. After the suites ran `git status --porcelain` on the worktree listed only `scratch/final-npm-test.txt` of this phase. Reworded: each suite loads the script under test from the repository, which is a read outside the temp directory]
- [x] CHK-032 [P1] N/A: the suites have no auth surface. [EVIDENCE: by reading, no suite takes a credential or opens a network connection]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. [EVIDENCE: `spec.md`, `plan.md` and this file all name the five suites as built, the fixture that ADR-001 accepts in place of a real flat track, the stubbed follow-up tools in `relocate.vitest.ts` and the trigger index check that exited 0 at `f1cfed3d20`]
- [x] CHK-041 [P1] Completion state agrees across `spec.md`, the acceptance rows and `implementation-summary.md` in every child. [EVIDENCE: set by the final closeout worker on 2026-11-13. In all five children `spec.md` says Status Complete, the metadata Status of `acceptance-criteria.md` says Complete and its closure statement says `Closeable: Yes`. The parent `spec.md` says Complete and its phase map says Complete for each phase. `repair-derived.cjs --roots <folder> --apply` ran after each status edit. In phases 001 to 003 only that one field was edited, with one exception. In `003-subtrack-archive-and-numbering/acceptance-criteria.md` the pipe inside the code span of the AC-003 Verification cell was escaped, because the closure rule read the unescaped pipe as a cell border and reported the row as unmet once the phase said Complete. No word of the row changed. Left as it was: the six unticked gate boxes in `001-relocation-engine/plan.md`]
- [x] CHK-042 [P2] The parent Phase Documentation Map shows each phase status. [EVIDENCE: the Status column of the map in `../spec.md` names each phase's state]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Sample maps and run output live in `scratch/` only. [EVIDENCE: the sample map is `../001-relocation-engine/scratch/sample-map.json` and the final run output is `scratch/final-npm-test.txt`. `git status --porcelain` listed no other new file]
- [x] CHK-051 [P1] The throwaway copy is removed before completion. [EVIDENCE: the orchestrator deleted the clone with `rm -rf`, and `ls` on its path then printed "No such file or directory"]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
