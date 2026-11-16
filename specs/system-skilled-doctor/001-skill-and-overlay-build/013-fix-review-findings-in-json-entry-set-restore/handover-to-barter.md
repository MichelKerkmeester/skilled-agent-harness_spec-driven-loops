---
title: "Handover to Barter: the set restore after its review fixes"
description: "What changes for a Barter re-pin once Skilled's seven review fixes for the json-entry set restore land: an item check on array paths, a re-pin that refuses before writing, and a new cannot-apply state."
trigger_phrases:
  - "handover to barter set restore review fixes"
  - "barter cannot-apply state"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: the set restore after its review fixes

Skilled's session may not write under `barter/ai-speckit`. This file lists what changes for a Barter session once it re-pins to a Skilled commit that holds this phase. It follows `../011-restore-pinned-value-when-json-entry-set-leaves-overlay/handover-to-barter.md`, whose steps still apply.

Do not re-pin to `35d49e8f638` or any earlier commit that holds the set restore. On that commit a re-pin can write one array item's value into another item and still print `RESULT: PASSED`. On a commit that holds this phase, `rg -c "'cannot-apply'" .skilled/commands/doctor/scripts/overlay-engine.cjs` prints a number above 0.

## What changed in Skilled

1. **A restore through an array index checks the item, not only the count.** The item at the index must be the pin's item, apart from values this overlay's operations wrote into it. When a `set` wrote the whole item, every other item of the array must be the pin's. Otherwise the run refuses and names the array: `put the array at <path> back to the pinned copy by hand and run apply`. Doing that and running `apply` clears it. The operations the entry set still lists write into the array again.
2. **A re-pin no longer refuses after it has written.** It plans every `json-entry` destination its copy leaves in place, whether excluded or at the tree root, against the new commit before the backup. When one cannot be applied it prints `blocked <id>: refused ...` and `refuse: <n> json-entry overlay(s) the copy leaves in place cannot be applied at the new pin; for a refused array, put it back to the copy at the current pin by hand, run apply, then re-pin`, exits 2 and writes nothing. A root-level destination now restores from the new commit instead of refusing.
3. **New state: `cannot-apply`.** An entry set the engine cannot apply to a file nobody edited since the last apply or the pin used to show as `both-changed`. It now shows as `cannot-apply`, with the reason in its `fix:` text. It blocks `apply` and a re-pin the same way. The counts line gains `cannot-apply=<n>`, and `status --json` uses the new name in `state` and `counts`. Any Barter script that switches on state names needs the new one.
4. **Two nested `set` operations dropped together both leave.** Before, they were refused as edited.
5. **`1` and `"1"` are one path** for records and for the dropped check.
6. **Without `pin.checkout`, the refusal names it.** It also clears once the live file holds exactly the bytes in the entry's `pinnedSha256`.

## What Barter does

1. Re-pin to the Skilled commit this phase ships in, which the Skilled session names when it reports.
2. If any script reads `status --json` state names, add `cannot-apply` beside `both-changed`.
3. Run `status`. A `cannot-apply` line names its own fix.

## Limits to know about

- **Two silent cases remain.** `setKeyOnItem` and `insertObjectKeys` keep no record, so their values stay after they leave the entry set. A `set` through an index that stays listed while an `insertItems` on that array leaves moves to the next item, and its old value stays on the item before.
- **Another operation kind writing inside a dropped `set` still refuses it as edited.** Only a `set` counts as part of the record.
- **A kept inner `set` inside a dropped outer one needs the pin to hold its parent.** Otherwise the overlay is refused after the outer value returns.
