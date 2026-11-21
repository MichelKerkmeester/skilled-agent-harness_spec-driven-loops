# Iteration 019 - Recovery: line-level reread of the pid-reuse path

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: recovery (convergence for iteration 18 returned STUCK_RECOVERY; `deep_review.recovery_started` recorded at ledger sequence 25)
- Strategy: escalate severity review on OPUS-F003-P1-002 inside F-1-003 scope
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1016-1031, 4346-4360

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None new.

### P2 Findings
None.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- The run-start refusal confirms and sharpens OPUS-F003-P1-002. Before any orphan mark or spawn, `main` calls `detectLiveLineages` on the ledger and throws "fan-out refused: lineage still running from an earlier run: <label> (pid N). Stop it before re-running." (fanout-run.cjs:4351-4359). After pid reuse, that message names an unrelated process as a lineage and tells the operator to stop it. The documented control for that is `--stop`, which shares the same detection (:1026) and sends SIGTERM to that process's group (:1030). The refusal turns a stale ledger row into an instruction that leads to the harmful action. The finding keeps P1: the precondition (a stale open row plus a reused pid that leads a group) is unchanged, so this is not escalated to P0.

## Edge Cases
- A reused pid that belongs to another user returns EPERM, counts as live and blocks every rerun of this run directory until that process exits, with no way to clear it except editing the committed ledger by hand.

## Confirmed-Clean Surfaces
- The refusal runs before `markOrphanedLineages`, so a really live lineage is never also requeued as an orphan (fanout-run.cjs:4347-4350 comment and order).

## Ruled Out
- Escalating OPUS-F003-P1-002 to P0: the harm needs pid reuse by a group leader plus an operator `--stop`, so it is not an unconditional immediate harm.

## Next Focus
- Dimension: correctness (recovery)
- Focus area: OPUS-F001-P2-001, look for primary evidence of the claude stream-json event shape in the installed CLI
- Reason: the only finding still resting on inference that a read could settle
- Rotation status: recovery passes until maxIterations
- Required evidence: file:line or a captured event shape

Review verdict: CONDITIONAL
