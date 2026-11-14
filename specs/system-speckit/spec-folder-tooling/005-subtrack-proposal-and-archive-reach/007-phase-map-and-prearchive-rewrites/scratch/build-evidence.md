# Build evidence, 2026-11-14

Each change was written test first by DeepSeek V4.1 Flash (max) through dsh. Worker reports below include the failing run before each fix. The orchestrator reran the relocate and archive suites after every change and the full CLI suite at the end.

## Worker report 007a

**Changed**

`spec/relocate.mjs`
- `bareNameEdits(entries)` — selects only moves whose parent folder is unchanged and is an `NNN-slug` packet holding `spec.md` (a phase parent), and limits writes to that parent's `spec.md`/`goal.md`, each direct child's `spec.md`, and the moved child's summary row.
- `bareNamePattern(names)` — builds the bounded match `(?<![A-Za-z0-9_-])name(?![A-Za-z0-9_-])`, so `scaffold-003-gamma` stays as written.
- `rewrittenSummaryRow(text, edit)` — rewrites only a stale `**Spec Folder**` row in the moved child's `implementation-summary.md`, leaving the rest of the summary alone.
- `buildTransform(entries, bare)` — applies bare-name rewrites after the whole-id pass (so full paths are never partially rewritten) and counts the changes for dry-run and apply.
- `buildPlan(...)` — wires `bareNameEdits(entries)` into the transform.
- `SPEC_FOLDER_ROW` — locates the moved child's summary row.

`tests/relocate.vitest.ts`
- Added `phaseParent`, `implementationSummary` and `bareHits` fixture helpers, plus the two cases below.

**Tests added**

Under `relocate phase renumber names`:
1. `rewrites a renumbered phase bare name in its parent documents and siblings`
2. `leaves a second phase parent that holds the same child name untouched`

**Failing run before the fix**

```text
FAIL  |cli| tests/relocate.vitest.ts > relocate phase renumber names > rewrites a renumbered phase bare name in its parent documents and siblings
AssertionError: expected '# Phase parent fixture\n\n<!-- ANCHOR…' not to contain '003-gamma'

| 3 | 003-gamma/ | Phase 3 scope | Pending |
| 001-alpha | 003-gamma | criteria | verify |

❯ tests/relocate.vitest.ts:340:28
   340|     expect(parentSpec).not.toContain('003-gamma');
 Test Files  1 failed (1)
      Tests  1 failed | 28 passed (29)
```

The guard case (second phase parent) passed in that run, as intended.

**Final run**

Command, from the CLI directory:

```text
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts
```

```text
 Test Files  2 passed (2)
      Tests  90 passed (90)
exit=0
```

Baseline was 88; the two new cases bring it to 90, with phase 006’s tests still passing.

**Defects / open questions**

- No defect observed in the implemented scope.
- T007–T010 (re-parent and pre-archive rewrites, REQ-003/REQ-004) were intentionally not touched.
- The phase fixture mirrors `create.sh --phase` document shapes rather than invoking `create.sh`; the bare-name check is the exact line-boundary test from the spec.
- Only the two permitted files are modified; nothing committed.

## Worker report 007b

## Changed

**`C/spec/relocate.mjs`**

- `tableCells`, `tableKind`, `markdownTables`, `tableRowName`, `replaceBareName`, `tableSeparator` — parse the three markdown tables a phase parent owns (map, handoff, goal binding) and match bare folder names without matching inside longer names.
- `phaseRowEdits(entries)` — builds the per-file row plan for a re-parent: old parent loses its map/handoff/binding rows and its remaining siblings are re-pointed to the nearest remaining phase; new parent gains a map row with the new number plus the old Focus/Status cells, gains a goal binding row, and the moved child's own predecessor/successor rows are set to its new neighbours. It records the two "nothing added" cases (no handoff row, no map in the new parent).
- `removeTableRows`, `setNeighbourRow`, `addTableRow`, `applyPhaseRows` — apply that plan to document text, return the changed text and one report line per removed, added or set row.
- `buildTransform(..., phaseRows)` — runs the row plan after the whole-id/bare-name passes and returns the report notes.
- `buildPlan` — calls `phaseRowEdits`, collects `phaseNotes` even when a document has only a report note and no other rewrite.
- `printPlan` — prints the phase-row report lines.
- `bareNameEdits` was left unchanged; it already skips an entry whose parent changes.

**`C/tests/relocate.vitest.ts`**

Added two cases under `relocate re-parent`:

1. `removes a re-parented phase from its old parent and adds it to the new one`
2. `reports that a new parent with no phase map takes no map row`

`archive-track.vitest.ts` was not touched (REQ-004 is not in T007/T008).

## Failing run before the fix

```
Tests  2 failed | 29 passed (31)
exit=1
```

Relevant lines:

```
FAIL  ... removes a re-parented phase from its old parent and adds it to the new one
AssertionError: expected '# Phase parent fixture\n\n<!-- ANCHOR…' not to contain 'gamma'
...
| 3 | 003-gamma/ | Phase 3 scope | Pending |
| 001-alpha | 003-gamma | criteria | verify |
| 003-gamma | 005-delta | criteria | verify |
```

```
FAIL  ... reports that a new parent with no phase map takes no map row
AssertionError: expected [] to have a length of 1 but got +0
...
expect(newGoal.split('\n').filter((line) => line.includes('002-gamma'))).toHaveLength(1);
```

That is the stated reason: the old parent still named the gone folder, and the new parent had no goal binding row.

## Final run

Command, from `C`:

```
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts
```

Result:

```
Test Files  2 passed (2)
     Tests  92 passed (92)
exit=0
```

Baseline was 90 passed; the two new cases account for the increase.

## Defects / open questions

- The row plan currently applies only to `pending` entries. A phase re-parent interrupted after the folder move but before the rewrite step would be `done` on rerun, so its rows would not be finished. T008 did not ask for that resume path; flagging it rather than expanding scope.
- The new re-parent case does not assert a clean second `--apply`: the suite stubs `migrate-generated-json`, so the renamed child keeps a derived `specId` and the second run reports unrelated identity work. The existing second-apply clean-run test still passes, and the row rule itself emits nothing on a second run because it only plans pending entries.

## Worker report 007c

## Changed

**`$C/spec/relocate.mjs`**
- `preArchiveAliases(entries)` *(new)*: derives the id a packet had before archiving (its source path with the `z_archive` parent removed) and maps it to the destination, only for entries leaving an archive; it skips the alias when a live folder still holds that id or another entry in the same plan claims it, because the reference then means something else.
- `buildTransform(...)`: seeds `idMap` with those aliases before building `wholeIdPattern`, so the existing whole-id pass rewrites both the `z_archive` spelling and the pre-archive spelling to the destination.

**`$C/tests/archive-track.vitest.ts`**
- Extracted `installRestoreTools()` and `commitFixture()` from the existing restore-onto-taken-number case (same setup, now shared; no behaviour change).
- Added the two requested cases.

Added test names:
1. `rewrites the id a restored packet had before it was archived`
2. `keeps the pre-archive id when a live folder holds it`

## Failing run before the fix

```
❯ |cli| tests/archive-track.vitest.ts (63 tests | 1 failed) 31276ms
     × rewrites the id a restored packet had before it was archived 424ms

AssertionError: expected 'See `specs/zeta/005-old/spec.md` and …' not to contain 'zeta/001-old'

- Expected
+ Received

- zeta/001-old
+ See `specs/zeta/005-old/spec.md` and the earlier id zeta/001-old.

 Test Files  1 failed (1)
      Tests  1 failed | 62 passed (63)
EXIT=1
```

The live-folder case already passed before the fix, confirming only the restore rewrite was missing.

## Final run

Command run from `$C`:

```
../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts
```

```
 Test Files  2 passed (2)
      Tests  94 passed (94)
EXIT=0
```

92 baseline + 2 new. `git diff --check` is clean; no commit made.

## Defect / open question

The alias is limited to a source sitting **directly** in a `z_archive/` folder, which is the only shape `archive.sh` restores. A source nested deeper under an archive gets no pre-archive alias. Separately, for a root-archive restore the pre-archive id is a bare single segment, so it follows `wholeIdPattern`'s existing rule and is rewritten only where written as `specs/<id>`; a bare mention of that root id is left as is (same existing limitation documented at `relocate.mjs:639-643`). Neither affects the REQ-004 scenario or the two new cases.

## Orchestrator reruns

- baseline 88 passed (after phase 006). After 007a: 90; 007b: 92; 007c: 94 passed, exit 0.
- full CLI npm test after 007c: Test Files 211 passed | 3 skipped (214), Tests 2586 passed | 20 skipped (2606), legacy and validation Results all 0 failed, npm exit 0.
- comment check: no added comment line carries a spec path, packet number or finding id.
