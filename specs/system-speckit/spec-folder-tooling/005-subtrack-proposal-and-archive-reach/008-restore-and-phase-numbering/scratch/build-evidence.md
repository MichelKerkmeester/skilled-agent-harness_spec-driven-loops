# Build evidence, 2026-11-14

Each change was written test first by DeepSeek V4.1 Flash (max) through dsh. Worker reports below include the failing run before each fix. The orchestrator reran the relocate, archive and numbering suites after every change and the full CLI suite at the end.

## Worker report 008a

Implemented REQ-001 / T004–T005.

## Changes

**`$C/spec/create.sh`** — no named function; changed the `APPEND_TO_EXISTING_PARENT` phase-numbering block:
- `_highest_phase` scans both `[0-9][0-9][0-9]-*/` and `z_archive/[0-9][0-9][0-9]-*/`, so the next number clears every live and archived phase.
- `_highest_live` updates `LAST_EXISTING_PHASE` only from live folders, so the Predecessor never names an archived phase.
- `EXISTING_PHASE_COUNT` now carries that high-water mark, keeping `TOTAL_PHASES` consistent (e.g. `Phase 3 of 3`, not `3 of 2`).

**`$C/tests/archive-numbering.vitest.ts`** — added a describe block using the file's existing `packet`, `archive`, and `create` helpers:
- `skips a number held by an archived phase and keeps a live predecessor`
- `numbers after a live phase when the archive holds only a lower number`

## Failing run before the fix

Relevant output from `tests/archive-numbering.vitest.ts`:

```text
× skips a number held by an archived phase and keeps a live predecessor 573ms
AssertionError: expected false to be true
 ❯ tests/archive-numbering.vitest.ts:145:38
    145|     expect(fs.existsSync(childSpec)).toBe(true);
Test Files  1 failed (1)
     Tests  1 failed | 5 passed (6)
exit=1
```

The lower-archive case passed before the fix, as required.

## Final runs

Requested suite, exit 0:

```text
Test Files  3 passed (3)
     Tests  100 passed (100)
```

Additional phase-mode create suites (`create-root-numbering`, `create-without-build`, `scaffold-passes-its-own-gate`, `create-track-refresh`), exit 0:

```text
Test Files  4 passed (4)
     Tests  52 passed (52)
```

`bash -n spec/create.sh` → exit 0. `git diff --check` → exit 0.

Throwaway T005 reproduction:

```text
child folders:
specs/001-parent/001-alpha/
specs/001-parent/003-delta/
predecessor:
29:| **Predecessor** | 001-alpha |
phase row:
28:| **Phase** | 3 of 3 |
```

## Defect / open question

None found. One deliberate semantic point: `TOTAL_PHASES` now uses the live-or-archived high-water mark, so a parent with live `001-alpha` and archived `002-gamma` labels the new child `Phase 3 of 3`. That keeps absolute numbering coherent; the alternative (live count only) would have produced `Phase 3 of 2`. No commit was made.

## Worker report 008b

## What changed

**`spec/relocate.mjs`**
- `closeRun(plan)` — now returns a status instead of a boolean: `0` when the sweep and every moved-packet validation pass, `3` when the sweep passed and only packet validation failed, `2` when the sweep failed (a failed step already returns `2` from `applyPlan`). The move has landed when only the packet's own verdict fails.
- `main()` — returns `closeRun(plan)` directly so status `3` reaches the caller.
- Header exit-code block now lists status `3` and the rerun behaviour.
- Added comments explain why a packet verdict is distinct from an unfinished step. No comment names a spec path, packet number or id.

**`spec/README.md`**
- The `relocate.mjs` row now states `exit 3` for a run whose steps and close sweep landed with only a moved packet's own validation failing, and that a rerun after status 3 finds nothing to do. `rg -c 'exit 3'` → `1`.

**`spec/archive.sh`**
- `restore_on_next_number()` — captures the node status with `status=0; node … || status=$?` so `set -e` cannot abort before the status is read. On `3` it prints the normal `Restored:` line plus one warning naming the restored path and its failed validation, then exits `0`. Any other non-zero still prints `Restore did not finish` and exits `1`.

**Test helpers**
- `installRestoreTools()` in `archive-track.vitest.ts` now accepts optional `repairDerived` / `validate` stub bodies.

## Tests added

`tests/relocate.vitest.ts`
- `returns 3 when a finished map leaves only the moved packet validation failing`
- `returns 2 when a step fails beside the moved packet validation`

`tests/archive-track.vitest.ts`
- `reports a renumbered restore as done when only the packet validation failed`
- `keeps the restore failure when a relocation step fails`

Deliberately updated the previous-phase case `does not keep the map open when the moved packet validation fails`: run 1 now expects `3` instead of `2`, because this requirement changes that outcome.

## Failing run before the fix

Three failures, exactly the new/updated cases (the two repair-failure guards passed):

```text
FAIL  |cli| tests/relocate.vitest.ts > relocate resume > does not keep the map open when the moved packet validation fails
FAIL  |cli| tests/relocate.vitest.ts > relocate resume > returns 3 when a finished map leaves only the moved packet validation failing
FAIL  |cli| tests/archive-track.vitest.ts > archive.sh with tracks > reports a renumbered restore as done when only the packet validation failed

: expected 2 to be 3 // Object.is equality
❯ tests/relocate.vitest.ts:781:55

close validate specs/zeta/005-old: RESULT: FAILED
ERROR: Restore did not finish. Read the report above, then rerun: node .../relocate.mjs --from zeta/z_archive/001-old --to zeta/005-old --apply
: expected 1 to be +0 // Object.is equality
❯ tests/archive-track.vitest.ts:203:58

 Test Files  2 failed | 1 passed (3)
      Tests  3 failed | 101 passed (104)
exit=1
```

## Final run

```text
 Test Files  3 passed (3)
      Tests  104 passed (104)
exit=0
```

Also checked: `bash -n spec/archive.sh` and `node --check spec/relocate.mjs` both exit 0; no writes landed in the real `specs/` tree.

No defects found. Note: `spec/create.sh` and `tests/archive-numbering.vitest.ts` already had uncommitted changes in this worktree before I started; I left them untouched.

## Worker report 008c

## What changed

Only the two files the task names (not committed). Note: `git status` also shows pre-existing modifications from earlier phases (`README.md`, `create.sh`, `relocate.mjs`, `archive-numbering.vitest.ts`, `relocate.vitest.ts`); I did not touch those.

**`$C/spec/archive.sh`**
- `refuse_mixed_track_restore()` (line 363): asks `relocate.mjs` for a dry run of the same `--from`/`--to` move, captures combined output and status with the `set -e`-safe `status=0; … || status=$?` pattern, and returns silently unless that output contains `would hold flat packets`. On that one verdict it prints an error naming the track plus `node …/relocate.mjs --from <source> --to <track>/<sub>/NNN-slug --apply` and exits 1. Every other preflight result is ignored; no sub-track predicate was added — only the existing `is_declared_subtrack` is reused to name a sub-track in the suggested command.
- `restore_spec()` (line 745): calls it after all existing pre-move checks and before the number-holder branch and the `mv`, so both the plain and `restore_on_next_number` paths are covered before anything moves.

**`$C/tests/archive-track.vitest.ts`** — new `describe('archive.sh restore preflight')`:
- `refuses a restore that would leave a flat packet beside sub-tracks`
- `still restores into a flat track with no sub-tracks`
- `restores a packet archived with no commit in between`

## Failing run before the fix

```
× refuses a restore that would leave a flat packet beside sub-tracks
AssertionError: SUCCESS: Restored: /tmp/.../specs/demo/z_archive/009-old -> /tmp/.../specs/demo/009-old
demo: add 009-old (written)
: expected +0 to be 1
- Expected 1
+ Received 0
 Tests  1 failed | 67 passed (68)
EXIT=1
```

The other two new cases passed before the fix, as required.

## Final run

Command from `$C`:
`../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/archive-numbering.vitest.ts`

```
 Test Files  3 passed (3)
      Tests  107 passed (107)
EXIT=0
```

Baseline was 104 passed; the three new cases bring it to 107. `bash -n spec/archive.sh` exits 0.

## Defects / open questions

- The suggested command keeps the archived packet's own `NNN-slug`. If that number is already used in the target sub-track (or the restore would have renumbered), the operator may need to adjust the number. This is the spec's existing A7 open question about whether the named command works as-is; no test applies it in place.
- With several declared sub-tracks, the message picks the first in glob order; choosing one is explicitly out of scope.
- Defensive fallback: if the preflight reports mixed but `is_declared_subtrack` finds no sub-track (a disagreement between the two readers), the refusal still occurs and the command uses a literal `<sub>` placeholder.
- The captured `status` is intentionally not used for the decision — only the output line is, as the task specifies — so it exists solely to keep `set -e` from aborting the restore on the preflight's non-zero "work found"/refusal exits.

## Orchestrator reruns

- baseline 98 passed (three suites, after phase 007). After 008a: 100; 008b: 104; 008c: 107 passed, exit 0. bash -n on create.sh and archive.sh exit 0. rg -c 'exit 3' spec/README.md prints 1.
- full CLI npm test after 008c: Test Files 211 passed | 3 skipped (214), Tests 2595 passed | 20 skipped (2615), legacy and validation Results all 0 failed, npm exit 0.
- comment check: no added comment line carries a spec path, packet number or finding id.
- deliberate change: the earlier case for an always-failing moved-packet validation now expects exit 3 on run 1, per this phase's exit status decision.
