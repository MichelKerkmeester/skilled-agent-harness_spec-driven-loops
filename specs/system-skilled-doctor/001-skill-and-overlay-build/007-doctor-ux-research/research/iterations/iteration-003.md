# Iteration 003 — Pin-Drift Detection and Shape Classification

## Focus

Carried forward from iteration 1: are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree?

The pin half was treated as the primary question because it is a yes/no fact about the engine's central safety claim, and because iteration 1 closed the re-pin safety surfaces without testing it.

## Actions Taken

1. Re-read iteration 1's residual scope and the engine's documented state vocabulary (`STATUS_NAMES`, `BLOCKING_STATES`) before choosing what to read.
2. Grepped the exact classification surface — `classifyDestination`, `STATUS_NAMES`, `skill-root`, `json-entry`, `pin.commit`, `upstream-moved`, `planOverlay`, `capture*` — to locate every decision point instead of reading the 3,482-line file end to end.
3. Read the classification core in full: `emptyState`/`loadState` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:444], `classifyDestination` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1783], the per-shape dispatch in `analyze` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1860], and `fixFor` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1891].
4. Traced every place `pin.commit` enters the engine: state seeding [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:456], the state-versus-manifest comparison [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1799], and re-pin's old-pin read [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3194].
5. Located but did not read in body the `capture` dispatch for `json-entry` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228] and `skill-root` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2237]; those are recorded below as carried, not asserted.

## Findings

### f-iter003-001 (P1) — `status` never checks `pin.commit` against the bytes in the tree

`classifyDestination` receives only a single destination's live buffer, its overlay output, the state, and the manifest [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1783]. There is no tree-level digest and no git invocation in the status path, so nothing in `status` can compare the vendored tree to the commit the manifest names.

The only pin comparison is `state.pin !== manifest.pin.commit` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1799]. That compares two recorded strings, not the tree. `loadState` accepts any `pin` string and validates neither it against the manifest nor against the files [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:454].

The no-state path makes the check tautological. When `sync-state.json` is absent, `emptyState(manifest.pin.commit)` copies the manifest's own pin into the state [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:456], so the comparison at 1799 is guaranteed equal and the `upstream-moved` branch can never fire [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1799]. The check is self-confirming exactly in the state where the tree's provenance is least known: a fresh clone, a lost or uncommitted state file, or a hand-edited manifest.

Answer to the carried question: **no**. A manifest `pin.commit` that disagrees with the tree is invisible to `status`; the tree can report `in-sync` on every destination.

### f-iter003-002 (P1) — A wrong `pin.commit` corrupts the re-pin drift base

`repin` reads the old pin from the manifest alone [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3194] and diffs `oldPin..newCommit` to build the touched set. Nothing verifies that the tree is at `oldPin`.

When manifest and tree disagree, every drift comparison against the old blob uses a base the tree never held. Files that upstream changed between the tree's real commit and the claimed pin look locally edited and are refused; a genuine local edit that the claimed pin would have exposed can be missed. The user then sees a refusal naming a path they never touched, with the generic "move each edit into an overlay, list the path in `repin.exclude`, or restore it from `<oldPin>`" remedy — where `<oldPin>` is itself the wrong commit.

Impact: the highest-stakes operation (upgrade) is driven by an unverified field, and its dominant failure mode is a misleading refusal rather than a clear diagnosis.

### f-iter003-003 (P2) — `in-sync` is decided before the pin, so a fully green status can coexist with a wrong pin

Byte equality returns `in-sync` first [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1787]. `upstream-moved` additionally requires live bytes to differ from both the applied hash and the overlay output [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1799]. A pin drift that leaves every destination matching its overlay output therefore yields `in-sync` on every line and exit 0.

The vocabulary has a per-destination state for upstream movement [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:67] but no tree-level verdict, so the one fact a vendored tree most needs — "these bytes are or are not commit X" — is never printed by any command. A user has no way to ask the question the manifest's `pin.commit` exists to answer.

### f-iter003-004 (P3) — `remove-root` bypasses the state machine, so a re-created file is always "overlay-edited"

`analyze` classifies a `remove-root` output by existence alone [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1864]: present means `overlay-edited`, absent means `in-sync`. The state file, the pin, and the `live-edited` state never apply.

A user who intentionally recreates a file that a `remove-root` entry removes is told to run `apply`, which deletes it again; there is no `capture` route for "stop removing this". Low impact because `remove-root` is an explicit removal, but it is a shape whose classification is a different function from every other shape, and the fix hint it emits is destructive.

## Shape Notes (unverified, carried)

- `pinnedSha256` is consulted per destination [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1798] but stored per entry. A `skill-root` entry produces several destinations (retained paths) [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1165], so one hash cannot describe all of them. Whether the manifest schema forbids `pinnedSha256` on multi-output scopes was not read this iteration; if it does not, the check is either dead or wrong for all but one path.
- Layout-link records are synthesized with `state: 'overlay-edited'` and no `output` or `plan` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1814], and `fixFor` maps that state to `apply` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1891]. Whether `apply` can actually recreate a missing layout link was not verified; if it cannot, `status` prints a next step that does nothing.
- `capture`'s per-shape dispatch was located but not read in body: `json-entry` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228], `skill-root` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2237], and the non-file guard [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2295]. Capture correctness for those two shapes remains open.

## Questions Answered

- Carried-forward (verbatim): "Are `status`/`apply`/`capture` classifications correct for every `skill-root` and `json-entry` shape, and does the engine detect a manifest `pin.commit` that disagrees with the bytes actually in the tree?"
  - Answer: the pin half is answered — **no**, the engine does not detect it, and the no-state path makes its only check tautological. The shape half is partly answered: `remove-root` has its own existence-only classifier, and layout links are forced to `overlay-edited` with an `apply` fix hint. `skill-root`/`json-entry` capture and the `pinnedSha256` scope rule remain open.

## Questions Remaining

- Q2: Which `/doctor` command messages, prompts and outputs confuse an external-repo user or leave them without a next step?
- Q4: How safe is upgrading or re-pinning a copied Skilled tree, and what would make re-pin, the overlay-guard hook and rollback safer or easier to recover from? (pin-drift is now covered; the guard hook is untouched)
- Q5: Where do `INSTALL-SKILLED.md`, `overlays.md`, the doctor command docs and the skill README disagree with the code, and which improvements rank highest by user impact?
- Residual: `pinnedSha256` scope validation for multi-output entries; whether `apply` repairs layout links; `capture` bodies for `json-entry` and `skill-root`.

## Next Focus

Q4 — the overlay-guard hook and rollback recovery. Pin-drift detection is now closed as a negative, so the remaining Q4 surface is the guard hook's decision rule: what it does when the tree's pin and the guard's notion of ownership disagree, and how a user recovers when the guard blocks a path the engine would allow.
