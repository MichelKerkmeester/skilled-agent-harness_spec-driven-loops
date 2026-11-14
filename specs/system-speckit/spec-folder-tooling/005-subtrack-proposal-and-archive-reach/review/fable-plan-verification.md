**READY WITH FIXES.** Phases 012 and 013 can be built after small edits. Phase 011 needs three requirement changes before its first test is written. There is no P0 and no finding without a home.

Every code finding below is from reading the source, not from running the failing case. `C` is `.skilled/skills/system-spec-kit/runtime/cli`.

## Coverage

Every P1 and P2 row of both reviews maps to one requirement, and the merged registry holds no file the plans omit. Two homes are only partial:

- **DeepSeek P1 3** (`spec/README.md:114`): 013 REQ-002 names status 3 in its text, but its check greps only `flat packets`.
- **Fable 9**: already fixed during planning, and 013 REQ-007 still describes the old target.

## P1 findings

**1. 011 `spec.md:137`, `plan.md:60`, `tasks.md:52-53`: REQ-004 fixes a case that cannot occur, with a test that cannot run.**
- Evidence: `relocate.mjs:61` sets `SPECS = path.join(REPO, 'specs')` and the script reads no environment variable or flag for it. `path.basename(SPECS)` is therefore always the literal `specs`.
- A folder named `SPECS` on a case-sensitive volume stops at `relocate.mjs:1734` with a usage error, before the probe runs. The script exports nothing, so no unit case can call `volumeFoldsCase`.
- On this APFS machine T010 only prints its skip reason, so it passes with no proof. That breaks frozen decision D2 (`goal.md:45`).
- Fix: move Fable 6 to Out of Scope with the reason "unreachable, the probe flips a constant". Or keep the one-line change and exempt it from D2 in writing.

**2. 011 `spec.md:129`, `plan.md:57`, `plan.md:87`: REQ-001 is incomplete in three ways.**
- The named injection does not exist. `stubFailsOnce` (`tests/relocate.vitest.ts:49`) replaces a child tool, and the rewrite step is in-process (`relocate.mjs:1583-1592`). A hand `git mv` before the run reproduces the state, as the case at `relocate.vitest.ts:848` already does.
- `relocate.mjs:860` reads the moved child's `spec.md` at `entry.from`, which is gone for a done entry. The child's Predecessor and Successor rows are never planned unless the path switches to `entry.to`, as `:702` does.
- Rewrites are written in path order. If the run stops after the old parent's `spec.md` and before the new parent's, `:818` finds no old row and the new parent never gets its map row. The requirement promises that row.
- Fix: write the new parent's files before the old parent's, name the child path, and add a case that stops between the two parents. Extend the acceptance to the sibling neighbour rows and the binding row, which it does not check today.

**3. 011 `spec.md:135`, `plan.md:58`, `goal.md:59`: REQ-002 creates an exit 2 that a rerun cannot finish.**
- Evidence: `closeRun` marks the sweep step at `relocate.mjs:1651`, before the validation loop. After a run where the validator never ran, the rerun has no work at `:1797` and exits 0 with `nothing to do`. Validation is never retried.
- `archive.sh:443` would then print "Restore did not finish" for a restore whose folder and records all landed. That is the misreport DeepSeek ranked "fix first", in the other direction.
- Fix: leave the close open when no `RESULT` line was read, so the rerun validates again, and assert that rerun. State that 2 outranks 3 across entries. Add the `archive-track.vitest.ts` case the acceptance names, because no task writes it.

## P2 findings, phase 011

- **`tasks.md:37`, T002 lists the wrong segment.** I ran it. It prints the prefix before the first numbered folder (track paths) and cuts at 30 lines. A variant that prints the segment directly before the name shows 5715 hits behind a numbered parent, 1815 behind `..` and 87 behind `...`.
- **`spec.md:136`, REQ-003 leaves out the commonest form.** The acceptance never tests `<parent>/003-gamma`, so dropping it would pass. `bareNamePattern` also has three call sites (`:746`, `:989`, `:1096`) and none holds the parent name.
- **`spec.md:138`, REQ-005 matches the preflight rule, with two narrow gaps.** The shell check skips the container-name character rule (`relocate.mjs:215`) and adds a "track has no `spec.md`" test (`archive.sh:205`). The plan should also say whether the guard at `archive.sh:371` stays.
- **`goal.md:61` and `plan.md:61` misdescribe the code.** The suite has one mixed-track refusal case, not two, and the second case exits 0. The loop is at lines 386 to 392, not 385 to 391.
- **`tasks.md:38` and `:66`, no full-suite baseline.** T003 saves three suites, yet T017 compares `npm test` against "the baseline". Separately, T019's `git diff` is empty once the work is committed.

## P2 findings, phase 012

- **`goal.md:59` passes today.** `rg -n 'relocate.mjs --map'` already prints line 19 of the proposal playbook.
- **`tasks.md:50`, T008 is one line from passing.** The count is already 2, so adding any one of the three terms satisfies "3 or more".
- **`spec.md:135`, REQ-008 needs fixture work the plan does not mention.** The playbook sandbox has no git repository and no track `graph-metadata.json`, and `relocate.mjs` has no `--specs` flag. As written the step exits 2 at `relocate.mjs:1774` or `:439`, not 1.

## P2 findings, phase 013

- **Three checks pass before any work.**
  - `spec.md:129`: `rg 'NNN-slug'` on `folder-structure.md` matches line 143.
  - `spec.md:135`: `rg 'status 3|exit 3'` on the skill `README.md` matches line 162.
  - `spec.md:150`: the recursive validation printed `RESULT: PASSED` 14 times when I ran it, exit 0.
- **`spec.md:139`, REQ-007 is stale.** Line 13 of the decision record now reads "Q010 to Q018", so a literal search for Q015 fails. Compare against the highest Q id in the file.
- **`spec.md:128`, the REQ-001 fixture hides a number bug.** `z_archive/007-b` cannot expose a command that fails on `008` or `009` under shell arithmetic. Use `008-b`, and state that both folders sit in `specs/demo`.
- **`spec.md:170`, the open question is answered.** `create.sh` has no print-only flag, and its rule is at `create.sh:1637-1661`. It also counts numbered branches when there is no track, so an `ls` can match it only per track.
- **Commit `0701a31ae5` touches a third file.** `skill-graph.json` changed too, and REQ-008 adds only two files to the manifest.

## P2 findings, across phases

- **Task ids in the specs do not match the task files.**
  - 011 `spec.md:136` and `plan.md:38-39` are off by one against `tasks.md`.
  - 012 `spec.md:137` says T011 runs the validators, and it is T013.
  - 013 `spec.md:141` and `:160` say T013 and T014, and they are T014 and T016.
- **No phase owns the wording REQ-002 changes.** `spec/README.md:120` and the header at `relocate.mjs:35-40` describe exits 2 and 3. Give the header to 011 and the README line to 013 T007.

## Plan claims checked and found true

**Code lines, phase 011**
- `relocate.mjs:779` filters to pending entries, `:1578-1583` runs the move before the rewrite, and `:1301` is `recordedMove`.
- `relocate.mjs:755`, `:980`, `:476` and `:1659-1666` are the four functions the plan names, and `:1661` sets status 3.
- `archive.sh:363` is the mixed-track check, `:375` returns early for a sub-track, `:437` reads status 3 and `:83` is in the help notes.
- A finished entry produces no rewrite: each row operation checks first, and `relocate.mjs:1403` drops a file with zero changes.
- Every failing validator stub in the three suites prints `RESULT: FAILED`, so REQ-002 breaks no current case.

**Document lines, phases 012 and 013**
- All ten catalog and playbook lines cited in 012 hold the text described.
- All nine skill-document lines cited in 013 hold the text described, including `SKILL.md:5`, `:295` and `:317`.
- `suggest-subtracks.mjs:296` prints the NNN-slug refusal and `rg-wrapper.mjs:382` writes `archivedPaths`.
- Every 012 catalog check and the 011 help check print nothing today, so each can fail.
- The evidence files Fable listed are missing. `baseline.txt` is also missing in 007, 008 and 010, which REQ-006's wording covers.

**Tooling**
- The vitest binary, its config, the `npm test` script and the drift checker with its `[alignment-drift] PASS` string all exist.
- The sk-doc validators exist per page: `validate_document.py`, `validate-playbook-package.cjs` and `check_changelog_shape.py`.
- `v2.13.1.0` is the patch bump the changelog mode computes, and the skill's `changelog/` is the global target through a symlink.
- The parent has 13 children, so 14 is the right count.
- The existing refusal case expects `--to demo/sub/009-old`. I infer from that string that the fixture sub-track is declared, so the shell-only check keeps it passing.

## Status

- **Not run:** no vitest suite, and nothing in a scratch copy. Findings 1 to 3 would be confirmed by the cases their fixes name.
- **Repository state:** unchanged, 16 status entries before and after. I wrote one temp file under `/tmp` to count validation lines and deleted it.
- **Deviations:** I did not load the sk-code review mode or its resolver, because no code diff was under review. Plan mode asked for a plan file and the dispatch said write nothing, so I wrote none.
- **Yours to do:** edit the three 011 requirements before the build starts. The P2 items can be fixed alongside.

VERIFY_DONE
