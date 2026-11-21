# Iteration 013 - maintainability (engine, after the frontier closed)

## Dispatcher
- Lineage opus-medium, iteration 13 (12 prior iteration records). steer.md absent.
- The reducer closed all four frontier nodes as exhausted after correctness, security and traceability (per-node depth-1 budget spent), leaving no active node, so no FRONTIER block applies. This iteration takes the strategy's next focus: maintainability, which no iteration has covered yet.
- Review focus addressed: the safe follow-on change cost of the engine change, specifically how the sibling-folder case is spread across command paths, since a path that forgets the case is exactly the defect class phase 001 fixed.

## Files Reviewed
- .skilled/commands/doctor/scripts/overlay-engine.cjs:480-493 (createContext)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:4575-4662 (writeBackup)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5226-5250 (repinRun stage), :5808-5820 (stagedUnownedChanges), :6369-6383 (relayoutUnderLock)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The "overlay folder sits outside the tree" test is recomputed in four command paths instead of living on the context** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:4582 -- writeBackup (:4582), repinRun (:5228), stagedUnownedChanges (:5814) and relayoutUnderLock (:6374) each compute `!isWithin(root, overlayRoot)` and branch on it. createContext (:480-493) already builds root, overlayRoot and overlayLabel once for every command, but carries no flag for this. Every future command that writes or keys a path in the overlay folder has to remember the sibling case by hand, and the phase 001 bug class was exactly command paths that keyed overlay-folder files tree-relative.
   Finding class: duplicated invariant
   Scope proof: grep for `isWithin(...root, ...overlayRoot)` returns exactly these four lines.
   Affected surface hints: createContext, writeBackup, repinRun, stagedUnownedChanges, relayoutUnderLock
   Case: a new command writes `relativeKey(ctx.root, ctx.statePath)` without checking the sibling case; it throws "destination escapes the sync root" for every sibling-folder consumer, and only a sibling fixture would catch it.
2. **writeBackup folds two backup areas into one nested loop written on a single line** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:4603 -- The function, now about 88 lines, iterates `for (... of areas) for (... of areaGroups...)` on one line, with an `if (area) continue` special case that skips created-folder tracking for the overlay area only. The behavior is right (iteration 1), but the shape hides the asymmetry between the two areas from the next editor.
   Finding class: readability
   Scope proof: single function; no other loop in the file nests two `for...of` heads on one line.
   Affected surface hints: writeBackup
   Case: a maintainer adds a third area or overlay-area files in subfolders and misses that created folders are tracked for the tree area only, so a rollback leaves empty folders behind in the overlay folder.

## Traceability Checks
- spec_code (pass): no behavior change claimed; maintainability-only observations.

## Integration Evidence
- None.

## Edge Cases
- None new.

## Confirmed-Clean Surfaces
- resolveOverlayDir keeps every setting check in one function, which the "only the setting reader mentions overlayDir" test enforces.

## Ruled Out
- Duplicate layout rules: layoutMoves, adopt and relayout all call adoptSource, so the framework/root rule has one definition.

## Next Focus
- Dimension: maintainability
- Focus area: docs and Barter scripts shape (overlay.md, workflow YAML, init-repository.sh)
- Reason: finish maintainability across the remaining surfaces

Review verdict: PASS
