---
title: "Handover to Barter: the hardened overlay engine"
description: "What changes for a Barter re-pin once Skilled's overlay engine hardening lands: a schema version 2 state file, NOTE lines in status, a refused drop for keys the overlay did not add, and one regenerate output Barter should declare."
trigger_phrases:
  - "handover to barter hardened overlay engine"
  - "barter state schema version 2"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Barter: the hardened overlay engine

Skilled's session may not write under `barter/ai-speckit`. This file lists what changes for a Barter session once it re-pins to a Skilled commit that holds this phase. It follows `../013-fix-review-findings-in-json-entry-set-restore/handover-to-barter.md`, whose steps still apply.

On a commit that holds this phase, `rg -c "STATE_SCHEMA_VERSION = 2" .skilled/commands/doctor/scripts/overlay-engine.cjs` prints 1.

## What changed in Skilled

1. **The state file is schema version 2.** The engine still reads a version 1 `sync-state.json`, and the first `apply` rewrites it as version 2. Commit that rewrite with the re-pin. An engine older than this phase cannot read a version 2 file: it stops with `sync-state.json has an unsupported shape`. A re-pin rollback restores the backed-up state file with the old engine, so it stays consistent. Copying an older engine back by hand does not, so do not downgrade that way.
2. **A dropped key the overlay did not add is refused, not deleted.** When a `set` leaves the entry set and the pin holds no value at its path, the engine deletes the key only when the record says this overlay added it. A record with `added: false`, or one an older engine wrote without the flag, refuses once with `delete the key by hand or put the set back in the entry set`.
3. **Status prints `NOTE` lines.** They never fail the run. `status --json` lists the same text under a new `notes` key. Barter's pre-commit hook runs `status` but prints its output only when status fails, so a passing commit shows no notes.
4. **Apply records its writes before any regenerate step runs.** A failed regenerate step is marked in the state, and the next `apply` runs the steps again even when every destination is already in sync.
5. **The state file and the manifest are written through a temporary file and a rename.** Neither is a symlink in Barter's overlay folder today, which matters because the rename replaces a link with a plain file.
6. **A relative `pin.checkout` is read from the tree root.** Barter's checkout path is absolute, so nothing changes there.
7. **A malformed entry set blocks only its own overlay** and names its `source` file.

## What Barter sees after the re-pin

A read-only `status` on Barter's current tree, run with this phase's engine, printed `RESULT: PASSED` as the vendored engine does, plus ten `NOTE` lines:

- **One schema version 1 line.** It goes away after the first `apply`.
- **Eight untracked-operation lines**, one per `setKeyOnItem` or `insertObjectKeys` in the `sk-code-mode-registry`, `sk-code-hub-router`, `mcp-tooling-mode-registry` and `advisor-divergence-ledger-barter-row` entry sets. Each names the key and matched item, or the inserted keys. They print on every run for as long as those operations stay in the entry sets. They mean only that the value stays in the file if the operation is ever dropped.
- **One cross-check line** on `.skilled/skills/system-skilled-doctor/graph-metadata.json` at `intent_signals.36`. This one is not drift. The `sk-code-graph-metadata` regenerate step (`generate-router-intent-signals.cjs --write`) rewrites `intent_signals` in that file, but its `outputs` list is empty, so the engine cannot tell the file is generated.

## What Barter does

1. Re-pin to the Skilled commit this phase ships in, which the Skilled session names when it reports.
2. Run `apply` once and commit the version 2 `sync-state.json` it writes.
3. Add `.skilled/skills/system-skilled-doctor/graph-metadata.json` to the `outputs` of the `sk-code-graph-metadata` regenerate step in `barter-overlays/overlay-manifest.json`. The cross-check skips any destination a step lists. Check whether that step writes other `json-entry` destinations too, such as `.skilled/skills/mcp-tooling/graph-metadata.json`, and list those as well.
4. If any script reads `status --json`, it can ignore `notes` or show it. No other key changed.
5. If a drop of a `set` now refuses with `the record does not show that this overlay added the key`, delete the key by hand or put the `set` back, then run `apply`.

## Limits to know about

- **Listing a file in `outputs` turns the cross-check off for it.** A value a dropped `setKeyOnItem` left behind in a generated file is then no longer reported.
- **The untracked operations still leave their values behind.** The notes report this. They do not undo it.
