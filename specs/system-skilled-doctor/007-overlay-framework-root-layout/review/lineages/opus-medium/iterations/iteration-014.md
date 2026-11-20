# Iteration 014 - maintainability (docs and Barter hooks)

## Dispatcher
- Lineage opus-medium, iteration 14 (13 prior iteration records). steer.md absent. No active frontier node.
- Review focus addressed: follow-on change cost of the migration for old-layout consumers and of the Barter hooks that learned the new location. The question is whether the next change to the overlay folder's place or name is made in one spot.

## Files Reviewed
- barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52-63
- barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit:83-91
- barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:176-189
- barter/ai-speckit/skilled/.skilled-overlays.json:1
- .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61-74 (Skilled guard asks the engine)
- .skilled/commands/doctor/overlay.md (116 lines, 3 lines over 600 characters)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Barter's three hooks hard-code the overlays folder name instead of reading .skilled-overlays.json** -- barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:52 -- The edit guard core (`OVERLAYS_NAME = 'overlays'`, :52, matched at :59), the commit gate (`$TREE_ROOT/../overlays/overlay-manifest.json`, pre-commit:85-89) and the git-write gate (`path.join(path.dirname(tree), 'overlays', 'overlay-manifest.json')`, :182) each carry their own copy of the folder's place. The setting file skilled/.skilled-overlays.json is the place the engine reads, and Skilled's own guard asks the engine (overlay-guard.cjs:71-74), so it never drifts from the setting. None of the three Barter hooks reads the setting (grep for `.skilled-overlays.json` and `overlayDir` in them finds nothing). This move needed a dedicated hook commit (a954fc956ce) and a second contraction in 2a8f454c8d1 for that reason, and the next rename or move needs four edits that must agree.
   Finding class: duplicated configuration
   Scope proof: the three hook files above are the only Barter consumers that locate the overlay folder themselves; the engine, sync-skilled-specs.mjs and init-repository.sh read fixed paths too, but they are scripts, not guards that fail open when wrong.
   Affected surface hints: barter-overlay-guard-core.cjs, pre-commit, barter-git-write-gate.mjs
   Case: the setting is changed to `../team-overlays` and the folder renamed; the engine follows, the edit guard can no longer locate its layout and fails open, the commit gate skips its overlay checks, and the git-write gate reclassifies ai-speckit as a project repository.

## Traceability Checks
- spec_code (pass): 005 spec.md:172 names the risk of hooks moved before they learn the place; the hard-coded copies are how that risk arose.

## Integration Evidence
- Skilled overlay-guard core calls `engine.createContext(treeRoot).manifestPath` (overlay-guard.cjs:71-74), so it follows the setting.

## Edge Cases
- overlay.md carries three lines over 600 characters (long numbered workflow steps). That is the file's existing style, not introduced as a pattern here; not raised.

## Confirmed-Clean Surfaces
- Old-layout consumers have one migration command, the relayout, and the engine keeps applying old-layout sources until it runs, so the migration has no flag day.

## Ruled Out
- A second, divergent definition of the layout rule in the docs: every doc restates the adoptSource rule.

## Next Focus
- Dimension: maintainability
- Focus area: cross-dimension recheck of open P2s before synthesis
- Reason: all four dimensions now covered

Review verdict: PASS
