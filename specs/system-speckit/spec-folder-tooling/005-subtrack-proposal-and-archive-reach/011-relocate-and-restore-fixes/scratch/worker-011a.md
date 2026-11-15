Done. Only the two named files changed; nothing committed.

## What changed

`$C/spec/relocate.mjs`
- **`PHASE_ROW_ORDER`** (new const): ranks new-parent files first and old-parent files last, so an interrupted finish leaves the old rows as the stale signal.
- **`phaseRowEdits.ensure`**: carries and merges that write rank per file.
- **`phaseRowEdits`**: now loops all entries, plans a `done` re-parent only while a row is stale (old parent still names the phase in `spec.md`/`goal.md`, or the new parent lacks the map/binding row), falls back to the scaffold placeholder map row when the old row was already removed, and reads the moved child at `entry.to` when the entry is done. Pending behaviour is unchanged.
- **`buildPlan`**: keeps the `phaseRows` map and stable-sorts rewrites by that rank; text-file order is kept for everything else.

`$C/tests/relocate.vitest.ts`
- **`stubMigrateIdentity`** (new helper): mirrors the real migration writer's `specId`/`folderSlug` update so a renumbered packet has no stale identity work on the rerun.

## Tests added

1. `finishes the phase rows after a tracked move stopped before the rewrite`
2. `finishes the new parent rows when the old parent no longer has them`

## Failing run before the fix

```
 ❯ |cli| tests/relocate.vitest.ts (35 tests | 2 failed)
     × finishes the phase rows after a tracked move stopped before the rewrite
     × finishes the new parent rows when the old parent no longer has them

 FAIL ... finishes the phase rows after a tracked move stopped before the rewrite
AssertionError: expected '# Phase parent fixture\n\n<!-- ANCHOR…' not to contain '003-gamma'
 ❯ tests/relocate.vitest.ts:502:74

 FAIL ... finishes the new parent rows when the old parent no longer has them
AssertionError: expected false to be true
 ❯ tests/relocate.vitest.ts:549:94

 Test Files  1 failed (1)
      Tests  2 failed | 33 passed (35)
```

The first failure is the old parent retaining its map/handoff rows; the second is the new parent having no map row.

## Final run

Command from `$C`:

```
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts tests/relocate-real-pipeline.vitest.ts

 Test Files  3 passed (3)
      Tests  107 passed (107)
exit=0
```

Baseline was 105 passed; the count rose by the two new cases only. A separate ad-hoc temp-repo check of a clean re-parent confirmed run 2 exits 0 with `relocate: nothing to do`.

## Defect / open question

- The suite's default `migrate-generated-json.ts` stub is a no-op, so a renumbered phase's `description.specId` stays stale in that fixture forever; the new cases install `stubMigrateIdentity` to behave like the real writer. This is a fixture limitation, not a product change.
- When the old map row is already gone, focus/status cannot be recovered; the fallback uses the scaffold's `[Phase N scope]` / `Pending` row. That is a deliberate placeholder choice.
- Staleness is detected from parent rows only, as specified. A manual state where parent rows are clean but a sibling/child neighbour row is still stale would not be replanned; the new write order makes that state unreachable from a normal interrupted apply.
