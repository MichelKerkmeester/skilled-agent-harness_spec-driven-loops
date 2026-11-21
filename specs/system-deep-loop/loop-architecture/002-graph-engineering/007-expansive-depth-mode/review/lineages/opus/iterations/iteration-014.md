# Iteration 014 - Frontier node F-1-003: maintainability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-003 (depth 1), dimension maintainability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-003 maintainability, convergence decision for iteration 13 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:603-645 (formatFanoutStatusTable, statusForLedgerEvent), 1040-1047, 4416-4423
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:328-343

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **One ledger event name, `stopped`, carries two shapes, and only the label tells them apart** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4418 -- `--stop` writes `{event:'stopped', status:'stopped', label, pid, rerun_command}` per lineage (fanout-run.cjs:1043-1047). The runner's own signal path writes a run-level `{event:'stopped', signal, gauges}` with no label (:4417-4422). Every reader has to know that the label decides which one it holds. `collectOpenLineages` (fanout-pool.cjs:328-331) and `formatFanoutStatusTable` (fanout-run.cjs:610-611) both drop label-less rows. That makes a signal stop invisible to them, which is the mechanism behind OPUS-F003-P1-001. It also shows on `--status`: after a SIGHUP or parent-death stop, every lineage keeps its last label-bearing status, normally `running` from its last progress row, so the read-only view reports a stopped run as running. A distinct run-level event name, or the signal path also writing one labelled row per active lineage, would remove the ambiguity.
   Finding class: cross-consumer
   Scope proof: grep for 'stopped' in fanout-run.cjs and fanout-pool.cjs returns the two producers (:1044, :4418) and the two consumers (fanout-pool.cjs:342, fanout-run.cjs:635)
   Affected surface hints: fanout-run.cjs writeStoppedSummary row; fanout-run.cjs formatFanoutStatusTable; fanout-pool.cjs collectOpenLineages
   Case: a run is ended by SIGHUP, and `fanout-run.cjs --status` then prints both lineages as running with their last progress counts.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- `statusForLedgerEvent` maps `event:'stopped'` to `stopped` (fanout-run.cjs:635). The table never reaches it for the run-level row, because the row is dropped first for having no label (:610).

## Edge Cases
- `stopLiveFanoutRun` and `writeStoppedSummary` stop processes the same way, SIGTERM to each group, but through two different paths (`signalIfPresent(-pid)` and `terminateLineageProcess(child)`). Both are short, so this duplication is not raised.

## Confirmed-Clean Surfaces
- `FORWARDED_SIGNALS` and `signalExitCode` are the single source for the forwarded set and exit codes, shared by the bootstrap and the child (fanout-run.cjs:71, 476-480).

## Ruled Out
- Duplicate kill helpers as a finding: short and behaviorally equal.

## Next Focus
- Dimension: maintainability
- Focus area: F-1-005 maintainability
- Reason: frontier round-robin
- Rotation status: F-1-003 complete on all four dimensions
- Required evidence: file:line

Review verdict: PASS
