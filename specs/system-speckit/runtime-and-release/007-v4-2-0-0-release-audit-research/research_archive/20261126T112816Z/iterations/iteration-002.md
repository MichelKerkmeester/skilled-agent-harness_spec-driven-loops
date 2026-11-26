# Iteration 2: Overlay engine, diff-driven sibling check of the json-entry and letter-case fixes

## Focus
This iteration read the in-window hunks of six json-entry fixes and three layout-link letter-case fixes. The json-entry fixes are `512be46971a`, `2b9a2328922`, `9bee9df5cc0`, `a9d52c1087d`, `cd8091a09d3` and `5f1af6159d0`. The letter-case fixes are `8ab99ee8106`, `5a6f2e211c3` and `aba8f76e97f`. For each fix, it checked whether a sibling call site shares the defect and the fix never reached it. The goal was a verdict on Q1, the overlay engine's logic bugs. Q2, the deep-loop runtime, was not started.

All nine commits are in the window: none is an ancestor of `v4.1.0.0`, and every one is an ancestor of `v4.2.0.0`. `git diff --stat v4.2.0.0 HEAD` is empty for `overlay-engine.cjs`, so the HEAD line numbers cited below equal the release's.

## Actions Taken
1. Ran `git show` on the engine hunks of the three letter-case fixes. Each fix is a fold-or-same-file guard on one call site.
2. Located every `destinationShape` and `acceptedHashFor` call site. Read `pathFold`, `layoutPathKey`, `destinationShape`, `isOwnedShapeForLink`, `planLayoutLinks` and the `replacesOwned` branch of `applyLayoutLink`. Blamed each one against the window.
3. Reproduction A, a top-level shape change with a case change. It was a scratch `node:test` file outside the repo that drives the engine's own test fixtures (`overlay-engine-fixtures.cjs`) on this APFS volume, which ignores case.
   - Controls: a file entry at `Tool` that becomes a directory entry at `Tool`, and the reverse. Both exit 0 with `1 changed`.
   - Variants: the same changes, with the destination re-spelled `tool`. Both exit 1 with `BLOCKED  tool: tool is a file that does not match what apply last wrote there, where overlay tool writes a folder; apply removes only its own output, so it stays`, and its folder-to-file mirror.
4. Ran `git show 512be46971a`. Grepped the json operation section (lines 1150-2460) for every layout-sensitive emitter: `serializeValue`, `indentBefore`, `lineIndent`, `style.eol` and hard-coded `\n`. Read `documentLayout` as released, then the in-place rewrites for `insertItems` and `insertObjectKeys`. Compared each with its code before `512be46971a`.
5. Reproduction B, a dotless i on a layout link. Same harness. A file entry wrote `sıb` (U+0131), then the manifest dropped it and added the layout link `sib -> target`, and a byte-identical user file was put at `sib`.
   - The inode check confirmed `sib` and `sıb` are two distinct files on this volume, and the test was not skipped.
   - Result: exit 0 and `linked sib -> target`. `sib` is now a link, and `sıb` is still a file.
   - Control (recorded `sib`, no user file): exit 0, and `sib` is a link.
6. Read both json restore writers (`restoreDroppedSets`, `restoreDroppedKeys`) and the `@@ -2128` hunk of `512be46971a`. That hunk turned out to be `applyJsonOperations`, where `documentLayout` is the single call site.

## Findings
1. **P3 | in window (incomplete fix `5a6f2e211c3`; code `c2c2f2ab74a`) | A destination that changes shape and letter case at once is refused as someone else's output, though the engine wrote it.**
   - `5a6f2e211c3` folded only the walk of the sub-folders below a directory entry's destination [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2622].
   - The two top-level shape checks still look the state up by the manifest's spelling only, through `destinationShape(destinationPath, key, ...)` in the file plan [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2511] and the directory plan [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2575]. `destinationShape` matches hashes by exact key [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2292] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2295].
   - So on a volume that ignores case, an entry that moves from a file at `Tool` to a folder at `tool` is BLOCKED, and so is the reverse. Reproduction A confirmed both, and both same-case controls pass.
   - The engine's own precedent treats a manifest spelling that differs only in case as the same entry: `isOwnedShapeForLink` has a recorded-spelling fallback for this [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3376]. So this is a gap, not a design choice.
   - The refusal fails safe, since apply writes nothing. But its text is false ("does not match what apply last wrote there"), and its remedy tells the operator to `mv` the engine's own output aside [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2308] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2319]. That is a Q5 UX defect too.
   - The replace-path shape loop of a skill-root entry follows the same exact-key pattern [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3028]. That line blames to `299bf658411` and was not reproduced, so its share of this finding is [INFERENCE: same exact-key `destinationShape` call as :2511 and :2575].
2. **P3 | in window (`8ab99ee8106`; guard added elsewhere by `aba8f76e97f`) | A layout link deletes a file the engine did not write when the fold joins two names the volume keeps apart.**
   - `aba8f76e97f` set the rule that a file spelled differently from the state counts as the engine's own only when both spellings name the same file (`isSameFile`) [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:283] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2622].
   - It applied that rule to `planDirectoryOverlay` only. The recorded-spelling fallback in `isOwnedShapeForLink`, added by `8ab99ee8106`, hashes the bytes at the link path against the record of another spelling, with no same-file check [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3379] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3382].
   - `layoutPathKey` folds `ı` to `i` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:4256]. So `planLayoutLinks` marks the user's `sib` as `replacesOwned` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3424], and `applyLayoutLink` removes it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3496]. Reproduction B confirmed this.
   - Bound: the file goes only when its bytes equal the recorded hash, and a folder only when every child matches. So no unique content is lost.
   - Still, the engine deletes a file it did not write, which breaks the invariant `aba8f76e97f` exists to enforce. The engine's real output `sıb` and its state record are left orphaned beside the new link.

## Ruled Out
- **The json-entry layout fixes missed an emitter.** They did not. After `512be46971a`, every value writer passes the document's `unit` and `eol`, and none uses a hard-coded `\n` or two spaces:
  - `set` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1426] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1445]
  - `setKeyOnItem` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1483] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1492]
  - `insertItems` and `appendItems` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1561] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1581]
  - `insertObjectKeys` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1620] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1638]
  - `documentLayout` has a single caller [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2228].
- **The legacy flush-left rewrite skips `insertObjectKeys`.** Not a miss. Before `512be46971a`, that rewrite took its indent from `existing.keyStart`, which sits at the start of a line, so it never wrote flush-left. Only `set` and `setKeyOnItem` read the indent at the value's start, and both got the `isLegacyFlushLeft` path [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1304].
- **Restored dropped values keep upstream's layout, not the live file's.** This is deliberate and the same on both restore paths. `restoreDroppedSets` writes the pin's own slice back ("so the file returns to upstream's bytes") [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2112]. `restoreDroppedKeys` does the same with `pinnedValueText` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2199].
- **The `documentLayout` chain `2b9a2328922`..`5f1af6159d0` has a reader bug.** None found by reading. The reader does the following:
  - It takes the majority line ending.
  - It counts steps only from a line that opens one container, with strings stripped first.
  - It requires the next line's indent to extend the opener's.
  - It breaks ties toward the shorter step, and otherwise falls back to the shallowest indent [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].
  - The doc states the same rule [SOURCE: .skilled/skills/system-skilled-doctor/references/overlays.md:65], so there is no drift.
- **The removal edits mangle CRLF files.** They do not. They delete from the previous item's end or to the next item's start, so they insert no line ending [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1732] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1833].

## Dead Ends
- None that the reducer should treat as exhausted. The json-entry layout chain is closed for sibling sites, and a further pass on it is unlikely to pay.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: Q2 was not started within the budget. Each reproduction ran the engine's test fixtures, and they left their `repro-*` workspaces in the OS temp folder: about 30 folders counted, some from earlier runs. Deleting them is a banned operation for this agent, so they are listed here as task-created leftovers for the operator to clear.

## Sources Consulted
- `git show` for `8ab99ee8106`, `5a6f2e211c3`, `aba8f76e97f` and `512be46971a`. `git log --stat` for all nine commits. `git merge-base --is-ancestor` for each one against `v4.1.0.0` and `v4.2.0.0`. `git blame` on :2511, :2575, :3028 and :3374-3382.
- .skilled/commands/doctor/scripts/overlay-engine.cjs:280-312, 1205-1262, 1540-1566, 1606-1626, 2088-2116, 2180-2202, 2255-2330, 2500-2590, 3015-3040, 3340-3512, 4254-4257
- .skilled/commands/doctor/scripts/tests/overlay-engine-shape-change.test.cjs:1-60, 990-1040
- .skilled/skills/system-skilled-doctor/references/overlays.md:65
- Two scratch reproductions, run outside the repo against the engine's fixtures.

## Assessment
- New information ratio: 1.0. Both findings are new, and they appear neither in iteration 1 nor in the archived run.
- Questions addressed: Q1 and Q5.
- Questions answered: Q1.

## Questions Answered
- **Does the overlay engine and its doctor commands (relayout, rollback, repin, json-entry merge, path and case handling) carry logic bugs in v4.2.0.0?** Yes, but only low-severity ones in the window.
  - Two letter-case fixes were incomplete. Each is reproduced: findings 1 and 2 here.
  - Iteration 1 recorded two UX defects in the rollback and relayout output.
  - The json-entry layout fix chain is clean at every sibling site.
  - No P0, P1 or P2 logic bug was found in the window.

## Questions Remaining
- Do the deep-loop runtime changes (fan-out, expansive frontier, frontier_drained, --extend, convergence and the append gateway) carry logic bugs or drift from their docs?
- Does the skill advisor (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs?
- Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?

## Reflection
- What worked and why: reading each fix as a rule, then grepping for every call site that rule should cover. Both findings came from a fix that guarded one site while a sibling kept the old pattern. Running the engine's own fixtures turned both into reproduced results instead of inference.
- What did not work and why: the first `grep -v "^#"` filter also hid the repro's own `###` result lines, which cost a rerun.
- What I would do differently: print repro markers with a prefix the filter never strips.

## Recommended Next Focus
Q2, the deep-loop runtime, diff-driven: list `git log v4.1.0.0..v4.2.0.0` for `.skilled/skills/system-deep-loop/runtime/`, then read the hunks for fan-out, the expansive frontier and `frontier_drained`, `--extend`, and the append gateway's refusal checks, and test each against its doc.

One unverified overlay lead, to blame first: `engineLinkText` folds case when it looks up a recorded link, with no same-file check [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2405]. The dotless-i join could then let a recorded-link retarget replace a link the user made.
