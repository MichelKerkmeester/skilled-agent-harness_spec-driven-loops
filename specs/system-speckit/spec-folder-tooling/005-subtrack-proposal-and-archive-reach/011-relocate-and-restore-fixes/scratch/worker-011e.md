All checks are complete. Here is the report.

## What changed

**`$C/spec/archive.sh`**

- `is_declared_subtrack` — added the positive container-name test (`^[A-Za-z0-9][A-Za-z0-9._-]*$`) for both the folder and its track, so a declaration on a name `isContainerName` rejects (space, leading punctuation, etc.) is not counted as a sub-track.
- `refuse_mixed_track_restore` — now scans the destination track for a declared sub-track and refuses directly; removed the `node "$relocate_script" --from ... --to ...` dry run, the output/status capture, and the now-irrelevant early return when `relocate.mjs` is absent. The sub-track guard, refusal text and `exit 1` are unchanged.
- `show_help` — added the two NOTES bullets for the mixed-track refusal ("flat packets") and the failed-own-validation warning ("own validation").

**`$C/tests/archive-track.vitest.ts`**

- `restores into a flat track without running a relocation dry run` — replaces `relocate.mjs` with a stub that appends every invocation's args to a file, restores into a flat track, and asserts the restore succeeded and the stub recorded nothing.
- `names the mixed-track refusal and the failed-validation warning` — runs `--help`, asserts exit 0 and that a line contains `would hold flat packets` and a line contains `own validation`.

## Failing run before the fix

`tests/archive-track.vitest.ts` alone, exit 1:

```
× restores into a flat track without running a relocation dry run
AssertionError: the restore asked relocate.mjs for a mixed-track verdict: expected '--from flat/z_archive/002-old --to fl…' to be ''
+ --from flat/z_archive/002-old --to flat/002-old

× names the mixed-track refusal and the failed-validation warning
AssertionError: expected 'archive-spec.sh - Archive completed s…' to match /^.*would hold flat packets.*$/m

Test Files  1 failed (1)
     Tests  2 failed | 69 passed (71)
```

## Final run

`tests/archive-track.vitest.ts` after the fix: `Test Files 1 passed (1)`, `Tests 71 passed (71)`, exit 0 — including the mixed-track refusal exiting 1 and both flat-track restores exiting 0.

Full required command, exit 0:

```
Test Files  3 passed (3)
     Tests  115 passed (115)
```

Baseline was 113 passed; the two new cases bring it to 115.

Requested help check:

```
$ bash $C/spec/archive.sh --help | rg -c 'flat packets|own validation'
2
```

## Defects / open questions

None blocking. One behavioural note: the old early return when `relocate.mjs` was absent was part of the dry-run delegation and is gone, so a mixed-track restore is now refused even if the engine is missing; no existing test covered that state.


## Orchestrator rerun

Three suites: Test Files 3 passed (3), Tests 115 passed (115), exit=0. `archive.sh --help | rg -c` printed 2. `bash -n archive.sh` passed.
