# Iteration 018 - Recovery: live confirmation of the blocked-stop findings

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery after a legal-stop BLOCKED on dimensionCoverageGate at iteration 17. The spec_code hard fail is a gating failure, so `reviewTraceabilityCovered` returns false (convergence.cjs reviewTraceabilityCovered, `summary.gatingFailures === 0`). The run cannot converge legally and continues to maxIterations 24.
- Strategy: escalate or confirm existing findings with live evidence inside this lineage's nodes (F-1-005 scope)
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/opus/deep-review-state.jsonl:20 (the projected blocked_stop row convergence.cjs recorded for iteration 17)
- The matching deep-review-ledger frame, `deep_review.blocked_stop_recorded`, decoded from canonical_event_bytes

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
- OPUS-F005-P2-001 confirmed live. This lineage's own recorded event carries `activeFindingCounts: {candidates: 13, adjudicated: 13, p0: 0, p1: 2, p2: 11}`. "Adjudicated" counts all 11 P2 findings, which have no claim-adjudication packets. The severity stays P2: here the blocker is dimensionCoverageGate, not claimAdjudicationGate, so the contradiction this case shows is the P2 count, not a gate conflict.
- OPUS-F005-P2-002 confirmed live. The projected state row at deep-review-state.jsonl:20 has exactly the keys `type, event, iteration, run, blockedBy, stopReason, gateResults, graphBlockerDetail, recoveryStrategy, timestamp`, with no `mode`, `sessionId` or `generation`, unlike the documented row in deep-review/references/convergence/convergence.md:142-171. The skipped-gate half of that finding is not exercised here, because this is a v2 run where the two v2 gates ran (`skipped: false`).
- The blocked-stop ledger event committed at sequence 20 names `originatingConvergenceEventId: graph-<session>-g1-i17`, and this lineage appended that graph event at sequence 21. The script records the block before the workflow appends the convergence event it names. That matches the YAML order, so the reference is forward by design.

## Edge Cases
- The block is legitimate rather than a stuck loop. The only failing input is the hard spec_code result, which is real (OPUS-F001-P2-004). A lineage reviewing code that no packet requirement governs therefore always runs to its iteration cap under `stopPolicy: convergence`. This is recorded as an operator-relevant consequence of the gate design, not raised as a defect.

## Confirmed-Clean Surfaces
- recordBlockedStop wrote exactly one event for iteration 17 with blocker set `[dimensionCoverageGate]`, and its gateResults carry one `fail` row, which satisfies the ledger's semantic rule.

## Ruled Out
- Escalating OPUS-F005-P2-001 to P1: the live case does not involve the claim-adjudication gate.

## Next Focus
- Dimension: correctness (recovery)
- Focus area: line-level reread of the OPUS-F003-P1-002 consequence: the live-lineage refusal at run start
- Reason: recovery pass inside F-1-003
- Rotation status: frontier drained; recovery passes until maxIterations
- Required evidence: file:line

Review verdict: CONDITIONAL
