Done. Only the three named files were edited; nothing committed. The pre-existing `tasks.md` modification and `scratch/` files in the worktree were not touched by this task.

## What changed

`relocate.mjs`:
- **`closeRun`** — status 3 is now set only when that entry's verdict lines contain `RESULT: FAILED`; any other failed validation (including no `RESULT` line at all) sets status 2, and a 2 already set by another entry is never downgraded to 3.
- **`closeRun`** — the sweep late-step mark is deferred until after all validations and written only when the sweep passed *and* every moved packet printed a `RESULT` line, so a validator that never ran leaves the map open and is invoked again on the rerun.
- The exit-code header comment now states status 3 requires a `RESULT: FAILED` line and status 2 covers a failed validation with no such line.

## Tests added

`tests/relocate.vitest.ts`:
1. `keeps the map closed when the moved packet validation prints RESULT: FAILED`
2. `reruns the validate step after a validator printed no RESULT line once`
3. `returns 2 when one moved packet fails its validation and another validator never reports`

`tests/archive-track.vitest.ts`:
4. `reports the restore as unfinished when the relocated validation printed no RESULT line`

## Failing run before the fix

```
 ❯ |cli| tests/relocate.vitest.ts (38 tests | 2 failed) 16094ms
     × reruns the validate step after a validator printed no RESULT line once 448ms
     × returns 2 when one moved packet fails its validation and another validator never reports 476ms
 ❯ |cli| tests/archive-track.vitest.ts (69 tests | 1 failed) 50935ms
     × reports the restore as unfinished when the relocated validation printed no RESULT line 621ms

 Test Files  2 failed | 1 passed (3)
      Tests  3 failed | 108 passed (111)
```

Relevant assertion lines:
- Relocate no-`RESULT` case: `expected 3 to be 2` after `close validate specs/alpha/sub/001-a: no RESULT line (exit 1)`.
- Mixed case: `expected 3 to be 2` after `close validate specs/alpha/sub/002-b: no RESULT line (exit 1)`.
- Archive case: `expected +0 to be 1` after `close validate specs/zeta/005-old: no RESULT line (exit 1)` was still followed by `SUCCESS: Restored:`.

The `RESULT: FAILED` relocate case passed before the fix, as specified.

## Final run

```
 Test Files  3 passed (3)
      Tests  111 passed (111)
vitest-exit=0
```

Exit status: 0.

## Defects / open questions

None blocking. One edge consequence worth recording: a validator that exits **0** while printing no `RESULT` line earns status 0 but also does not write the sweep mark, so the next run validates again — this follows the “every moved packet produced a RESULT line” rule, but such a validator would cause the close to repeat indefinitely. Also, a non-zero validator printing `RESULT: PASSED` is treated as status 2, since only a `RESULT: FAILED` line earns 3.


## Follow-up: validator that exits 0 with no RESULT line

Done.

## Changed

**`$C/spec/relocate.mjs` — `closeRun`**
- The line clearing `everyVerdictReported` is now `if (!verdict.length && !result.ok)`: a validation counts as reported when it printed a `RESULT:` line **or** exited 0, so a silent successful validator no longer keeps the sweep mark unwritten. The comment above it now states that rule. Nothing else in the function changed.

**`$C/tests/relocate.vitest.ts` — new case beside the existing no-`RESULT` cases**
- `keeps the map closed when a validator exits 0 without a RESULT line` — same counting-stub pattern: a `validate.sh` stub prints nothing, increments a call counter, exits 0. Run 1 must exit 0 and report `no RESULT line (exit 0)`; run 2 must print `relocate: nothing to do` and leave the counter at `1`.

## Failing run before the fix

```
 ❯ |cli| tests/relocate.vitest.ts (39 tests | 1 failed)
     × keeps the map closed when a validator exits 0 without a RESULT line
AssertionError: expected 'relocate: applying\n  moved    specs/…' to contain 'relocate: nothing to do'
+ Received
+ relocate: applying
...
+ close sweep-track-roots: ok
+ close validate specs/alpha/sub/001-a: no RESULT line (exit 0)

 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 111 passed (112)
exit=1
```

Run 2 re-planned the finished move and validated again because the sweep mark never landed — the stated defect.

## Final run

```
 Test Files  3 passed (3)
      Tests  112 passed (112)
exit=0
```

(Baseline before the test was added: `3 passed (3)`, `111 passed (111)`, exit 0.)

No defects or open questions. I edited only the two named files and kept the pre-existing uncommitted REQ-002 change intact; nothing was committed.


## Orchestrator rerun

Three suites: Test Files 3 passed (3), Tests 112 passed (112), exit=0.
