# Iteration 021 - Recovery: severity check on the stamp-omission finding

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery (convergence for iteration 20 returned STUCK_RECOVERY; `deep_review.recovery_started` recorded at ledger sequence 31)
- Strategy: escalate or downgrade OPUS-F001-P2-003 by checking every gate that reads an iteration record before the fan-out merge
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:358-426 (executor provenance), 470-625 (verify checks), 636-671 (CLI)

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
- `verify-iteration.cjs` checks, in order: dispatch failure, narrative present and non-empty, final verdict line, state log well-formed, iteration record present, delta present and well-formed, findings enumerated, route proof, executor provenance and ledger backing (verify-iteration.cjs:470-625). It has no check on the record's `timestamp`. A grep for `timestamp` in the file returns nothing. OPUS-F001-P2-003 therefore stands at P2: nothing between the leaf and the merge rejects a record that leaves the stamp off, and the stamp-based anomaly checks then judge the gateway clock. It is not escalated, because the commit-gap rule still flags batched commits and the gateway receipt still proves each record's commit time.
- For fan-out lineages, executor provenance is read from `invocation-metadata.json` rather than the state log (verify-iteration.cjs:375-383, 408-415). This lineage's metadata names `cli-claude-code`, matching its config, and a sample run of the verifier on iterations 1, 2, 6, 17 and 20 printed `OK iteration N complete: narrative + route-proof + delta` for each.

## Edge Cases
- `isFanoutLineage` also treats any artifact directory whose parent is named `lineages` as a fan-out lineage (verify-iteration.cjs:382). A non-fan-out run placed under a folder by that name would skip the state-log provenance check. That is outside the range and not raised.

## Confirmed-Clean Surfaces
- The verifier itself writes nothing: its CLI only prints to stdout or stderr (verify-iteration.cjs:636-671).

## Ruled Out
- Downgrading OPUS-F001-P2-003: no gate rejects a stamp-less record.

## Next Focus
- Dimension: security (recovery)
- Focus area: OPUS-F006-P2-002, settle the 20 MB margin by sizing this lineage's own expected stream from its tool-result volume
- Reason: escalation review
- Rotation status: recovery passes until maxIterations
- Required evidence: file:line

Review verdict: CONDITIONAL
