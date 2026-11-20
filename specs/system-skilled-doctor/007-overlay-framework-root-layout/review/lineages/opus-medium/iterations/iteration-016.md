# Iteration 016 - correctness stabilization pass (capture and status labels)

## Dispatcher
- Lineage opus-medium, iteration 16 (15 prior iteration records). steer.md absent. No active frontier node.
- Iteration 15's convergence check returned BLOCKED on candidateCoverageGate: its record listed `severity_calibration` as a required class only under ruledOut, while the gate reads `covered` as the classes searched. This record lists every searched class under covered as well, which is the gate's meaning.
- Review focus addressed: a stabilization pass over two sibling-folder paths the review had not read directly, capture back into the sibling folder and the status labels. These are what an old-layout consumer sees first after moving the folder beside the tree.

## Files Reviewed
- .skilled/commands/doctor/scripts/overlay-engine.cjs:3942-3985 (capture: refusal and missing-source lines through sourceRelative and overlayLabel)
- .skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs:1754-1770 (status and status --json label a sibling folder `../overlays`)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): 001 REQ-012 (display text names `../overlays/<source>`) holds: capture prints `ctx.overlayLabel + '/' + sourceRelative(...)` (:3962), and the sync test asserts `overlayFolder: '../overlays'` and the source column `../overlays/files/guarded.txt` in status --json.

## Integration Evidence
- None new.

## Edge Cases
- None new.

## Confirmed-Clean Surfaces
- Capture resolves the source inside the overlay root with sourceRelative and prints it under the setting's label, so a sibling folder reads the same as an in-tree one.

## Ruled Out
- Status or capture printing a tree-relative path for a sibling source.

## Next Focus
- Dimension: correctness
- Focus area: none outstanding; synthesis when convergence allows
- Reason: all dimensions covered and open findings rechecked

Review verdict: PASS
