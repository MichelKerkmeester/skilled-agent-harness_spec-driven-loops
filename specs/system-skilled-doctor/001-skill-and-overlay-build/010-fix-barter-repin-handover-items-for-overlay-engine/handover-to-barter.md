---
title: "Handover to Barter: after the re-pin limit fixes"
description: "What a Barter session does once Skilled's fixes for the six re-pin items land: re-pin, set rebasedOnto on its folder overlays, list its generator's outputs, move the vocabularyMirrors set back into the overlay and drop two workaround scripts."
trigger_phrases:
  - "handover to barter repin limits"
  - "barter re-pin after rebasedOnto"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: after the re-pin limit fixes

Skilled's session may not write under `barter/ai-speckit`. This file holds the work only a Barter session can do. Paths are relative to the `ai-speckit` root unless they start with `.skilled`. It answers `handover-from-barter.md` in this folder, item by item.

Nothing here applies until Barter re-pins to a Skilled commit that holds these changes. They are in worktree `425-repin-engine-limits-intake` and are not committed yet.

## What changed in Skilled

1. **A link the new pin replaces with a folder re-pins.** The engine no longer counts a file seen through such a link as the tree's own copy. The link must still match the old pin.
2. **A folder overlay can say it was rebased.** A `directory` or `skill-root` entry takes `rebasedOnto`, the commit the owner read the folder against. Once the pin is that commit, a destination that holds upstream's bytes reads `overlay-edited` and `apply` writes the overlay's copy. The value counts for that one commit.
3. **A file upstream adds inside a `directory` overlay is the overlay's to delete** while it holds upstream's bytes. It no longer reads `live-edited`.
4. **A stage that is not clean ends `RESULT: BLOCKED`.** It exited 1 before and still does. `RESULT: STAGED` now always means a clean stage.
5. **A `json-entry` `set` adds its key** when the document does not hold it yet. A path through a missing parent object still fails with `missing key`.
6. **No engine change for the generator-written field.** A regenerate step's `outputs` list already exempts its files from the unowned-file refusal.
7. **`vocabularyMirrors`:** removing a surface is the supported form for a host that keeps its own packet. `.skilled/skills/sk-code/README.md` says so.
8. **`INSTALL-SKILLED.md` names the history lookup build.**

## What Barter does

1. **Before the next re-pin, read upstream's changes under each folder overlay** the stage lists as blocked, then set `"rebasedOnto": "<the commit you re-pin to>"` on that entry in `skilled/barter-overlays/overlay-manifest.json`. On the last re-pin those were `repo-frontend` and `sk-git-root`.
2. **List the generator's files.** The `sk-code-graph-metadata` regenerate step has `"outputs": []`. Add every `graph-metadata.json` that `generate-router-intent-signals.cjs --write` writes in Barter, including `.skilled/skills/system-skill-advisor/graph-metadata.json`.
3. **Keep the `vocabularyMirrors` `set` in the `hub-router.json` overlay** through the next re-pin. It no longer needs to be held back and added afterwards.
4. **Drop the two workaround scripts** `settle-owned.cjs` and `council-path.cjs` from the re-pin steps, and do not add a `repin.exclude` entry for a link that became a folder.
5. **Read the stage's last line.** `RESULT: BLOCKED` means the live run would fail after its copy. Go live only on `RESULT: STAGED`.
6. **`install.sh` may keep its own history build.** It now matches the install guide.

## Limits to know about

- **A folder that the new pin replaces with a link still refuses.** Nobody has met it, so it was left out. List the path in `repin.exclude` if it happens and report it.
- **`rebasedOnto` is per entry, not per file.** Setting it says the whole folder was read. A stale overlay file under that entry is then written over upstream's change without a second warning.
- **A `set` that is later removed from an overlay leaves its value behind.** That is item 7 of Barter's second handover, copied here as `handover-from-barter-024.md`. A key that `set` added is left behind the same way. It is not fixed in this phase.
- **Items 7 to 10 of the second handover are recorded, not started.** They wait on the operator's decision about where they belong.
- **The three items open from the handover before this one** are unchanged: a host's own `pre-commit` in `git-setup-check.cjs`, captured fixtures that differ in a host, and `apply --adopt` under `repin.exclude`.
