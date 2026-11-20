# Iteration 013 - Frontier node F-1-001: maintainability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-001 (depth 1), dimension maintainability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-001 maintainability, convergence decision for iteration 12 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:98-104, 313
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:342-348 (543 lines total)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (5,348 lines; +586/-49 across the two runner files in the range)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Three copies of "which stamp is the model's claim" use two different predicates** -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101 -- The window check picks `claimedTimestamp` when the key is present at all, using `hasOwnProperty` (lineage-timestamp-window.ts:101-103). The completion check in the same file picks it only when it is a string (:313), and the pass judge does the same in its own copy (fanout-salvage.cjs:346). Today the projection writes the key only as a string (deep-review-state-contract.ts:294), so the copies agree. A projection that ever writes `claimedTimestamp: null`, for example to mark a missing claim, which is one fix for OPUS-F001-P2-003, would make the window check count an unparseable anomaly while the completion check and pass judge silently fall back to the gateway clock. One shared helper, `claimedStampOf(row)`, would keep the three in step.
   Finding class: cross-consumer
   Scope proof: grep for claimedTimestamp consumers returns exactly these three sites (lineage-timestamp-window.ts:101, :313; fanout-salvage.cjs:346)
   Affected surface hints: lineage-timestamp-window.ts checkLineageTimestampWindow and checkLineageCompletion; fanout-salvage.cjs readLineageCommits
   Case: a projection change writes claimedTimestamp:null on a record with no stamp, and the window check reports an unparseable anomaly while the completion check passes the same row.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- None beyond the three consumer sites above.

## Edge Cases
- fanout-run.cjs keeps growing as the single home for runner, stop, status, adapter and progress logic: 5,348 lines, with the range adding the stop, status and lineage-block code in place. This is recorded as context, not a finding. A split has no named failure it would prevent in this range.

## Confirmed-Clean Surfaces
- writeLineageValues and readRootLineageValues are small, documented, and share `lineageFieldsOf` for the research and review shapes (fanout-run.cjs:856-895).

## Ruled Out
- A file split of fanout-run.cjs as a finding: no concrete failure tied to size in the range.

## Next Focus
- Dimension: maintainability
- Focus area: F-1-003 maintainability
- Reason: frontier round-robin
- Rotation status: F-1-001 complete on all four dimensions
- Required evidence: file:line

Review verdict: PASS
