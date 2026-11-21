# Iteration 017 - maintainability recovery pass (test fixtures, line level)

## Dispatcher
- Lineage opus-medium, iteration 17 (16 prior iteration records). steer.md absent. No active frontier node.
- Iteration 16's convergence returned STUCK_RECOVERY (two consecutive no-progress iterations). The deep_review.recovery_started event was recorded through the append gateway: strategy change-granularity, target dimension maintainability, the least-covered dimension.
- Review focus addressed: test strength from the maintainability side. Can the sibling-folder fixtures be reused and cleaned up safely, so that later sibling cases are cheap to add and do not leak folders between runs?

## Files Reviewed
- .skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs (diff: createWorkspace siblingOverlayFolder option, createSyncFixture options)
- .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs:191-213 (sibling folder fixture and its cleanup registration)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): 001 spec dependency row (fixture option added first) is met: createWorkspace takes `siblingOverlayFolder`, places the folder in the workspace beside the tree, writes `../<name>`, and refuses the combination with `overlayFolder`.

## Integration Evidence
- None.

## Edge Cases
- The guard test names its sibling folder after the tree folder (`<tree>-overlays`) and registers it for cleanup (`fixtures.push(siblingDir)`), so parallel runs never share it and nothing is left in the temp folder.

## Confirmed-Clean Surfaces
- One fixture entry point serves every engine suite, so a new sibling case reuses it rather than building trees by hand.

## Ruled Out
- Fixture leakage between parallel sibling runs.

## Next Focus
- Dimension: maintainability
- Focus area: none outstanding
- Reason: recovery pass found no new issue; synthesis when convergence allows

Review verdict: PASS
