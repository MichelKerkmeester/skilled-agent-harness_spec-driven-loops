# Iteration 024 - Recovery: anchor check of every open finding (iteration cap)

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery (convergence for iteration 23 returned STUCK_RECOVERY; a `deep_review.recovery_started` event was recorded before this iteration). This is the last iteration under maxIterations 24.
- Strategy: check every recorded finding's file:line anchor against the current tree so synthesis cites live lines
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- Every `file` anchor in this lineage's findingDetails, read at the cited line from the current tree
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:384-386

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None new.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- 12 of the 13 recorded anchors land on the line the finding describes: OPUS-F001-P2-001 (resolved), -002, -003, -004, -005, OPUS-F003-P1-001, -P1-002, -P2-003, OPUS-F005-P2-001, -002 (the opening of the documented JSON row), -003, and OPUS-F006-P2-002.
- Anchor correction: OPUS-F006-P2-001 cites fanout-salvage.cjs:273, which is a line inside `passEvidence`. The rule the finding describes, `const untimed = logs.some(...)` and `passEvidence(untimed ? '' : ...)`, is at fanout-salvage.cjs:384-386. The finding's substance is unchanged. Synthesis cites :384.

## Edge Cases
- None new.

## Confirmed-Clean Surfaces
- No finding's anchor points past the end of its file or at a moved file.

## Ruled Out
- Stale anchors beyond the one corrected above.

## Next Focus
- Dimension: none; the iteration cap is reached
- Focus area: synthesis
- Reason: maxIterations 24
- Rotation status: frontier drained; legal convergence is blocked by the hard spec_code fail, so the stop is maxIterationsReached
- Required evidence: terminal gates and review report

Review verdict: CONDITIONAL
