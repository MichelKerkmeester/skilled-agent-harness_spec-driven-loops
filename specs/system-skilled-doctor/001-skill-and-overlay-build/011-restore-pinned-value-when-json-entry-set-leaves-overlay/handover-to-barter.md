---
title: "Handover to Barter: a removed set now returns to the pin's value"
description: "What a Barter session does once Skilled's restore for a removed json-entry set lands: re-pin, run one apply so the engine records the sets, then remove the two set operations that state upstream's value."
trigger_phrases:
  - "handover to barter removed set restore"
  - "barter remove set operations after sets record"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: a removed set now returns to the pin's value

Skilled's session may not write under `barter/ai-speckit`. This file holds the work only a Barter session can do. Paths are relative to the `ai-speckit` root unless they start with `.skilled`. It answers item 7 of `../010-fix-barter-repin-handover-items-for-overlay-engine/handover-from-barter-024.md`.

Nothing here applies until Barter re-pins to a Skilled commit that holds this change and the review fix that followed it. The first version is on main as `cb31e584730`. A review found that it restored the wrong value through an array index, so do not re-pin to that commit alone. A second review then found that a string index and an index past the end of the array still got through, so do not re-pin to `c92aa25378e` alone either. On a commit that holds every fix, `rg -c arrayOnPath .skilled/commands/doctor/scripts/overlay-engine.cjs` prints a number above 0.

## What changed in Skilled

1. **The engine records each `set` it applies.** `sync-state.json` gains a `sets` key per destination. Each record holds the path, the value written and whether the engine added the key.
2. **A `set` that leaves the entry set is taken back.** On the next `apply` the engine writes the value the pin holds at that path. A key the pin does not hold is deleted while it still carries the recorded value, whoever added it.
3. **A value edited after it was recorded is refused.** `apply` exits 1 with `dropped set at <path> was edited after it was applied` and writes nothing. `status` does not print `RESULT: PASSED`.
4. **A restore needs the pinned copy.** `apply` reads it from the checkout that `pin.checkout` names in `overlay-manifest.json`. A re-pin reads the new commit's tree. Without it the run refuses with `cannot restore the dropped set at <path>: the pinned copy of the file cannot be read`.
5. **A path through an array index is restored only while the arrays line up.** The array must hold the same number of items in the live file and in the pin, and the overlay must add no item to it. Otherwise `apply` exits 1 with `its path goes through an array whose items differ from the pinned copy; restore the value by hand` and writes nothing. A step into an array counts as an index however the entry set spells it, `1` or `"1"`. The refusal clears once the outermost array on the path reads the same as the pin's.
6. **Two `set` operations on one path share one record.** The record holds the value the file ends with, and both leave together.

## What Barter does

1. **Re-pin to the Skilled commit that holds this change.**
2. **Run `apply` once with the two `set` operations still in their sources.** This is the run that records them. Check that `sync-state.json` now has a `sets` key that names `command-routing-baseline.json`.
3. **Remove the two `set` operations that state upstream's value**, then run `apply` and `status`. Both values already equal the pin's, so `apply` changes nothing in the live file, the records leave `sync-state.json` and `status` prints `RESULT: PASSED`.
4. **From then on, remove a `set` by deleting it from its source.** No second operation that states upstream's value is needed.

## Limits to know about

- **A value left behind before this change has no record.** A state file from the older engine holds no `sets` key, so the engine restores nothing until one `apply` has recorded the operation. Step 2 is that `apply`. A `set` that was already removed before the re-pin stays as it is, and its value must be put back by hand.
- **A key that an older engine added is deleted like any other.** Its record says the engine did not add it. The engine deletes it anyway when the `set` is removed, the pin does not hold the key and the live value still equals the record.
- **A `set` that another operation of the same entry set writes inside or over cannot be dropped alone.** A `set` on an object and a second `set` on one of its keys, or a `set` with an `insertObjectKeys` on the same object, leave a live value that differs from the record. `apply` refuses with `was edited after it was applied`, though nobody edited it. Put the `set` back or restore the value by hand.
- **A refused array path clears only when the outermost array on its path equals the pin's.** Restoring the one value by hand is not enough. Take the entry set's operations on that array out, put the whole array back to the pin's by hand, run `apply`, then add the operations back.
- **A key a person added by hand is deleted like any other.** When a `set` later names that key with the same value and is then removed, the engine deletes the key. The record cannot tell a hand-added key from one an older engine added.
- **Some safe array cases are refused.** A dropped `set` on an array the overlay appends to is refused though the index did not move. Clear it the same way.
- **A `set` on an item the overlay itself added cannot be dropped.** Its path goes through an array the overlay added an item to, so `apply` refuses. Remove the item and the `set` by hand, or keep both.
- **A restored value carries the pin's line endings.** A pinned file with CRLF endings puts them into a live file that uses LF when the value spans lines.
- **Removing a whole `json-entry` entry from the manifest, or changing its `destination`, restores nothing.** The records are dropped with the entry and the values stay in the live file. The `items` record behaves the same way.
- **A damaged record gives an unclear refusal.** A `sets` record with no `path` refuses the overlay with a JavaScript error text and not with a line that names the record.
- **A re-pin may refuse a dropped `set` after it has copied files.** This was read in the code and not run. It needs a `json-entry` destination outside the folders the re-pin extracts. The run's rollback line applies.
- **Replacing one `set` path with another counts as removing the first.** The old path is restored, or refused under the rules above, before the new one is applied.
- **`setKeyOnItem` keeps no record.** A value it wrote stays in the live file after the operation leaves the entry set. Nobody has reported it, and the operator left it out of this phase.
- **A rollback to the older engine drops the `sets` key** the first time that engine writes the state file. The older engine loads a state file that carries the key.
