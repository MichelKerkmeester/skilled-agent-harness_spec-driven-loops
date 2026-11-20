# Iteration 016 - Frontier node F-2-006: maintainability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-2-006 (depth 2), dimension maintainability, the last open node-dimension
- Sources read before work: lineage steer.md (absent), frontier block for F-2-006 maintainability, convergence decision for iteration 15 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:33 (LINEAGE_LOG_PATTERN), readLineageProviderCostUsd, readLineagePassSummary

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- `readLineageProviderCostUsd` walks `logs/` with an inline copy of the log-name regex, `/^fanout-lineage(\.\d+)?\.out$/`, while `readLineagePassSummary` uses the `LINEAGE_LOG_PATTERN` constant that holds the same expression (fanout-salvage.cjs:33). That is two instances, which the restraint rule treats as similarity rather than a pattern, so it is recorded, not raised.
- Both readers fail to unknown in the same way. One attempt log without a cost record makes the run cost null, and one attempt log without a timed event makes `flaggedPasses` null. The rotated-log policy behaves the same for cost and pass judgement, so the second of these is not a separate maintainability defect beyond OPUS-F006-P2-001.

## Edge Cases
- None new.

## Confirmed-Clean Surfaces
- Each reader handles an unreadable or missing `logs/` directory locally and returns null or the live log instead of throwing.

## Ruled Out
- Extracting a shared logs-dir walker: two instances, no third.

## Next Focus
- Dimension: none remaining on this lineage's frontier
- Focus area: convergence check and synthesis
- Reason: every node in frontier_scope plus F-2-006 has all four dimensions
- Rotation status: frontier drained
- Required evidence: convergence.cjs stop decision

Review verdict: PASS
