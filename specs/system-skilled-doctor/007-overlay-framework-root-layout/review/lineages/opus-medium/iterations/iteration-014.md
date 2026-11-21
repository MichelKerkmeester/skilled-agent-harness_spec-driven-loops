# Iteration 014 - Recovery: severity escalation and function-level pass (maintainability, correctness)

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Trigger: STUCK_RECOVERY after iteration 13 (stuck=3). A deep_review.recovery_started event was recorded through the gateway before this iteration (strategy escalate-severity-review, target dimension maintainability, the least-passed dimension tied with security and traceability).
- Recovery strategies used: (1) escalate severity review, re-reading every active P2 for a P1 case; (2) change granularity, function by function through relayoutUnderLock's code outside its guarded block.
- Review focus addressed: rollback correctness and error contract at the edges of the relayout run.
- Sources: steer.md absent; strategy; conv-013 stop decision.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6490-6508` (backup copy before the guarded block), `.skilled/commands/doctor/scripts/overlay-engine.cjs:6552-6558` (prune after it), `.skilled/commands/doctor/scripts/overlay-engine.cjs:4705-4710` (pruneEmptyParents)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6636-6667` (main: a thrown error prints "[overlay-engine] <message>" and returns exit 2)
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:111-117` (relayout exit handling)
- Every active P2 in the registry (escalation pass)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. Escalation pass: no active P2 has a case that reaches a P1 impact. R1-P2-001 needs an operator to delete the moved folder after a double failure; R5-P2-001 needs the operator to plant the link; the record and doc findings misinform but break nothing. All stay P2.

### P2 Findings

1. **A relayout that fails outside its guarded block exits 2 with a raw engine error the apply workflow has no rule for, and the prune case reports failure for a relayout that completed** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:6554 -- The guarded block covers the moves, the manifest write and the relinks (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6514-6550`). The backup copies run before it (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6501-6504`) and the empty-folder prune runs after it (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6554`); the comment says pruning happens "once nothing can fail", but pruneEmptyParents calls rmdirSync (`.skilled/commands/doctor/scripts/overlay-engine.cjs:4708`), which can throw. Either throw reaches main's catch and prints "[overlay-engine] <message>" with exit 2 (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6661-6665`). After a prune failure every copy has moved and the manifest names the new paths, yet the run never prints its moved count or "run ... apply", and exits as a failure. A backup-copy failure leaves a partial relayout-runs/<stamp> folder behind. The apply workflow's exit-2 rules (`.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:114-116`) cover refuse lines and "error: relayout failed while" lines only, so it has no reading for either case, and it does not run the apply that rewrites destinations.
   - Finding class: error-contract-gap
   - Scope proof: the two unguarded write steps of relayoutUnderLock; every other write is inside the try.
   - Affected surface hints: relayoutUnderLock prune and backup steps; doctor-overlay-apply.yaml relayout exit-2 rules; references/overlays.md relayout failure paragraph.
   - Case: relayout moves custom/place.md, writes the manifest, then rmdirSync on the emptied custom/ folder fails with EACCES; the engine prints "[overlay-engine] EACCES ..." and exits 2 although the move and manifest write are done.

## Traceability Checks

- spec_code: partial. Phase 006 REQ-001 covers failures of a move, the manifest write or a relink; the two unguarded steps are outside its words but inside its intent ("leave no half-moved overlay folder").

## Edge Cases

- Process slip: the recovery_started event belonged after iteration 12's STUCK_RECOVERY decision and was recorded only after iteration 13's. Iteration 13 therefore ran as a recovery iteration without its event. The ledger now carries the event, and this iteration is the first after it.
- A prune failure leaves a consistent tree: destinations still match their old copies' bytes, so status stays in sync; the harm is the wrong exit and the missing next step, not data loss.

## Confirmed-Clean Surfaces

- pruneEmptyParents stops at the overlay root (`.skilled/commands/doctor/scripts/overlay-engine.cjs:4706`), so it never removes the folder itself.

## Ruled Out

- P2-to-P1 escalation for any active P2: no case reaches a broken tree or a bypassed gate.

## Next Focus

- Dimension: none
- Focus area: synthesis if the stop decision allows it
- Reason: recovery produced one new finding; all nodes answered
- Rotation status: complete
- Required evidence: stop decision after this iteration

Review verdict: CONDITIONAL
