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

Nothing here applies until Barter re-pins to a Skilled commit that holds this change. It is in worktree `425-repin-engine-limits-intake` and is not committed yet.

## What changed in Skilled

1. **The engine records each `set` it applies.** `sync-state.json` gains a `sets` key per destination. Each record holds the path, the value written and whether the engine added the key.
2. **A `set` that leaves the entry set is taken back.** On the next `apply` the engine writes the value the pin holds at that path. A key the engine added is deleted when the pin does not hold it.
3. **A value edited after it was recorded is refused.** `apply` exits 1 with `dropped set at <path> was edited after it was applied` and writes nothing. `status` does not print `RESULT: PASSED`.
4. **A restore needs the pinned copy.** The engine reads it from the checkout that `pin.checkout` names in `overlay-manifest.json`. Without it `apply` refuses with `cannot restore the dropped set at <path>: the pinned copy of the file cannot be read`.

## What Barter does

1. **Re-pin to the Skilled commit that holds this change.**
2. **Run `apply` once with the two `set` operations still in their sources.** This is the run that records them. Check that `sync-state.json` now has a `sets` key that names `command-routing-baseline.json`.
3. **Remove the two `set` operations that state upstream's value**, then run `apply` and `status`. Both values already equal the pin's, so `apply` changes nothing in the live file, the records leave `sync-state.json` and `status` prints `RESULT: PASSED`.
4. **From then on, remove a `set` by deleting it from its source.** No second operation that states upstream's value is needed.

## Limits to know about

- **A value left behind before this change has no record.** A state file from the older engine holds no `sets` key, so the engine restores nothing until one `apply` has recorded the operation. Step 2 is that `apply`. A `set` that was already removed before the re-pin stays as it is, and its value must be put back by hand.
- **A key that an older engine added is recorded as not added.** The engine cannot tell that it inserted the key. When such a `set` is removed and the pin does not hold the key, `apply` refuses with `the pinned copy holds no value there`. Delete the key by hand, then run `apply`.
- **Replacing one `set` path with another counts as removing the first.** The old path is restored, or refused under the rules above, before the new one is applied.
- **`setKeyOnItem` keeps no record.** A value it wrote stays in the live file after the operation leaves the entry set. Nobody has reported it, and the operator left it out of this phase.
- **A rollback to the older engine drops the `sets` key** the first time that engine writes the state file. The older engine loads a state file that carries the key.
