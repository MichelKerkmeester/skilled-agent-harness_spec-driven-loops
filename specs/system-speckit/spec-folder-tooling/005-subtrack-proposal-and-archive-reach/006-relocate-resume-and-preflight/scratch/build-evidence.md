# Build evidence, 2026-11-14

Each change was written test first by DeepSeek V4.1 Flash (max) through dsh. The worker reports below include the failing run before each fix. The orchestrator reran the two suites after every change and the full CLI suite at the end.

## Worker report 006a

Done. The fix and its proof are complete.

## What changed

**`$C/spec/relocate.mjs`**
- `LATE_STEPS` (new constant) — names the three late steps (`redirects`, `triggerIndex`, `sweep`) whose completion must be recorded.
- `batchOf` (new) — single lookup for the ledger batch that records an entry's move; keeps the three ledger helpers agreeing on what "recorded" means.
- `ledgerHas` (refactor) — now delegates to `batchOf`; same semantics.
- `pendingLateSteps` (new) — returns late steps not yet marked passed for every entry.
- `markLateStep` (new) — writes `steps[step] = true` into each entry's ledger batch after that step succeeds.
- `buildPlan` — computes `lateSteps` from the ledger and puts it on the plan.
- `hasWork` — adds `plan.lateSteps.length > 0`, so a missed redirect/trigger/sweep keeps the map open.
- `applyPlan` — creates batches with `steps: {}` and marks `redirects` and `triggerIndex` only after their child step passes.
- `closeRun` — marks `sweep` as soon as the sweep passes, before packet validation; a packet's `validate.sh` verdict is printed but never marked or counted.

**`$C/tests/relocate.vitest.ts`**
- `stubFailsOnce` helper — a writer that exits 1 on its first call and passes thereafter.
- `relocate resume > reruns the redirect table and the trigger index after the redirect table failed once`
- `relocate resume > reruns the close after its sweep failed once`
- `relocate resume > does not keep the map open when the moved packet validation fails`

## Failing run before the fix

```
× reruns the redirect table and the trigger index after the redirect table failed once
× reruns the close after its sweep failed once

AssertionError: relocate: dry run, nothing written (pass --apply to write)
  moved    specs/alpha/001-a -> specs/alpha/sub/001-a (already at its destination)
...
relocate: nothing to do
: expected +0 to be 1

AssertionError: expected 'relocate: applying\n  moved    specs/…' to contain 'close sweep-track-roots: ok'
+ relocate: nothing to do

Test Files  1 failed | 1 passed (2)
Tests  2 failed | 78 passed (80)
exit=1
```

Both failed for the stated reason: `hasWork()` saw no work after the redirect step or the sweep failed. The always-failing-`validate.sh` case passed pre-fix, as required.

## Final run

```
Test Files  2 passed (2)
Tests  80 passed (80)
exit=0
```

Baseline was 77; the three new cases bring it to 80. Only the two permitted files are modified; the two pre-existing untracked `scratch/` files were untouched, and no test wrote into the repository's real `specs/` tree.

## Defects / open questions

None blocking. One design note: a resume reruns the redirect table and trigger index even when their marks already passed. That keeps the change small and matches the required rerun output; both writers are idempotent. Marks use the same `from`/`to` batch lookup the ledger already used for `ledgerHas`.

## Worker report 006b

All checks pass. Final state verified:

**Changed (T007)**
- `main()` — the dirty-tree check's rewrite loop now skips `affected` files at or under `specs/<entry.to>` for entries in `plan.done` (the folder is at its destination and its source is gone), so a rerun no longer refuses on dirt created by the map's own earlier staged move. Pending-source checks and all other rewrite-file refusals are unchanged.

**Tests added (T006)** — both in `describe('relocate resume')` in `tests/relocate.vitest.ts`:
1. `finishes a move step when one folder of the map already moved uncommitted` — two-entry map, first entry `git mv`'d and left staged; `--map --apply` must exit 0 with both folders at `eps/sub/001-a` and `eps/sub/002-b`.
2. `refuses an uncommitted edit outside the map when one folder already moved` — same setup plus an uncommitted edit to `specs/zeta/001-c/notes.md`, which the run would rewrite; must exit 2 with the refusal naming that file.

**Failing run before the fix** (new case 1; case 2 passed as the guard, which is what T006 expects):
```
FAIL |cli| tests/relocate.vitest.ts > relocate resume > finishes a move step when one folder of the map already moved uncommitted
AssertionError: relocate: refused: specs/eps/sub/001-a/description.json: has uncommitted changes and would be rewritten
relocate: refused: specs/eps/sub/001-a/graph-metadata.json: has uncommitted changes and would be rewritten
relocate: nothing was written
: expected 2 to be +0 // Object.is equality
...
 Tests  1 failed | 20 passed (21)
exit=1
```

**Final run after the fix** (command run from `$C`, exit status real):
```
 Test Files  2 passed (2)
      Tests  82 passed (82)
exit=0
```
(80-test baseline plus the 2 new cases; the prior late-step ledger change and its tests still pass.)

**Defects / open questions:** none found. Note the intended limitation from the spec risk: an operator's own uncommitted edit inside a folder the same map already moved cannot be distinguished from the move's dirt, so that folder is exempt; every file outside those destinations is still refused exactly as before (covered by case 2).

## Worker report 006c

## Changed

**`$C/spec/relocate.mjs`**
- `parentChainOf(id)` — returns the ancestor segments a folder id implies; used to derive both the old-place and current-place chains.
- `sameChain(recorded, implied)` — exact element-wise comparison; a missing or non-array `parentChain` never matches, so the existing fixtures that omit it stay clean.
- `staleIdentity(folder, entry)` — now also reports `description parentChain` when the recorded chain equals the chain of the old place but differs from the chain of the current place. A chain that already differed before the move matches neither the old chain, so it is not reported.

**`$C/tests/relocate.vitest.ts`**
- Added one case: `reruns the identity step when a sub-track move left the description parent chain stale`.
- Its own fixture writes `parentChain: ['alpha']` (the shared `packet()` helper was not changed).
- Its migrate stub uses `stubFailsOnce`; the second call rewrites the moved description's chain to `['alpha', 'sub']`.
- Asserts run 1 exits 2 with `step description identity (migrate-generated-json --only): FAILED`, run 2 exits 0 with the same step `ok` and the new chain, and run 3 prints `relocate: nothing to do`.

No other files were edited; nothing committed.

## Failing run before the fix

```
× reruns the identity step when a sub-track move left the description parent chain stale
AssertionError: expected 'relocate: applying\n  moved    specs/…' to contain 'step description identity (migrate-ge…'
- step description identity (migrate-generated-json --only): ok
+ relocate: applying
...
moves=0 moved=1 rewrites=0 identity=0 roots=2 ledger=1
+ step graph identity and pointers specs/alpha/sub/001-a (repair-derived): ok
...
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 82 passed (83)
[exit code: 1]
```

The rerun printed `identity=0` and never invoked the identity step, exactly the stated failure.

## Final run

Command from `$C`:

```
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts
```

Result:

```
 Test Files  2 passed (2)
      Tests  83 passed (83)
```

Exit status 0 (no `[exit code]` marker).

## Extra verification / defects

I also checked the pre-differed guard in a throwaway repository: old-place `parentChain` set to an unrelated chain and a migrate stub that always exits 1. Run 1 exited 2 with the identity step `FAILED`; run 2 exited 0 and printed no identity step, confirming only a chain still naming the old place counts as identity work.

No defects or open questions found.

## Worker report 006d

## Changed

- **`preflight()`** (`$C/spec/relocate.mjs`) — now reads the relocation ledger and, for a missing source with an existing destination, only sets `state = 'done'` when a record proves the move. Otherwise it pushes a refusal naming both paths and the move back, before any write.
- **`recordedMove(entry, ledger)`** (new) — accepts the move only when the ledger batch holds that `from`/`to` pair, or when git has the source under `HEAD:specs/...` but not the destination (a tracked, uncommitted move).

No other files were touched; the earlier phase changes remain.

## Tests added (`relocate resume`)

- `refuses a source that never existed even when the destination is a live packet`
- `accepts a tracked move git records before the relocation step`
- `refuses an untracked rename and finishes after moving the folder back`

## Failing run before the fix

`Test Files 1 failed | 1 passed (2)`, `Tests 2 failed | 84 passed (86)`, exit 1.

The two intended failures were:

```text
× refuses a source that never existed even when the destination is a live packet
  moved    specs/zeta/999-typo -> specs/zeta/001-a (already at its destination)
  ledger   .skilled/skills/sk-doc/shared/scripts/relocation-ledger.json: record 1 move(s)
  : expected +0 to be 2

× refuses an untracked rename and finishes after moving the folder back
  moved    specs/eta/001-a -> specs/eta/sub/001-a (already at its destination)
  ledger   .skilled/skills/sk-doc/shared/scripts/relocation-ledger.json: record 1 move(s)
  : expected +0 to be 2
```

The tracked-`git mv` case passed before the fix, as expected, because the old code treated any existing destination as done; it still passes through the new record check.

## Final run

```text
 Test Files  2 passed (2)
      Tests  86 passed (86)
exit=0
```

## Defects / open questions

None. The refusal message deliberately says “relocation record” rather than “ledger” so the “no ledger line” assertion is unambiguous. No command wrote into the repository’s real `specs/` tree; the two untracked scratch files there predate this work.

## Worker report 006e

## Changed

**`$C/spec/relocate.mjs`**
- `statOrNull(file)` — safe `statSync` wrapper so identity comparison treats a missing path as absent instead of throwing.
- `volumeFoldsCase()` — cached probe: stats the existing specs root and its upper-case spelling and compares `dev`/`ino`; no probe file is written.
- `folderIdentity(id)` — existing folders key by `dev:ino`; missing ones key by the longest existing prefix's `dev:ino` plus the remainder, lower-cased only when the probe says the volume folds case.
- `preflight(rawEntries, refusals)` — replaced the spelling-keyed `sources`/`tos` maps with `folderIdentity` keys, and the refusal now prints both full entries.

**`$C/tests/relocate.vitest.ts`**
- `gitStatus()` — returns `git status --porcelain` output.
- `volumeFoldsCase(dir)` — writes a temp file in the throwaway specs root, checks its upper-case spelling, removes it.
- Two new cases, each skipping with a clear reason when the probe shows a case-sensitive volume.

## Tests added

1. `refuses two spellings of one source folder when the volume folds case`
2. `refuses two spellings of one target folder when the volume folds case`

Both assert exit 2, a `relocate: refused:` line naming both spellings, and empty porcelain status.

## Pre-fix failing run

```
× refuses two spellings of one source folder when the volume folds case
AssertionError: expected undefined to be defined
 ❯ tests/relocate.vitest.ts:391:36
   expect(refused, result.stderr).toBeDefined();

× refuses two spellings of one target folder when the volume folds case
AssertionError: expected undefined to be defined
 ❯ tests/relocate.vitest.ts:412:36
   expect(refused, result.stderr).toBeDefined();

Test Files  1 failed (1)
     Tests  2 failed | 25 skipped (27)
exit=1
```

Both maps already exited 2 pre-fix; they failed specifically because no refusal line was printed.

## Final run

```
Test Files  2 passed (2)
     Tests  88 passed (88)
exit=0
```

Baseline was 86 passed; 88 = 86 + the 2 new cases. Both cases **ran, not skipped**, on this machine: APFS folded the probe, so the `ctx.skip` branch was not taken.

Only the two permitted files are modified; nothing was committed, and no command wrote into the repository's real `specs/` tree (the two untracked `scratch/*.txt` files predated this task).

## Defect / open question

None. The case-insensitive remainder comparison is only applied for not-yet-existing tails and only after the specs-root probe confirms the volume folds case; on a case-sensitive volume the two spellings remain distinct.

## Orchestrator reruns

- after 006a: 80 passed, exit 0; 006b: 82; 006c: 83; 006d: 86; 006e: 88 passed, exit 0 (tests/relocate.vitest.ts tests/archive-track.vitest.ts).
- full CLI npm test after 006e: Test Files 211 passed | 3 skipped (214), Tests 2580 passed | 20 skipped (2600), legacy Results 12 passed 0 failed, 2 passed 0 failed, validation 12 passed 0 failed, npm exit 0.
- comment check: no added comment line in relocate.mjs or relocate.vitest.ts carries a spec path, packet number or finding id.
