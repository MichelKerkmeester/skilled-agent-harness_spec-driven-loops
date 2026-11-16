---
title: "Implementation Summary"
description: "A set removed from a json-entry overlay source now returns its value to the pin's on the next apply. The engine records each set in sync-state.json. One engine file, eight new tests and one reference paragraph."
trigger_phrases:
  - "restore pinned value json entry set implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay"
    last_updated_at: "2026-11-16T16:25:35Z"
    last_updated_by: "generate-context"
    recent_action: "Applied and verified the second review's fixes and added the whole re-pin test"
    next_safe_action: "Verify the Barter session knows which commit holds every fix"
    packet_purpose: "Purpose: After a `set` operation leaves an overlay source, `apply` returns the live value to the pin's value, and removes a key the engine added that the pin does not hold."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/011-restore-pinned-value-when-json-entry-set-leaves-overlay/handover-to-barter.md"
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T16:25:35Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-restore-pinned-value-when-json-entry-set-leaves-overlay |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you remove a `set` operation from a `json-entry` overlay source, the next `apply` writes the pin's value back into the live file. A key the `set` added is deleted when the pin does not hold it.

The engine now records each `set` it applies in `sync-state.json`, under a `sets` key per destination: the path, the value written and whether the engine added the key. A `set` is recorded whether or not it changed a byte, so the first `apply` under this engine records a value an older engine wrote. Before an entry set runs, `restoreDroppedSets` takes back each recorded `set` the entry set no longer names. It refuses the overlay when the live value was edited after it was recorded, and when the pinned copy cannot be read.

A review of the first version found that a path through an array index could restore another item's value. The fix refuses such a path unless the array holds the same number of items in the live file and in the pin and the overlay adds no item to it. It also deletes a key the pin does not hold whatever the record says about who added it, and keeps one record when two `set` operations name one path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The `onSet` report in `planOperation`, the `sets` record in the state read and write, `restoreDroppedSets` and its call in `applyJsonOperations` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Eight new tests and a fixture with a pinned upstream checkout. One older test keeps its first `set` listed. The review fix added six more tests |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The `sets` record beside `links` and `items`, and `setKeyOnItem` as a known limit |
| `handover-to-barter.md` | Created | What the vendoring project removes, and after which `apply` |
| `scratch/dispatch/`, `scratch/vibe-runs/` | Created | The twelve briefs and each run's `export.json` and output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was written and tested once as a prototype, saved as a patch and reverted. It was then cut into seven briefs of literal old and new text, one change per brief. DeepSeek v4.1 flash at max thinking applied each brief through the Mistral Vibe CLI. After each run the edited files were compared byte for byte with the text the brief gave, and the next run started only on a match.

The first brief added the failing test. It printed `pass 21` and `fail 1` before any engine change. The fifth brief added the restore and the same file printed `pass 22` and `fail 0`.

After the first version reached main, a fresh Fable 5.2 session reviewed the commit. Its findings 1 to 5 were reproduced with a script before anything changed. The operator chose the fix for each. The fix went the same way as the build: a prototype, then briefs 08 to 12. Brief 08 added six tests and printed `pass 32` and `fail 3`. Briefs 09, 10 and 11 each made one of the three pass, and the file ended at `pass 35` and `fail 0`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record every `set`, changed or not | The vendoring project's two operations state a value the live file already holds. Recording only a changed value would never record them |
| A live value that equals the pin's is left alone before the edit check | After `apply` restores a value, its own second analysis reads the old record against the restored file. Without this order it would call the restore a hand edit |
| Write the pin's own text, not a new serialisation | The file returns to upstream's bytes, which a test asserts |
| Delete a key the pin does not hold while it carries the recorded value | The first version deleted only a key its record marked as added. A record made after an older engine added the key is not marked, so the removal was refused for good. An equal live value shows that nobody edited it. The operator chose this after the review |
| Refuse a path through an array index unless the arrays line up | An index is a position. An item the overlay added moves it, and the first version then wrote another item's value. The engine refuses and says to restore the value by hand |
| Read an index from the document, not from the step's type | A path step written as the string `"1"` skipped the index check and the restore wrote another item's value. A step is an index when the node it steps into is an array |
| Refuse a path through an array that no longer resolves | The first fix skipped such a record as already gone. A removed item moves every later index, so the value can sit one place along |
| Drop the record once the whole array equals the pin's | It gives the refusal a way to clear after a hand repair, and an array that equals the pin's holds nothing the overlay wrote |
| The check after the write reads the records the run keeps | It read the records the run started with. A set the run had just taken back was then read against the written file and judged as a stranger's edit, so the run exited 1 with the file already written |
| A key that is gone leaves quietly once the indexes line up | Refusing every unresolved path through an array stopped safe cases, such as a key a person deleted by hand |
| One record per path | Two `set` operations on one path made two records, and the first never matched the live value again |
| Change one older test's setup | It replaced one `set` with another on a fixture with no pinned copy, which the operator's refusal rule now stops first. The test keeps its first `set` listed and no assert line changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests` before the change | `tests 1175`, `pass 1175`, `fail 0` |
| The same command after the change | `tests 1183`, `pass 1183`, `fail 0`, exit 0 |
| `node --test` on `overlay-engine-sync.test.cjs` | `pass 29`, `fail 0` |
| The same file against an engine without the restore step | `pass 23`, `fail 6` |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9`, exit 0 |
| `quality-gate.cjs --worktree` | `gate=NO_BLOCKER_FOUND`, `findings: 0`, exit 0 |
| `scratch/repro-removed-set.cjs` with a recorded `set` | `after the set is removed: sk-code (equals the pin: true)` |
| The engine at `5e6589083e1` on a state file that carries `sets` | `apply` printed `0 changed`, exit 0 |
| Seven Vibe runs | Each `export.json` records `exit_code` 0 and `outcome` `finished` |
| `overlay-engine-sync.test.cjs` with the six fix tests and the engine before the fix | `tests 35`, `pass 32`, `fail 3` |
| The same file after the fix | `tests 35`, `pass 35`, `fail 0`, exit 0 |
| A second review of the fix, by Opus 5.5 | Nine findings. I reran its scripts for the string index, the index past the end and the duplicate records, and each showed the wrong result it reported |
| `overlay-engine-sync.test.cjs` with three more tests, before and after the second fix | `pass 35`, `fail 3`, then `tests 38`, `pass 38`, `fail 0` |
| The same three reviewer scripts after the second fix | Two refusals that write nothing and one correct restore |
| `node --test .skilled/commands/doctor/scripts/tests` after the second fix | `tests 1201`, `pass 1201`, `fail 0` |
| Two rechecks by the same reviewer | Each found an `apply` that wrote the file and then exited 1. The cause was one line: the check after the write read the records from before the run |
| `overlay-engine-sync.test.cjs` after runs 17 to 22 | `tests 41`, `pass 41`, `fail 0` |
| `node --test .skilled/commands/doctor/scripts/tests` after run 22 | `tests 1204`, `pass 1204`, `fail 0` |
| A third recheck, with a differential fuzz of 320 cases against `c92aa25378e` | No wrong value and no write followed by exit 1. One doc sentence was wrong and run 23 corrected it |
| Six more Vibe runs, 17 to 22 | Each `export.json` records `exit_code` 0 and `outcome` `finished`, and each edited file equals the prototype byte for byte |
| Four more Vibe runs, 13 to 16 | Each `export.json` records `exit_code` 0 and `outcome` `finished`, and each edited file equals the prototype byte for byte |
| Five more Vibe runs, 08 to 12 | Each `export.json` records `exit_code` 0 and `outcome` `finished`. The engine, the test file and the reference each equal the prototype byte for byte |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A value left behind before this change is not restored.** No record of it exists. Put it back by hand, or keep the `set` until one `apply` has recorded it.
2. **`setKeyOnItem` keeps no record.** A value it wrote stays after the operation leaves the entry set. The operator left it out of this phase.
3. **A refused array path clears only when the outermost array on its path equals the pin's.** A hand repair of one value does not clear it. Take the entry set's operations on that array out, put the whole array back to the pin's by hand, run `apply`, then add the operations back. Some safe cases are still refused: a `set` dropped from an array the overlay appends to, while the array differs from the pin's.
13. **A hand swap of two items can hide a value.** When a person swaps two items of the same array by hand and drops a `set` that added a key to one of them, the engine reads the key as gone. The first build did the same.
4. **A key a person added by hand is deleted** when a `set` later names it with the same value and is then removed. The operator chose the delete rule, and the record cannot tell the two cases apart.
5. **A path through an array index is often refused.** It is restored only while the array has the same length in the live file and in the pin and the overlay adds no item to it. A `set` on an item the overlay itself added can therefore not be dropped.
6. **A re-pin over a dropped `set` is tested for one shape.** One test re-pins after a `set` left an entry set that keeps a second `set`, and reads the new pin's value from the live file. When upstream changed the file and operations remain, the entry's `pinnedSha256` must name the new pin first, or the re-pin stops with `upstream-moved` as it does for any entry.
7. **A restore needs the checkout the manifest's pin names.** Without it `apply` refuses and writes nothing.
8. **A `set` that another operation writes inside or over cannot be dropped alone.** A `set` on an object with a second `set` on one of its keys, or with an `insertObjectKeys` on the same object, is refused as edited though nobody edited it.
9. **A restored value carries the pin's line endings.** A CRLF pin puts them into an LF live file when the value spans lines.
10. **Removing a whole entry from the manifest, or changing its `destination`, restores nothing.** The records leave with the entry. The `items` record behaves the same way.
11. **A record with no `path` refuses with a JavaScript error text.** The state check only looks at whether each destination maps to a list.
12. **A re-pin may refuse a dropped `set` after its copy has written.** Read in the code and not run. It needs a `json-entry` destination outside the folders the re-pin extracts.
<!-- /ANCHOR:limitations -->

---


